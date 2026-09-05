import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { AdminDashboard } from './AdminDashboard';
import { DistrictDashboard } from './DistrictDashboard';
import { PublicCommandDashboard } from './PublicCommandDashboard';

export const Dashboard = () => {
  const { role } = useAuth();

  if (role === ROLES.CITIZEN) {
    return <PublicCommandDashboard />;
  }

  if (role === ROLES.DISTRICT_OFFICER) {
    return <DistrictDashboard />;
  }

  return <AdminDashboard />;
};
