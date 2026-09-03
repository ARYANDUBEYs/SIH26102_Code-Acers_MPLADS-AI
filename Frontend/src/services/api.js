/**
 * API Adapter Layer
 * --------------------
 * This used to return 100% hardcoded mock data. It now calls the real
 * FastAPI backend (Backend/) for everything the backend actually supports,
 * and keeps mock data ONLY for the handful of things the backend has no
 * equivalent for yet (SLA alerts, citizen reports, notifications) — those
 * are clearly marked below.
 *
 * Every function still returns the same { data, success } shape the rest
 * of the app already expects, and every project object still has the same
 * field names (id, name, riskScore, riskLevel, ...) the existing pages use
 * — so pages didn't need to change, only this file did. Fields the backend
 * has no data for (mpName, implementingAgency, etc.) get an honest
 * placeholder string instead of a fabricated value, so nothing crashes
 * calling .toLowerCase() on them, but nothing pretends to be real either.
 */
import {
  MONTHLY_ANOMALY_TRENDS,
  SLA_ALERTS_LIST,
  CITIZEN_REPORTS_LIST,
  NOTIFICATIONS_LIST
} from './mockData';
import { getRiskMeta } from '../utils/helpers';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

// Rough state-name -> code lookup for the map/chart UI. Not an official
// ISO list, just enough for the states this dataset is likely to contain;
// falls back to the first two letters of the state name if not found.
const STATE_CODES = {
  'Maharashtra': 'MH', 'Rajasthan': 'RJ', 'Bihar': 'BR', 'Delhi': 'DL',
  'Assam': 'AS', 'Karnataka': 'KA', 'West Bengal': 'WB', 'Uttar Pradesh': 'UP',
  'Kerala': 'KL', 'Tamil Nadu': 'TN', 'Gujarat': 'GJ', 'Punjab': 'PB',
  'Haryana': 'HR', 'Madhya Pradesh': 'MP', 'Odisha': 'OD', 'Telangana': 'TG',
  'Andhra Pradesh': 'AP', 'Jharkhand': 'JH', 'Chhattisgarh': 'CG',
  'Uttarakhand': 'UK', 'Himachal Pradesh': 'HP', 'Goa': 'GA',
};

// Turns a backend explainable_flags string into a category the frontend's
// existing ANOMALY_TYPES/filter dropdowns already know about.
function classifyFlag(flagText) {
  const t = flagText.toLowerCase();
  if (t.includes('duplicate') || t.includes('visual evidence') || t.includes('tamper')) return 'DUPLICATE_IMAGE';
  if (t.includes('vendor') || t.includes('monopol')) return 'VENDOR_CARTEL';
  if (t.includes('timeline') || t.includes('overrun') || t.includes('schedule')) return 'TIMELINE_DELAY';
  if (t.includes('financial') || t.includes('drift') || t.includes('cost')) return 'COST_ANOMALY';
  if (t.includes('location') || t.includes('gps') || t.includes('geo')) return 'GEO_MISMATCH';
  return 'COST_ANOMALY'; // generic fallback bucket (includes "ML Model Alert" statistical flags)
}

function flagsToAnomalies(flags = []) {
  return flags.map((text, i) => {
    const type = classifyFlag(text);
    const severity = text.startsWith('CRITICAL') || type === 'DUPLICATE_IMAGE' || type === 'GEO_MISMATCH' ? 'CRITICAL'
      : (type === 'VENDOR_CARTEL' || type === 'COST_ANOMALY') ? 'HIGH' : 'MEDIUM';
    return {
      id: `FLAG-${i}`,
      type,
      title: text.split(':')[0] || 'AI Flag',
      severity,
      confidence: null, // backend doesn't emit a per-flag confidence number, so we don't fabricate one
      description: text,
      evidence: 'Automated MPLADS-AI multi-factor risk analysis (see project score breakdown).',
    };
  });
}

function deriveStatus(riskKey, progressPct) {
  if (progressPct >= 100) return 'COMPLETED';
  if (riskKey === 'CRITICAL') return 'UNDER_INVESTIGATION';
  if (riskKey === 'HIGH') return 'FLAGGED';
  return 'IN_PROGRESS';
}

