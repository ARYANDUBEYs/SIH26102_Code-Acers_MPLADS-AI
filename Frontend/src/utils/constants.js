export const ROLES = {
  MOSPI_ADMIN: 'mospi_admin',
  DISTRICT_OFFICER: 'district_officer',
  CITIZEN: 'citizen',
};

export const ROLE_LABELS = {
  [ROLES.MOSPI_ADMIN]: 'MoSPI Central Admin',
  [ROLES.DISTRICT_OFFICER]: 'District Officer',
  [ROLES.CITIZEN]: 'Public / Citizen',
};

export const RISK_LEVELS = {
  LOW: {
    label: 'Low Risk',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    hex: '#22C55E',
    range: '0 - 30',
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hex: '#EAB308',
    range: '31 - 60',
  },
  HIGH: {
    label: 'High Risk',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    hex: '#F97316',
    range: '61 - 85',
  },
  CRITICAL: {
    label: 'Critical Risk',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-critical-pulse',
    hex: '#EF4444',
    range: '86 - 100',
  },
};

export const ANOMALY_TYPES = {
  COST_ANOMALY: {
    id: 'COST_ANOMALY',
    label: 'Cost Anomaly',
    description: 'Reported cost is significantly above regional baseline for this work category.',
    icon: 'IndianRupee',
    severity: 'HIGH',
  },
  DUPLICATE_IMAGE: {
    id: 'DUPLICATE_IMAGE',
    label: 'Duplicate Image',
    description: 'Image similarity match detected with another existing or previous project.',
    icon: 'Copy',
    severity: 'CRITICAL',
  },
  VENDOR_CARTEL: {
    id: 'VENDOR_CARTEL',
    label: 'Vendor Cartel Pattern',
    description: 'Vendor exhibits repeat circular bidding & shared registration with competitor firms.',
    icon: 'Network',
    severity: 'HIGH',
  },
  TIMELINE_DELAY: {
    id: 'TIMELINE_DELAY',
    label: 'Timeline Anomaly',
    description: 'Reported completion timeline is drastically delayed or inconsistent with physical progress.',
    icon: 'Clock',
    severity: 'MEDIUM',
  },
  GEO_MISMATCH: {
    id: 'GEO_MISMATCH',
    label: 'Geo-location Mismatch',
    description: 'Exif metadata GPS coordinates do not match the assigned constituency/village boundary.',
    icon: 'MapPin',
    severity: 'CRITICAL',
  },
  UNDER_UTILIZED: {
    id: 'UNDER_UTILIZED',
    label: 'Under-utilized Funds',
    description: 'Disbursed installments remain unspent for >180 days with zero physical milestone updates.',
    icon: 'AlertTriangle',
    severity: 'MEDIUM',
  },
};

export const PROJECT_STATUS = {
  UNDER_INVESTIGATION: { label: 'Under Investigation', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  FLAGGED: { label: 'AI Flagged', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  PENDING_REVIEW: { label: 'Pending Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  VERIFIED: { label: 'AI Verified', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  COMPLETED: { label: 'Completed', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  REJECTED: { label: 'Rejected', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
};

export const DEMO_USERS = [
  {
    id: 'USR-MOSPI-01',
    email: 'admin.mospi@gov.in',
    name: 'Dr. Rajeshwar Sharma',
    designation: 'Joint Secretary & National Director',
    department: 'Ministry of Statistics and Programme Implementation (MoSPI)',
    role: ROLES.MOSPI_ADMIN,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: 'Central MoSPI Admin',
  },
  {
    id: 'USR-DIST-07',
    email: 'dm.varanasi@up.gov.in',
    name: 'Priyanka Verma, IAS',
    designation: 'District Magistrate & Project Officer',
    department: 'District Administration, Varanasi, Uttar Pradesh',
    role: ROLES.DISTRICT_OFFICER,
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badge: 'District Officer',
  },
  {
    id: 'USR-CIT-108',
    email: 'citizen.amit@gmail.com',
    name: 'Amit Patel',
    designation: 'Citizen / RTI Activist',
    department: 'Public Transparency Portal',
    role: ROLES.CITIZEN,
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: 'Citizen Explorer',
  },
];
