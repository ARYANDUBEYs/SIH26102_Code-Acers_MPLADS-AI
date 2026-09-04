export const FALLBACK_PROJECTS = [
  {
    id: "MPLAD-2026-00124",
    name: "Rural Road Construction & Paver Block Laying",
    category: "Roads, Pathways and Bridges",
    location: "Chiraigaon Block, Varanasi, Uttar Pradesh",
    district: "Varanasi",
    state: "Uttar Pradesh",
    mpName: "Shri Narendra Modi (Varanasi PC)",
    implementingAgency: "Rural Engineering Dept (RED) Varanasi",
    contractor: "Apex Infra & BuildTech Pvt Ltd",
    sanctionedAmount: 4800000,
    releasedAmount: 3200000,
    utilizedAmount: 2100000,
    remainingAmount: 1600000,
    sanctionDate: "2025-08-15",
    startDate: "2025-09-01",
    targetDate: "2026-03-31",
    currentStage: "Sub-base Compaction & Interlocking Pavement",
    progressPercent: 45,
    status: "FLAGGED",
    riskScore: 87,
    riskLevel: "HIGH",
    coordinates: [25.3176, 82.9739],
    lastUpdated: new Date().toISOString(),
    slaDaysLeft: -109,
    slaUrgency: "CRITICAL",
    images: {
      uploaded: "/evidence/MPLAD-2026-00124.svg"
    },
    anomalies: [
      {
        id: "MPLAD-2026-00124-AI-1",
        type: "DUPLICATE_IMAGE",
        title: "Duplicate Evidence Photo Detected (96.4% dHash Collision with Solapur Works)",
        severity: "CRITICAL",
        confidence: 96,
        description: "64-bit Difference Hashing and Hamming distance (d=2) detected exact recycled site photograph from Solapur rural road audit.",
        evidence: "OpenCV dHash perceptual fingerprint collision detected across district boundary."
      },
      {
        id: "MPLAD-2026-00124-AI-2",
        type: "VENDOR_CARTEL",
        title: "High Bidder Concentration Syndicate (Herfindahl-Hirschman Index HHI = 4,280)",
        severity: "CRITICAL",
        confidence: 89,
        description: "NetworkX graph analysis indicates Apex Infra & BuildTech wins 78% of local tenders through interlocking directorate bidding.",
        evidence: "Bipartite procurement graph shows circular tender co-bidding with Shiva Buildcon."
      },
      {
        id: "MPLAD-2026-00124-AI-3",
        type: "COST_ANOMALY",
        title: "Financial Drift (+5.0% Disbursal Overutilization vs. Physical Progress)",
        severity: "HIGH",
        confidence: 84,
        description: "Cumulative release of ₹32.0 Lakh (66.7%) significantly outpaces certified physical completion rate of 45.0%.",
        evidence: "CPWD Measurement Book (MB) audit discrepancy flagged by mathematical risk engine."
      }
    ],
    overrunProbability: 0.88,
    mlAnomalyScore: 94.2,
    timeline: [
      { stage: "Work Sanctioned", date: "15 Aug 2025", status: "completed" },
      { stage: "Tender Awarded", date: "28 Aug 2025", status: "completed" },
      { stage: "Initial Disbursal (40%)", date: "15 Sep 2025", status: "completed" },
      { stage: "Stage-2 Inspection", date: "10 Jan 2026", status: "completed" },
      { stage: "Forensic AI Flag", date: "04 Feb 2026", status: "in-progress" },
      { stage: "Statutory Resolution", date: "Pending Audit", status: "pending" }
    ]
  },
  {
    id: "MPLAD-2026-00231",
    name: "Multi-purpose Community Hall Construction",
    category: "Community Assets & Halls",
    location: "Rohini Sector 16, North West Delhi, Delhi",
    district: "North West Delhi",
    state: "Delhi",
    mpName: "Yogendra Chandoliya (North West Delhi)",
    implementingAgency: "Municipal Corporation of Delhi (MCD)",
    contractor: "Vanguard Civilcon LLP",
    sanctionedAmount: 3200000,
    releasedAmount: 2800000,
    utilizedAmount: 1400000,
    remainingAmount: 400000,
    sanctionDate: "2025-06-10",
    startDate: "2025-07-01",
    targetDate: "2026-02-28",
    currentStage: "Roof Slab Casting & Electrical Conduit",
    progressPercent: 35,
    status: "UNDER_INVESTIGATION",
    riskScore: 74,
    riskLevel: "HIGH",
    coordinates: [28.7041, 77.1025],
    lastUpdated: new Date().toISOString(),
    slaDaysLeft: -152,
    slaUrgency: "CRITICAL",
    images: {
      uploaded: "/evidence/MPLAD-2026-00231.svg"
    },
    anomalies: [
      {
        id: "MPLAD-2026-00231-AI-1",
        type: "TIMELINE_DELAY",
        title: "Statutory SLA Timeline Breach (>150 Days Construction Overrun)",
        severity: "HIGH",
        confidence: 91,
        description: "Project duration elapsed by 415 days against 263 statutory allocated days with only 35% physical completion.",
        evidence: "Automated SLA tracking model predicts >180 days total completion delay."
      },
      {
        id: "MPLAD-2026-00231-AI-2",
        type: "COST_ANOMALY",
        title: "Unutilized Escrow Disbursal Discrepancy (₹14.0 Lakh Idle Capital)",
        severity: "MEDIUM",
        confidence: 82,
        description: "Funds released to executing agency have remained unspent in treasury account for 4 consecutive quarters.",
        evidence: "Public Financial Management System (PFMS) treasury reconciliation alert."
      }
    ],
    overrunProbability: 0.79,
    mlAnomalyScore: 76.5,
    timeline: [
      { stage: "Work Sanctioned", date: "10 Jun 2025", status: "completed" },
      { stage: "Tender Awarded", date: "24 Jun 2025", status: "completed" },
      { stage: "Foundation Work", date: "12 Aug 2025", status: "completed" },
      { stage: "Brickwork & Lintel", date: "20 Oct 2025", status: "in-progress" },
      { stage: "Final Inspection", date: "Delayed", status: "pending" },
      { stage: "Handover", date: "Pending", status: "pending" }
    ]
  },
  {
    id: "MPLAD-2026-00451",
    name: "Solar Drinking Water RO Plant & Borewell",
    category: "Drinking Water Facilities",
    location: "Ghatol Tehsil, Banswara, Rajasthan",
    district: "Banswara",
    state: "Rajasthan",
    mpName: "Raj Kumar Roat (Banswara)",
    implementingAgency: "Public Health Engineering Dept (PHED)",
    contractor: "SunPower Aqua Solutions",
    sanctionedAmount: 5100000,
    releasedAmount: 4500000,
    utilizedAmount: 4100000,
    remainingAmount: 600000,
    sanctionDate: "2025-04-12",
    startDate: "2025-05-01",
    targetDate: "2025-12-31",
    currentStage: "Commissioning & Solar Inverter Installation",
    progressPercent: 88,
    status: "FLAGGED",
    riskScore: 78,
    riskLevel: "HIGH",
    coordinates: [23.5461, 74.4373],
    lastUpdated: new Date().toISOString(),
    slaDaysLeft: -208,
    slaUrgency: "CRITICAL",
    images: {
      uploaded: "/evidence/MPLAD-2026-00451.svg"
    },
    anomalies: [
      {
        id: "MPLAD-2026-00451-AI-1",
        type: "DUPLICATE_IMAGE",
        title: "Perceptual Hash Duplicate: Reused Borewell Machinery Photo (98.0% Match)",
        severity: "CRITICAL",
        confidence: 98,
        description: "OpenCV dHash matched borewell installation photo identically to a completed 2024 work in Dungarpur district.",
        evidence: "Zero Hamming distance between uploaded solar inverter image and historical database."
      }
    ],
    overrunProbability: 0.81,
    mlAnomalyScore: 82.0,
    timeline: [
      { stage: "Work Sanctioned", date: "12 Apr 2025", status: "completed" },
      { stage: "Borewell Drilling", date: "20 May 2025", status: "completed" },
      { stage: "RO Tank Civil Work", date: "15 Jul 2025", status: "completed" },
      { stage: "Solar Panel Array", date: "28 Sep 2025", status: "in-progress" },
      { stage: "Water Quality Testing", date: "Pending", status: "pending" },
      { stage: "Public Dedication", date: "Pending", status: "pending" }
    ]
  },
  {
    id: "MPLAD-2026-00089",
    name: "Digital Smart Classroom Lab & Computer Setup",
    category: "Education Infrastructure",
    location: "Danapur Sub-Division, Patna, Bihar",
    district: "Patna",
    state: "Bihar",
    mpName: "Shri Ravi Shankar Prasad (Patna Sahib)",
    implementingAgency: "Bihar State Educational Infrastructure Development Corp",
    contractor: "National Infotech Systems",
    sanctionedAmount: 1800000,
    releasedAmount: 1800000,
    utilizedAmount: 1750000,
    remainingAmount: 50000,
    sanctionDate: "2025-09-01",
    startDate: "2025-09-15",
    targetDate: "2026-01-30",
    currentStage: "Hardware Installation & LAN Networking Completed",
    progressPercent: 100,
    status: "VERIFIED",
    riskScore: 14,
    riskLevel: "LOW",
    coordinates: [25.5941, 85.1376],
    lastUpdated: new Date().toISOString(),
    slaDaysLeft: 60,
    slaUrgency: "SAFE",
    images: {
      uploaded: "/evidence/MPLAD-2026-00089.svg"
    },
    anomalies: [],
    overrunProbability: 0.05,
    mlAnomalyScore: 12.1,
    timeline: [
      { stage: "Work Sanctioned", date: "01 Sep 2025", status: "completed" },
      { stage: "Procurement GeM Order", date: "15 Sep 2025", status: "completed" },
      { stage: "Wiring & Networking", date: "20 Oct 2025", status: "completed" },
      { stage: "Computer Systems Installed", date: "15 Dec 2025", status: "completed" },
      { stage: "Officer Verification", date: "10 Jan 2026", status: "completed" },
      { stage: "Operational & Signed Off", date: "25 Jan 2026", status: "completed" }
    ]
  },
  {
    id: "MPLAD-2026-00312",
    name: "Primary Health Centre Upgradation & Neonatal Unit",
    category: "Health & Family Welfare",
    location: "Kerakat Block, Jaunpur, Uttar Pradesh",
    district: "Jaunpur",
    state: "Uttar Pradesh",
    mpName: "Babu Singh Kushwaha (Jaunpur)",
    implementingAgency: "UP Jal Nigam / Construction & Design Services",
    contractor: "Shiva Buildcon Pvt Ltd",
    sanctionedAmount: 6400000,
    releasedAmount: 4800000,
    utilizedAmount: 4600000,
    remainingAmount: 1600000,
    sanctionDate: "2025-07-20",
    startDate: "2025-08-10",
    targetDate: "2026-04-30",
    currentStage: "Structural Masonry & Oxygen Piping",
    progressPercent: 58,
    status: "FLAGGED",
    riskScore: 82,
    riskLevel: "HIGH",
    coordinates: [25.7464, 82.6837],
    lastUpdated: new Date().toISOString(),
    slaDaysLeft: -62,
    slaUrgency: "CRITICAL",
    images: {
      uploaded: "/evidence/MPLAD-2026-00312.svg"
    },
    anomalies: [
      {
        id: "MPLAD-2026-00312-AI-1",
        type: "VENDOR_CARTEL",
        title: "Tender Cartelization Matrix (Cross-District Bid Rotation Syndicate)",
        severity: "CRITICAL",
        confidence: 93,
        description: "NetworkX graph shows Shiva Buildcon rotated 12 public bids with Apex Infra across Varanasi-Jaunpur belt without price competition.",
        evidence: "Bid pricing variance under 0.4% across 8 consecutive e-tenders."
      }
    ],
    overrunProbability: 0.84,
    mlAnomalyScore: 88.0,
    timeline: [
      { stage: "Work Sanctioned", date: "20 Jul 2025", status: "completed" },
      { stage: "Tender Awarded", date: "05 Aug 2025", status: "completed" },
      { stage: "Civil Excavation", date: "15 Sep 2025", status: "completed" },
      { stage: "Structural Works", date: "10 Nov 2025", status: "in-progress" },
      { stage: "Medical Equipment", date: "Pending", status: "pending" },
      { stage: "Commissioning", date: "Pending", status: "pending" }
    ]
  },
  {
    id: "MPLAD-2026-00789",
    name: "High-Mast Solar Lighting & CCTV Surveillance System",
    category: "Public Safety & Electrification",
    location: "Taloda Road, Nandurbar, Maharashtra",
    district: "Nandurbar",
    state: "Maharashtra",
    mpName: "Adv Gowaal Kagada Padavi (Nandurbar ST)",
    implementingAgency: "MSEDCL Nandurbar Division",
    contractor: "Sahyadri Renewable Energy Ltd",
    sanctionedAmount: 2600000,
    releasedAmount: 2200000,
    utilizedAmount: 2150000,
    remainingAmount: 400000,
    sanctionDate: "2025-05-18",
    startDate: "2025-06-01",
    targetDate: "2025-11-30",
    currentStage: "Poles Erected & Battery Inverter Testing",
    progressPercent: 72,
    status: "FLAGGED",
    riskScore: 89,
    riskLevel: "HIGH",
    coordinates: [21.3851, 74.9023],
    lastUpdated: new Date().toISOString(),
    slaDaysLeft: -180,
    slaUrgency: "CRITICAL",
    images: {
      uploaded: "/evidence/MPLAD-2026-00789.svg"
    },
    anomalies: [
      {
        id: "MPLAD-2026-00789-AI-1",
        type: "DUPLICATE_IMAGE",
        title: "Perceptual Hash Duplicate: High-Mast Photo Recycled from Dhule Works",
        severity: "CRITICAL",
        confidence: 97,
        description: "64-bit dHash perceptual fingerprint match confirmed against Dhule Municipal Corporation installation.",
        evidence: "Exact FFT and Hamming distance collision across district boundary."
      }
    ],
    overrunProbability: 0.89,
    mlAnomalyScore: 91.5,
    timeline: [
      { stage: "Work Sanctioned", date: "18 May 2025", status: "completed" },
      { stage: "Material Delivery", date: "10 Jun 2025", status: "completed" },
      { stage: "Foundation & Masts", date: "15 Jul 2025", status: "completed" },
      { stage: "Electrical Sync", date: "20 Aug 2025", status: "in-progress" },
      { stage: "Audit Sign-off", date: "Flagged", status: "pending" },
      { stage: "Commissioning", date: "Pending", status: "pending" }
    ]
  }
];