// Maps one backend project record + its risk assessment into the shape
// every existing page already expects (same field names as the old mock).
function mapToUIProject(raw, assessment) {
  const score = assessment?.overall_risk_score ?? 0;
  const meta = getRiskMeta(score);
  const daysLeft = (raw.allocated_duration_days ?? 0) - (raw.days_elapsed ?? 0);

  return {
    id: raw.project_id,
    name: raw.title,
    category: raw.category,
    location: raw.constituency || raw.district,
    district: raw.district,
    state: raw.state,
    mpName: 'Not available in dataset', // real MPLADS CSV data doesn't carry this field yet
    implementingAgency: 'Not available in dataset',
    contractor: raw.contractor_name,
    sanctionedAmount: raw.sanctioned_amount,
    releasedAmount: raw.funds_released,
    utilizedAmount: raw.funds_utilized,
    remainingAmount: Math.max(0, (raw.sanctioned_amount ?? 0) - (raw.funds_released ?? 0)),
    sanctionDate: raw.sanction_date,
    startDate: raw.sanction_date,
    targetDate: raw.expected_completion_date,
    currentStage: raw.physical_progress_pct >= 100 ? 'Completed' : raw.physical_progress_pct > 0 ? 'Work Progress' : 'Not Started',
    progressPercent: raw.physical_progress_pct,
    status: deriveStatus(meta.key, raw.physical_progress_pct ?? 0),
    riskScore: score,
    riskLevel: meta.key,
    coordinates: [raw.latitude, raw.longitude],
    lastUpdated: raw.sanction_date,
    slaDaysLeft: daysLeft,
    slaUrgency: daysLeft < 0 ? 'CRITICAL' : daysLeft <= 7 ? 'HIGH' : daysLeft <= 21 ? 'MEDIUM' : 'LOW',
    images: undefined, // no real photo evidence attached to CSV-imported records — see Evidence Lab for live photo verification instead
    anomalies: flagsToAnomalies(assessment?.explainable_flags),
    recommendedAction: assessment?.recommended_action,
    overrunProbability: assessment?.overrun_probability,
    timeline: undefined, // let pages fall back to their own generic placeholder timeline
  };
}

// Simple in-memory cache so multiple components on the same page don't
// each re-fetch + re-score every project independently. Cleared on reload.
let _cache = null;
let _cachePromise = null;

async function loadAllScoredProjects() {
  if (_cache) return _cache;
  if (_cachePromise) return _cachePromise;

  _cachePromise = (async () => {
    try {
      const listRes = await fetch(`${API_BASE}/analytics/projects`);
      if (!listRes.ok) throw new Error(`GET /analytics/projects -> ${listRes.status}`);
      const rawProjects = await listRes.json();

      const assessments = await Promise.all(
        rawProjects.map(async (p) => {
          try {
            const r = await fetch(`${API_BASE}/analytics/score-project/${encodeURIComponent(p.project_id)}`);
            if (!r.ok) return null;
            return await r.json();
          } catch {
            return null;
          }
        })
      );

      _cache = rawProjects.map((raw, i) => mapToUIProject(raw, assessments[i]));
      return _cache;
    } catch (err) {
      console.error('Backend unreachable, falling back to empty project list:', err);
      _cache = [];
      return _cache;
    } finally {
      _cachePromise = null;
    }
  })();

  return _cachePromise;
}

function invalidateCache() {
  _cache = null;
}

