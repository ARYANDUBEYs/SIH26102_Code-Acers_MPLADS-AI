import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Send, CheckCircle2, Upload, AlertCircle, FileText, MapPin, User, Building } from 'lucide-react';
import mpData from '../../data/mpAllocations.json';

export const CitizenRequestModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: form, 2: success
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    state: '',
    district: '',
    locationType: 'rural',
    subDistrict: '',
    village: '',
    locality: '',
    selectedMp: '',
    workTitle: '',
    workCategory: 'Drinking Water',
    workDesc: '',
    approxFund: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  // Extract unique states from 543 MP dataset
  const statesList = useMemo(() => {
    if (!mpData || !mpData.mps) return [];
    return Array.from(new Set(mpData.mps.map(m => m.state))).sort();
  }, []);

  // Filter MPs based on selected state
  const availableMps = useMemo(() => {
    if (!formData.state || !mpData || !mpData.mps) return [];
    return mpData.mps.filter(m => m.state === formData.state);
  }, [formData.state]);

  const handleStateChange = (e) => {
    const s = e.target.value;
    setFormData(prev => ({
      ...prev,
      state: s,
      district: '',
      selectedMp: ''
    }));
  };

  const handleMpChange = (e) => {
    const mpId = e.target.value;
    const mp = availableMps.find(m => `${m.srNo}` === mpId || m.mpName === mpId);
    setFormData(prev => ({
      ...prev,
      selectedMp: mp ? `${mp.mpName} (${mp.constituency})` : mpId,
      district: mp ? mp.constituency : prev.district
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedRef = `CIT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setStep(2);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      state: '',
      district: '',
      locationType: 'rural',
      subDistrict: '',
      village: '',
      locality: '',
      selectedMp: '',
      workTitle: '',
      workCategory: 'Drinking Water',
      workDesc: '',
      approxFund: '',
      consent: false
    });
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="e-SAKSHI Citizen Work Recommendation & Grievance"
      subtitle="Government of India • Ministry of Statistics and Programme Implementation (MoSPI)"
      size="lg"
    >
      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto pr-1">
          {/* Official Guidance Note */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 leading-relaxed text-[11px]">
            <strong>Official Guideline: </strong>
            Under the revised e-SAKSHI procedure, citizens can digitally recommend locally felt developmental works (drinking water, school buildings, community centers, health centers) to their elected Member of Parliament.
          </div>

          {/* Section 1: Citizen Identity */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <User className="w-3.5 h-3.5 text-blue-700" />
              <span>1. Citizen Contact Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Mobile Number (for SMS Tracking) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email ID (Optional)</label>
                <input
                  type="email"
                  placeholder="name@domain.gov.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & Hon'ble MP Mapping */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              <span>2. Constituency & Hon'ble MP Mapping</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Select State / UT *</label>
                <select
                  required
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Choose State / UT --</option>
                  {statesList.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Hon'ble MP & Constituency *</label>
                <select
                  required
                  disabled={!formData.state}
                  value={formData.selectedMp}
                  onChange={handleMpChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
                >
                  <option value="">-- {formData.state ? 'Select Hon\'ble MP' : 'Choose State First'} --</option>
                  {availableMps.map(mp => (
                    <option key={mp.srNo} value={`${mp.mpName} (${mp.constituency})`}>
                      {mp.mpName} — {mp.constituency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Location Category *</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="locType"
                      value="rural"
                      checked={formData.locationType === 'rural'}
                      onChange={() => setFormData({ ...formData, locationType: 'rural' })}
                    />
                    <span>Rural (Gram Panchayat)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="locType"
                      value="urban"
                      checked={formData.locationType === 'urban'}
                      onChange={() => setFormData({ ...formData, locationType: 'urban' })}
                    />
                    <span>Urban (Municipality/Ward)</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Details of Locality / Specific Village or Ward *</label>
              <textarea
                rows={2}
                required
                placeholder="Specify Landmark, Village Name, Block/Tehsil, or Municipal Ward Number..."
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 3: Proposed Developmental Work */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <Building className="w-3.5 h-3.5 text-blue-700" />
              <span>3. Proposed Work Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Work Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Construction of RO Drinking Water Plant"
                  value={formData.workTitle}
                  onChange={(e) => setFormData({ ...formData, workTitle: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Primary Sector / Category *</label>
                <select
                  value={formData.workCategory}
                  onChange={(e) => setFormData({ ...formData, workCategory: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Drinking Water">Drinking Water & Sanitation</option>
                  <option value="Education">Education & School Infrastructure</option>
                  <option value="Healthcare">Healthcare & Oxygen Units</option>
                  <option value="Roads & Bridges">Rural Connectivity & Pathways</option>
                  <option value="Community Infrastructure">Community Halls & Crematoriums</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Detailed Description of Community Need *</label>
              <textarea
                rows={3}
                required
                placeholder="Explain why this durable community asset is required, estimated beneficiaries, and current problems faced..."
                value={formData.workDesc}
                onChange={(e) => setFormData({ ...formData, workDesc: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Approximate Fund Estimate (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500000"
                  value={formData.approxFund}
                  onChange={(e) => setFormData({ ...formData, approxFund: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Upload Site Photo / Request Letter (Optional)</label>
                <div className="border border-dashed border-slate-300 rounded-lg p-2.5 text-center hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2 text-slate-500">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-[11px]">Select PDF or Geotagged JPEG (Max 5MB)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Consent */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <input
              type="checkbox"
              id="citizen-consent"
              required
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="mt-0.5"
            />
            <label htmlFor="citizen-consent" className="text-[11px] text-slate-600 cursor-pointer leading-tight">
              I certify that this proposal reflects locally felt public needs. I understand that final recommendation rests entirely under the discretion of the concerned Hon'ble MP and statutory sanction of the District Authority as per MPLADS 2023 Guidelines.
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={!formData.consent || isSubmitting}
              isLoading={isSubmitting}
              icon={Send}
              className="bg-[#0B2545] hover:bg-[#081D37] text-white"
            >
              Submit Citizen Recommendation
            </Button>
          </div>
        </form>
      ) : (
        <div className="py-8 px-4 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Recommendation Submitted Successfully!</h3>
            <p className="text-xs text-slate-500">
              Your proposal has been logged onto the MoSPI e-SAKSHI 2.0 Citizen Queue.
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg max-w-sm mx-auto space-y-1 text-xs">
            <p className="text-slate-500 text-[11px]">Acknowledgement Tracking Number:</p>
            <p className="font-mono font-bold text-sm text-blue-700">{referenceId}</p>
            <p className="text-[10px] text-slate-400">Assigned to: {formData.selectedMp || 'Constituency MP Office'}</p>
          </div>
          <Button variant="primary" size="sm" onClick={handleReset}>
            Close and Return to Portal
          </Button>
        </div>
      )}
    </Modal>
  );
};