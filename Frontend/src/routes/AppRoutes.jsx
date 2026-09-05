import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Eager load Home for instant first paint
import { Home } from '../pages/Home/Home';

// Lazy load secondary routes for resilience and fast page load
const Login = lazy(() => import('../pages/Login/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../pages/Register/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const DistrictDashboard = lazy(() => import('../pages/Dashboard/DistrictDashboard').then(m => ({ default: m.DistrictDashboard })));
const Analytics = lazy(() => import('../pages/Analytics/Analytics').then(m => ({ default: m.Analytics || m.default })));
const RiskMap = lazy(() => import('../pages/RiskMap/RiskMap').then(m => ({ default: m.RiskMap })));
const HighRiskQueue = lazy(() => import('../pages/HighRisk/HighRiskQueue').then(m => ({ default: m.HighRiskQueue })));
const ProjectDetails = lazy(() => import('../pages/ProjectDetails/ProjectDetails').then(m => ({ default: m.ProjectDetails })));
const EvidenceVerification = lazy(() => import('../pages/Evidence/EvidenceVerification').then(m => ({ default: m.EvidenceVerification })));
const CartelMatrix = lazy(() => import('../pages/CartelMatrix/CartelMatrix').then(m => ({ default: m.CartelMatrix })));
const SLAMonitoring = lazy(() => import('../pages/SLA/SLAMonitoring').then(m => ({ default: m.SLAMonitoring })));
const AIPreScreening = lazy(() => import('../pages/PreScreening/AIPreScreening').then(m => ({ default: m.AIPreScreening })));
const PhotoValidation = lazy(() => import('../pages/PhotoValidation/PhotoValidation').then(m => ({ default: m.PhotoValidation })));
const Profile = lazy(() => import('../pages/Profile/Profile').then(m => ({ default: m.Profile })));
const NotFound = lazy(() => import('../pages/NotFound/NotFound').then(m => ({ default: m.NotFound })));

const PublicHome = lazy(() => import('../pages/PublicPortal/PublicHome').then(m => ({ default: m.PublicHome })));
const PublicMap = lazy(() => import('../pages/PublicPortal/PublicMap').then(m => ({ default: m.PublicMap })));
const PublicSearch = lazy(() => import('../pages/PublicPortal/PublicSearch').then(m => ({ default: m.PublicSearch })));
const CitizenReport = lazy(() => import('../pages/CitizenReport/CitizenReport').then(m => ({ default: m.CitizenReport })));

import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { CubeSpinner } from '../components/common/CubeSpinner';

const RouteLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
    <CubeSpinner text="Loading MoSPI Sentinel Intelligence Engine..." />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
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
    </Suspense>
  );
};