export const api = {
  // ---- Backed by the real FastAPI service ----

  getNationalKPIs: async () => {
    const projects = await loadAllScoredProjects();
    const totalFundsCr = projects.reduce((s, p) => s + (p.sanctionedAmount || 0), 0) / 10000000;
    const anomaliesDetected = projects.reduce((s, p) => s + (p.anomalies?.length || 0), 0);
    const highRiskProjects = projects.filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL').length;
    const slaAtRisk = projects.filter(p => p.slaDaysLeft <= 14 && p.progressPercent < 100).length;

    return {
      success: true,
      data: {
        totalProjects: projects.length,
        totalFundsCr: Math.round(totalFundsCr * 10) / 10,
        projectsMonitored: projects.length,
        anomaliesDetected,
        highRiskProjects,
        slaAtRisk,
        trends: {
          totalProjects: 'Live from backend',
          totalFundsCr: 'Live from backend',
          projectsMonitored: '100% of loaded records',
          anomaliesDetected: 'Live from backend',
          highRiskProjects: 'Live from backend',
          slaAtRisk: 'Live from backend',
        },
      },
    };
  },

  getProjects: async (filters = {}) => {
    let projects = await loadAllScoredProjects();

    if (filters.riskLevel && filters.riskLevel !== 'ALL') {
      projects = projects.filter(p => p.riskLevel === filters.riskLevel);
    }
    if (filters.status && filters.status !== 'ALL') {
      projects = projects.filter(p => p.status === filters.status);
    }
    if (filters.state && filters.state !== 'ALL') {
      projects = projects.filter(p => p.state === filters.state);
    }
    if (filters.district && filters.district !== 'ALL') {
      projects = projects.filter(p => p.district === filters.district);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      projects = projects.filter(p =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.contractor.toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
    }

    return { data: projects, total: projects.length, success: true };
  },

  getProjectById: async (id) => {
    const projects = await loadAllScoredProjects();
    const project = projects.find(p => p.id.toLowerCase() === id.toLowerCase());
    if (!project) {
      // Same graceful fallback the old mock had, so pages that assume a
      // project always loads (e.g. deep-linked demo IDs) don't break.
      return { data: projects[0] || null, success: projects.length > 0 };
    }
    return { data: project, success: true };
  },

  getHighRiskProjects: async () => {
    const projects = await loadAllScoredProjects();
    const highRisk = projects.filter(p => p.riskScore >= 60).sort((a, b) => b.riskScore - a.riskScore);
    return { data: highRisk, total: highRisk.length, success: true };
  },

  // NOTE: the backend has no endpoint to persist an officer's decision yet.
  // This updates the in-memory cache for the current session only, so the
  // UI reflects the change immediately, but it's lost on page reload.
  // Add a real POST /analytics/projects/{id}/decision endpoint to make
  // this durable.
  updateProjectDecision: async (projectId, decision, remarks = '') => {
    const projects = await loadAllScoredProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      projects[index] = { ...projects[index], status: decision, decisionRemarks: remarks, lastDecisionAt: new Date().toISOString() };
      return { data: projects[index], success: true };
    }
    return { error: 'Project not found', success: false };
  },

  getCartelNetwork: async (district) => {
    try {
      const projects = await loadAllScoredProjects();
      const targetDistrict = district || projects[0]?.district;
      if (!targetDistrict) return { data: { nodes: [], edges: [], district: '', monopoly_vendors: [] }, success: false };

      const res = await fetch(`${API_BASE}/cartel/matrix?district=${encodeURIComponent(targetDistrict)}`);
      if (!res.ok) throw new Error(`GET /cartel/matrix -> ${res.status}`);
      const data = await res.json();
      return { data, success: true };
    } catch (err) {
      console.error('getCartelNetwork failed:', err);
      return { data: { nodes: [], edges: [], district: district || '', monopoly_vendors: [] }, success: false };
    }
  },

  getAvailableDistricts: async () => {
    const projects = await loadAllScoredProjects();
    return [...new Set(projects.map(p => p.district))];
  },

  getStateRiskData: async () => {
    const projects = await loadAllScoredProjects();
    const byState = {};
    for (const p of projects) {
      if (!byState[p.state]) byState[p.state] = [];
      byState[p.state].push(p);
    }

    const data = Object.entries(byState).map(([state, group]) => {
      const avgScore = group.reduce((s, p) => s + p.riskScore, 0) / group.length;
      const meta = getRiskMeta(avgScore);
      const lats = group.map(p => p.coordinates[0]).filter(Boolean);
      const lons = group.map(p => p.coordinates[1]).filter(Boolean);
      return {
        state,
        code: STATE_CODES[state] || state.slice(0, 2).toUpperCase(),
        totalProjects: group.length,
        anomalies: group.reduce((s, p) => s + (p.anomalies?.length || 0), 0),
        highRisk: group.filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL').length,
        fraudRiskPct: Math.round(avgScore),
        delayed: group.filter(p => p.slaDaysLeft < 0).length,
        center: lats.length ? [lats.reduce((a, b) => a + b, 0) / lats.length, lons.reduce((a, b) => a + b, 0) / lons.length] : [22.5937, 78.9629],
        riskLevel: meta.key,
      };
    });

    return { data, success: true };
  },

  // No historical time-series exists in the backend yet (each project is
  // scored on its current snapshot, there's no month-over-month record) —
  // kept as illustrative mock data until the backend tracks score history.
  getMonthlyTrends: async () => {
    return { data: MONTHLY_ANOMALY_TRENDS, success: true };
  },

  getFraudBreakdown: async () => {
    const projects = await loadAllScoredProjects();
    const counts = { COST_ANOMALY: 0, DUPLICATE_IMAGE: 0, VENDOR_CARTEL: 0, TIMELINE_DELAY: 0, GEO_MISMATCH: 0 };
    for (const p of projects) {
      for (const a of p.anomalies || []) {
        if (counts[a.type] !== undefined) counts[a.type] += 1;
      }
    }
    const labelMap = {
      COST_ANOMALY: ['Cost / Financial Drift Anomalies', '#EAB308'],
      DUPLICATE_IMAGE: ['Duplicate Evidence / Photo Fraud', '#EF4444'],
      VENDOR_CARTEL: ['Vendor Cartel & Monopoly', '#F97316'],
      TIMELINE_DELAY: ['SLA / Timeline Delay', '#3B82F6'],
      GEO_MISMATCH: ['Geo-location Mismatch', '#8B5CF6'],
    };
    const data = Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([key, value]) => ({ name: labelMap[key][0], value, color: labelMap[key][1] }));

    return { data, success: true };
  },

  // Real photo forensic verification — actually calls the backend's
  // EXIF-GPS + duplicate-hash + ELA tamper-detection engine.
  verifyEvidence: async ({ currentImageFile, referenceImageFile, sanctionedLat, sanctionedLon, photoLat, photoLon }) => {
    try {
      const form = new FormData();
      form.append('current_image', currentImageFile);
      if (referenceImageFile) form.append('reference_image', referenceImageFile);
      form.append('sanctioned_lat', sanctionedLat);
      form.append('sanctioned_lon', sanctionedLon);
      if (photoLat != null) form.append('photo_lat', photoLat);
      if (photoLon != null) form.append('photo_lon', photoLon);

      const res = await fetch(`${API_BASE}/forensics/verify-images`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`POST /forensics/verify-images -> ${res.status}`);
      const data = await res.json();
      return { data, success: true };
    } catch (err) {
      console.error('verifyEvidence failed:', err);
      return { data: null, success: false, error: String(err) };
    }
  },

  // Real CSV bulk-import into the backend (Mongo or in-memory, whichever
  // is configured server-side).
  importProjectsCSV: async (file) => {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/analytics/projects/import`, { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) invalidateCache(); // refresh cached project list next time it's requested
      return { data, success: res.ok };
    } catch (err) {
      console.error('importProjectsCSV failed:', err);
      return { data: null, success: false, error: String(err) };
    }
  },

  // Role-scoped dashboard summary (MP / DISTRICT_AUTHORITY / STATE_NODAL / MINISTRY)
  getDashboardSummary: async (role, scope) => {
    try {
      const params = new URLSearchParams({ role });
      if (scope) params.set('scope', scope);
      const res = await fetch(`${API_BASE}/dashboard/summary?${params}`);
      if (!res.ok) throw new Error(`GET /dashboard/summary -> ${res.status}`);
      const data = await res.json();
      return { data, success: true };
    } catch (err) {
      console.error('getDashboardSummary failed:', err);
      return { data: null, success: false, error: String(err) };
    }
  },

  // ---- Not backed by the real API yet — the backend has no endpoints for
  // these, so they stay as in-memory mock data. Kept in the same shape so
  // the pages using them keep working; wire these up once the backend
  // grows the matching endpoints. ----

  getSLAAlerts: async () => {
    return { data: SLA_ALERTS_LIST, success: true };
  },

  getCitizenReports: async () => {
    return { data: CITIZEN_REPORTS_LIST, success: true };
  },

  submitCitizenReport: async (reportData) => {
    const newReport = {
      id: `CIT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Under Verification',
      ...reportData
    };
    return { data: newReport, success: true };
  },

  getNotifications: async () => {
    return { data: NOTIFICATIONS_LIST, success: true };
  },

  markNotificationRead: async () => {
    return { success: true };
  }
};
