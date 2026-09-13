import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Eager load core routes for instant navigation and zero dynamic import chunk failures
import { Home } from '../pages/Home/Home';
import Analytics from '../pages/Analytics/Analytics';
import { EvidenceVerification } from '../pages/Evidence/EvidenceVerification';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { ProjectDetails } from '../pages/ProjectDetails/ProjectDetails';
import { RiskMap } from '../pages/RiskMap/RiskMap';
import { HighRiskQueue } from '../pages/HighRisk/HighRiskQueue';

// Resilient lazy loader that retries dynamic chunk imports to prevent Vite dev-server HMR stale chunk failures
const lazyWithRetry = (importFn) =>
  lazy(async () => {
    try {
      const module = await importFn();
      return { default: module.default || module[Object.keys(module)[0]] };
    } catch (error) {
      console.warn('Initial chunk import failed, attempting fallback retry...', error);
      try {
        const module = await importFn();
        return { default: module.default || module[Object.keys(module)[0]] };
      } catch (retryError) {
        console.error('Dynamic module import failed after retry:', retryError);
        throw retryError;
      }
    }
  });

// Lazy load secondary routes for resilience and fast page load
const Login = lazyWithRetry(() => import('../pages/Login/Login'));
const Register = lazyWithRetry(() => import('../pages/Register/Register'));
const DistrictDashboard = lazyWithRetry(() => import('../pages/Dashboard/DistrictDashboard'));
const CartelMatrix = lazyWithRetry(() => import('../pages/CartelMatrix/CartelMatrix'));
const SLAMonitoring = lazyWithRetry(() => import('../pages/SLA/SLAMonitoring'));
const AIPreScreening = lazyWithRetry(() => import('../pages/PreScreening/AIPreScreening'));
const PhotoValidation = lazyWithRetry(() => import('../pages/PhotoValidation/PhotoValidation'));
const Profile = lazyWithRetry(() => import('../pages/Profile/Profile'));
const NotFound = lazyWithRetry(() => import('../pages/NotFound/NotFound'));

const PublicHome = lazyWithRetry(() => import('../pages/PublicPortal/PublicHome'));
const PublicMap = lazyWithRetry(() => import('../pages/PublicPortal/PublicMap'));
const PublicSearch = lazyWithRetry(() => import('../pages/PublicPortal/PublicSearch'));
const CitizenReport = lazyWithRetry(() => import('../pages/CitizenReport/CitizenReport'));
const AdminCitizenReports = lazyWithRetry(() => import('../pages/Admin/AdminCitizenReports'));

import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { CubeSpinner } from '../components/common/CubeSpinner';
import { GlobalCubeLoader } from '../components/common/GlobalCubeLoader';

const RouteLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
    <CubeSpinner text="Loading MoSPI Sentinel Intelligence Engine..." />
  </div>
);

export const AppRoutes = () => {
  return (
    <>
      <GlobalCubeLoader />
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

        {/* Protected Command Center & Dashboard Layout Routes (Requires Auth) */}
        <Route element={<ProtectedRoute />}>
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
            <Route path="/admin/grievances" element={<AdminCitizenReports />} />
            <Route path="/profile" element={<Profile />} />

            {/* District Officer Specific Routes */}
            <Route path="/district" element={<DistrictDashboard />} />
            <Route path="/district/pending" element={<DistrictDashboard />} />
            <Route path="/district/pre-screening" element={<AIPreScreening />} />
            <Route path="/district/photo-validation" element={<PhotoValidation />} />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    </>
  );
};
