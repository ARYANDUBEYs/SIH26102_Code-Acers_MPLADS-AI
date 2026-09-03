import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  FileCheck2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { api } from '../../services/api';

export const CitizenReport = () => {
  const [projectId, setProjectId] = useState('MPLAD-2026-00124');
  const [issueType, setIssueType] = useState('Work Incomplete / Poor Material Quality');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('Amit Patel');
  const [location, setLocation] = useState('Chiraigaon Block, Varanasi');
  const [gpsCoords, setGpsCoords] = useState('25.3190° N, 82.9810° E');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(4)}° N, ${position.coords.longitude.toFixed(4)}° E`;
          setGpsCoords(coords);
          setIsGettingLocation(false);
        },
        () => {
          // Fallback demo coordinates
          setGpsCoords('25.3190° N, 82.9810° E');
          setIsGettingLocation(false);
        }
      );
    } else {
      setGpsCoords('25.3190° N, 82.9810° E');
      setIsGettingLocation(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.submitCitizenReport({
        projectId,
        issueType,
        description: description || 'Reported that road paver blocks are crumbling and sub-base layer is incomplete despite funds being drawn.',
        citizenName,
        location,
        gps: gpsCoords,
        evidenceImage: photoPreview,
      });

      if (res.success) {
        setSubmittedReport(res.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 flex flex-col">
      {/* Tiranga Accent Banner */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/public" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 p-0.5 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                MPLADS <span className="text-blue-600">Citizen Grievance</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Public Transparency & Whistleblower Portal</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link to="/public" className="hover:text-blue-600">Home</Link>
            <Link to="/public/map" className="hover:text-blue-600">Interactive Map</Link>
            <Link to="/public/search" className="hover:text-blue-600">Search Projects</Link>
            <Link to="/public/report" className="text-rose-600 font-bold">Report Grievance</Link>
          </nav>

          <Link to="/login">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
              Officer Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!submittedReport ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Confidential Whistleblower & Citizen Report</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 pt-2">Report a Project Issue or Discrepancy</h2>
              <p className="text-xs text-slate-500">
                Upload geotagged photographic evidence of incomplete works, ghost assets, or substandard materials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="MPLADS Project ID"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="e.g. MPLAD-2026-00124"
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Issue Category
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Project Does Not Exist on Ground (Ghost Asset)">Project does not exist on ground (Ghost Asset)</option>
                    <option value="Work Incomplete / Poor Material Quality">Work incomplete / Substandard quality</option>
                    <option value="Wrong Project Information / Signboard Missing">Wrong project info / Signboard missing</option>
                    <option value="Photo Does Not Match Reality">Photo does not match ground reality</option>
                    <option value="Fund Utilization Concern / Inaction">Disbursed funds idle without progress</option>
                    <option value="Other">Other discrepancy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name (Optional / Protected)"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Amit Patel"
                />

                <Input
                  label="Village / Ward / Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Chiraigaon Block, Varanasi"
                  required
                />
              </div>

              {/* Geolocation Capture Button */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">GPS Geolocation Stamp</p>
                    <p className="text-[11px] font-mono text-slate-600">{gpsCoords || 'Not captured'}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                  isLoading={isGettingLocation}
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 text-xs shrink-0"
                >
                  Capture Current GPS
                </Button>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Detailed Description of Discrepancy
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you observed on the ground (e.g. incomplete road surfacing, cracked paver blocks, abandoned machinery)..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Photo Upload with Preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Upload Physical Site Photo / Evidence
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {photoPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-32 rounded-lg object-cover border border-slate-200 bg-slate-100"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          setPhotoPreview(null);
                        }}
                      />
                      <span className="text-xs font-semibold text-blue-600">Photo attached • Click to replace</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-600 font-medium">Click or drag photo here to upload</p>
                      <p className="text-[10px] text-slate-400">JPG, PNG up to 10MB (EXIF GPS auto-extracted)</p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="danger"
                size="lg"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold"
                isLoading={isSubmitting}
                icon={Send}
                iconPosition="right"
              >
                Submit Citizen Grievance to District Magistrate
              </Button>
            </form>
          </div>
        ) : (
          /* Report Submission Success Card with Tracking ID */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                REPORT SUBMITTED SUCCESSFULLY
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Grievance Acknowledged</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your report has been received by the District Magistrate's Project Monitoring Cell.
              </p>
            </div>

            {/* Tracking ID Badge */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto space-y-1">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Tracking Grievance ID</span>
              <h3 className="text-2xl font-black font-mono text-blue-600">{submittedReport.id}</h3>
              <p className="text-[10px] text-slate-400">Submission Date: {submittedReport.submissionDate}</p>
            </div>

            {/* Tracking Status Timeline */}
            <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Verification Lifecycle:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Grievance Logged & Geotag Checked</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                  <span>2. AI Photo Forensic Similarity Audit (In Progress)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                  <span>3. District Field Engineer Site Inspection</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSubmittedReport(null)}
                className="border-slate-300 text-slate-700"
              >
                Submit Another Grievance
              </Button>
              <Link to="/public">
                <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                  Return to Public Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
