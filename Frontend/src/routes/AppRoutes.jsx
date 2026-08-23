import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { DistrictDashboard } from '../pages/Dashboard/DistrictDashboard';
import { Analytics } from '../pages/Analytics/Analytics';
import { RiskMap } from '../pages/RiskMap/RiskMap';
import { HighRiskQueue } from '../pages/HighRisk/HighRiskQueue';
import { ProjectDetails } from '../pages/ProjectDetails/ProjectDetails';
import { EvidenceVerification } from '../pages/Evidence/EvidenceVerification';
import { CartelMatrix } from '../pages/CartelMatrix/CartelMatrix';
import { SLAMonitoring } from '../pages/SLA/SLAMonitoring';
import { AIPreScreening } from '../pages/PreScreening/AIPreScreening';
import { PhotoValidation } from '../pages/PhotoValidation/PhotoValidation';
import { Profile } from '../pages/Profile/Profile';
import { NotFound } from '../pages/NotFound/NotFound';

import { PublicHome } from '../pages/PublicPortal/PublicHome';
import { PublicMap } from '../pages/PublicPortal/PublicMap';
import { PublicSearch } from '../pages/PublicPortal/PublicSearch';
import { CitizenReport } from '../pages/CitizenReport/CitizenReport';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Citizen Portal */}
      <Route path="/public" element={<PublicHome />} />
      <Route path="/public/map" element={<PublicMap />} />
      <Route path="/public/search" element={<PublicSearch />} />
      <Route path="/public/report" element={<CitizenReport />} />

      {/* Protected Command Center & Dashboard Layout Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/risk-map" element={<RiskMap />} />
        <Route path="/high-risk" element={<HighRiskQueue />} />
        <Route path="/projects" element={<HighRiskQueue />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/evidence" element={<EvidenceVerification />} />
        <Route path="/cartel-matrix" element={<CartelMatrix />} />
        <Route path="/sla" element={<SLAMonitoring />} />
        <Route path="/profile" element={<Profile />} />

        {/* District Officer Specific Routes */}
        <Route path="/district" element={<DistrictDashboard />} />
        <Route path="/district/pending" element={<DistrictDashboard />} />
        <Route path="/district/pre-screening" element={<AIPreScreening />} />
        <Route path="/district/photo-validation" element={<PhotoValidation />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
