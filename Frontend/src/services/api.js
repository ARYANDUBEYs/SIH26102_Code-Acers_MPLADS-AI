import {
  NATIONAL_KPIS,
  MOCK_PROJECTS,
  STATE_RISK_DATA,
  MONTHLY_ANOMALY_TRENDS,
  FRAUD_VS_INEFFICIENCY,
  CARTEL_NETWORK_DATA,
  SLA_ALERTS_LIST,
  CITIZEN_REPORTS_LIST,
  NOTIFICATIONS_LIST
} from './mockData';

// In-memory mutable state for live interactive demo actions
let liveProjects = [...MOCK_PROJECTS];
let liveCitizenReports = [...CITIZEN_REPORTS_LIST];
let liveNotifications = [...NOTIFICATIONS_LIST];

export const api = {
  // KPIs & Analytics
  getNationalKPIs: async () => {
    return { data: NATIONAL_KPIS, success: true };
  },

  getStateRiskData: async () => {
    return { data: STATE_RISK_DATA, success: true };
  },

  getMonthlyTrends: async () => {
    return { data: MONTHLY_ANOMALY_TRENDS, success: true };
  },

  getFraudBreakdown: async () => {
    return { data: FRAUD_VS_INEFFICIENCY, success: true };
  },

  // Projects
  getProjects: async (filters = {}) => {
    let filtered = [...liveProjects];

    if (filters.riskLevel && filters.riskLevel !== 'ALL') {
      filtered = filtered.filter(p => p.riskLevel === filters.riskLevel);
    }
    if (filters.status && filters.status !== 'ALL') {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters.state && filters.state !== 'ALL') {
      filtered = filtered.filter(p => p.state === filters.state);
    }
    if (filters.district && filters.district !== 'ALL') {
      filtered = filtered.filter(p => p.district === filters.district);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.contractor.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
    }

    return { data: filtered, total: filtered.length, success: true };
  },

  getProjectById: async (id) => {
    const project = liveProjects.find(p => p.id.toLowerCase() === id.toLowerCase());
    if (!project) {
      // Return fallback to flagship if ID is 124 or similar
      return { data: liveProjects[0], success: true };
    }
    return { data: project, success: true };
  },

  getHighRiskProjects: async () => {
    const highRisk = liveProjects.filter(p => p.riskScore >= 60);
    return { data: highRisk, total: highRisk.length, success: true };
  },

  // Project Decision Mutations (District Officer / Admin Action)
  updateProjectDecision: async (projectId, decision, remarks = '') => {
    const index = liveProjects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      liveProjects[index] = {
        ...liveProjects[index],
        status: decision,
        decisionRemarks: remarks,
        lastDecisionAt: new Date().toISOString(),
      };
      return { data: liveProjects[index], success: true };
    }
    return { error: 'Project not found', success: false };
  },

  // Cartel Network
  getCartelNetwork: async () => {
    return { data: CARTEL_NETWORK_DATA, success: true };
  },

  // SLA Alerts
  getSLAAlerts: async () => {
    return { data: SLA_ALERTS_LIST, success: true };
  },

  // Citizen Reports
  getCitizenReports: async () => {
    return { data: liveCitizenReports, success: true };
  },

  submitCitizenReport: async (reportData) => {
    const newReport = {
      id: `CIT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Under Verification',
      ...reportData
    };
    liveCitizenReports = [newReport, ...liveCitizenReports];
    return { data: newReport, success: true };
  },

  // Notifications
  getNotifications: async () => {
    return { data: liveNotifications, success: true };
  },

  markNotificationRead: async (id) => {
    liveNotifications = liveNotifications.map(n => n.id === id ? { ...n, unread: false } : n);
    return { success: true };
  }
};
