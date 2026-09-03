import React from 'react';
import { motion } from 'framer-motion';
import { DashboardCard } from './DashboardCard';
import {
  FolderGit2,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardStats = ({ kpis = {} }) => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Total Projects",
      value: kpis.totalProjects?.toLocaleString() || '12,482',
      subtitle: "All 28 States & UTs",
      icon: FolderGit2,
      trend: kpis.trends?.totalProjects,
      trendPositive: true,
      variant: "default",
      onClick: () => navigate('/projects')
    },
    {
      title: "Total Funds",
      value: `₹${kpis.totalFundsCr || '2,486'} Cr`,
      subtitle: "Sanctioned in FY 25-26",
      icon: IndianRupee,
      trend: kpis.trends?.totalFundsCr,
      trendPositive: true,
      variant: "blue",
      onClick: () => navigate('/analytics')
    },
    {
      title: "AI Monitored",
      value: kpis.projectsMonitored?.toLocaleString() || '11,920',
      subtitle: "95.5% Data Coverage",
      icon: ShieldCheck,
      trend: "Continuous AI Scan",
      trendPositive: true,
      variant: "success",
      onClick: () => navigate('/projects')
    },
    {
      title: "Anomalies Detected",
      value: kpis.anomaliesDetected || '183',
      subtitle: "Cost, photo & cartels",
      icon: AlertTriangle,
      trend: kpis.trends?.anomaliesDetected,
      trendPositive: true,
      variant: "danger",
      onClick: () => navigate('/high-risk')
    },
    {
      title: "High Risk Projects",
      value: kpis.highRiskProjects || '42',
      subtitle: "Requires immediate review",
      icon: AlertOctagon,
      trend: kpis.trends?.highRiskProjects,
      trendPositive: false,
      variant: "danger",
      onClick: () => navigate('/high-risk')
    },
    {
      title: "SLA At Risk",
      value: kpis.slaAtRisk || '96',
      subtitle: "12 critical (<48h)",
      icon: Clock,
      trend: kpis.trends?.slaAtRisk,
      trendPositive: false,
      variant: "warning",
      onClick: () => navigate('/sla')
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.05, ease: "easeOut" }}
        >
          <DashboardCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};
