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
import { useLanguage } from '../../context/LanguageContext';

export const DashboardStats = ({ kpis = {} }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const cards = [
    {
      title: t('kpi_total_projects', 'Total Projects'),
      value: kpis.totalProjects?.toLocaleString() || '12,482',
      subtitle: t('kpi_total_projects_sub', 'All 28 States & UTs'),
      icon: FolderGit2,
      trend: kpis.trends?.totalProjects,
      trendPositive: true,
      variant: "default",
      onClick: () => navigate('/projects')
    },
    {
      title: t('kpi_total_funds', 'Total Funds'),
      value: `₹${kpis.totalFundsCr || '2,486'} Cr`,
      subtitle: t('kpi_total_funds_sub', 'Sanctioned in FY 25-26'),
      icon: IndianRupee,
      trend: kpis.trends?.totalFundsCr,
      trendPositive: true,
      variant: "blue",
      onClick: () => navigate('/analytics')
    },
    {
      title: t('kpi_ai_monitored', 'AI Monitored'),
      value: kpis.projectsMonitored?.toLocaleString() || '11,920',
      subtitle: t('kpi_ai_monitored_sub', '95.5% Data Coverage'),
      icon: ShieldCheck,
      trend: "Continuous AI Scan",
      trendPositive: true,
      variant: "success",
      onClick: () => navigate('/projects')
    },
    {
      title: t('kpi_anomalies', 'Anomalies Detected'),
      value: kpis.anomaliesDetected || '183',
      subtitle: t('kpi_anomalies_sub', 'Cost, photo & cartels'),
      icon: AlertTriangle,
      trend: kpis.trends?.anomaliesDetected,
      trendPositive: true,
      variant: "danger",
      onClick: () => navigate('/high-risk')
    },
    {
      title: t('kpi_high_risk', 'High Risk Projects'),
      value: kpis.highRiskProjects || '42',
      subtitle: t('kpi_high_risk_sub', 'Requires immediate review'),
      icon: AlertOctagon,
      trend: kpis.trends?.highRiskProjects,
      trendPositive: false,
      variant: "danger",
      onClick: () => navigate('/high-risk')
    },
    {
      title: t('kpi_sla_risk', 'SLA At Risk'),
      value: kpis.slaAtRisk || '96',
      subtitle: t('kpi_sla_risk_sub', '12 critical (<48h)'),
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.04, ease: "easeOut" }}
        >
          <DashboardCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};