export function generateFallbackProject(id) {
  return {
    id: id || "MPLAD-2026-00124",
    name: `Parliamentary Constituency Development Work (${id || "MPLAD-2026-00124"})`,
    category: "Roads, Pathways and Bridges",
    location: "Varanasi District, Uttar Pradesh",
    district: "Varanasi",
    state: "Uttar Pradesh",
    mpName: "Shri Narendra Modi (Varanasi PC)",
    implementingAgency: "District Rural Development Agency (DRDA)",
    contractor: "Apex Infra & BuildTech Pvt Ltd",
    sanctionedAmount: 4800000,
    releasedAmount: 3200000,
    utilizedAmount: 2100000,
    remainingAmount: 1600000,
    sanctionDate: "2025-08-15",
    startDate: "2025-09-01",
    targetDate: "2026-03-31",
    currentStage: "Sub-base Compaction & Interlocking Pavement",
    progressPercent: 45,
    status: "FLAGGED",
    riskScore: 87,
    riskLevel: "HIGH",
    coordinates: [25.3176, 82.9739],
    lastUpdated: new Date().toISOString(),
    slaDaysLeft: -109,
    slaUrgency: "CRITICAL",
    images: {
      uploaded: "/evidence/MPLAD-2026-00124.svg"
    },
    anomalies: [
      {
        id: `${id || "MPLAD-2026-00124"}-AI-1`,
        type: "DUPLICATE_IMAGE",
        title: "Duplicate Evidence Photo Detected (96.4% dHash Collision)",
        severity: "CRITICAL",
        confidence: 96,
        description: "64-bit Difference Hashing detected exact recycled site photograph.",
        evidence: "OpenCV dHash perceptual fingerprint collision detected across district boundary."
      },
      {
        id: `${id || "MPLAD-2026-00124"}-AI-2`,
        type: "VENDOR_CARTEL",
        title: "High Bidder Concentration Syndicate (HHI = 4,280)",
        severity: "CRITICAL",
        confidence: 89,
        description: "NetworkX graph analysis indicates vendor syndicate concentration.",
        evidence: "Bipartite procurement graph shows circular tender co-bidding."
      },
      {
        id: `${id || "MPLAD-2026-00124"}-AI-3`,
        type: "COST_ANOMALY",
        title: "Financial Drift (+5.0% Disbursal Overutilization vs. Physical Progress)",
        severity: "HIGH",
        confidence: 84,
        description: "Cumulative release significantly outpaces certified physical completion rate.",
        evidence: "CPWD Measurement Book (MB) audit discrepancy flagged by mathematical risk engine."
      }
    ],
    overrunProbability: 0.88,
    mlAnomalyScore: 94.2,
    timeline: [
      { stage: "Work Sanctioned", date: "15 Aug 2025", status: "completed" },
      { stage: "Tender Awarded", date: "28 Aug 2025", status: "completed" },
      { stage: "Initial Disbursal (40%)", date: "15 Sep 2025", status: "completed" },
      { stage: "Stage-2 Inspection", date: "10 Jan 2026", status: "completed" },
      { stage: "Forensic AI Flag", date: "04 Feb 2026", status: "in-progress" },
      { stage: "Statutory Resolution", date: "Pending Audit", status: "pending" }
    ]
  };
}
