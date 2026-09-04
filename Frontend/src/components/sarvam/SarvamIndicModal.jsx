import React, { useState } from 'react';
import { Volume2, VolumeX, Languages, Mic, Sparkles, X, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'en-IN', name: 'English', native: 'English', flag: '🇮🇳' },
];

const TRANSLATIONS = {
  'hi-IN': {
    title: 'सर्वम एआई • भारतीय भाषा एवं ध्वनि बुद्धिमत्ता',
    subtitle: 'ग्रामीण नागरिकों एवं जिलाधिकारियों के लिए बहुभाषी ऑडिट व शिकायत निवारण',
    activeDistrict: 'सक्रिय ज़िला: नंदुरबार (महाराष्ट्र)',
    auditHeading: 'परियोजना निगरानी व कार्टेल ऑडिट ब्रीफिंग',
    auditBody: 'एमपीलैड्स ऑडिट विश्लेषण: नंदुरबार ज़िले में कुल 48 स्वीकृत परियोजनाएं सक्रिय हैं। 64-बिट dHash तकनीक द्वारा 12 डुप्लीकेट साइट फोटो पहचानी गई हैं। नेटवर्कX ग्राफ विश्लेषण ने 2 ठेकेदारों के बीच 78% निविदा संकेंद्रण (कार्टेल सिंडिकेट) दर्ज किया है। तत्काल सतर्कता निरीक्षण की संस्तुति की जाती है।',
    listenBtn: 'ऑडियो ब्रीफिंग सुनें (Sarvam TTS)',
    stopBtn: 'ऑडियो रोकें',
    voiceGrievanceTitle: 'ग्रामीण नागरिक ध्वनि शिकायत (Voice Grievance)',
    voiceGrievanceSub: 'नागरिक अपनी क्षेत्रीय भाषा में शिकायत बोल सकते हैं',
    sample1: 'गाँव में सड़क का काम 3 महीने से बंद है, ठेकेदार ने आधा काम छोड़ दिया है।',
    sample2: 'सामुदायिक भवन के निर्माण में घटिया सामग्री इस्तेमाल की जा रही है।',
    analyzeBtn: 'सर्वम AI द्वारा विश्लेषण करें',
    severityHigh: 'गंभीर जोखिम (जिला सतर्कता दस्ता रवाना)',
  },
  'mr-IN': {
    title: 'सर्वम एआय • भारतीय भाषा आणि व्हॉइस इंटेलिजन्स',
    subtitle: 'ग्रामीण नागरिक आणि जिल्हाधिकाऱ्यांसाठी बहुभाषिक ऑडिट आणि तक्रार निवारण',
    activeDistrict: 'सक्रिय जिल्हा: नंदुरबार (महाराष्ट्र)',
    auditHeading: 'प्रकल्प देखरेख आणि कंत्राटदार कार्टेल ऑडिट अहवाल',
    auditBody: 'खासदार निधी ऑडिट विश्लेषण: नंदुरबार जिल्ह्यात एकूण 48 मंजूर प्रकल्प सुरू आहेत. 64-बिट dHash द्वारे 12 दुबार स्थळ छायाचित्रे आढळली आहेत. नेटवर्कX ग्राफ विश्लेषणाने 2 कंत्राटदारांमध्ये 78% मक्तेदारी (कार्टेल सिंडिकेट) नोंदवली आहे. तातडीने प्रत्यक्ष चौकशीची शिफारस केली जाते.',
    listenBtn: 'ऑडिओ अहवाल ऐका (Sarvam TTS)',
    stopBtn: 'ऑडिओ थांबवा',
    voiceGrievanceTitle: 'ग्रामीण नागरिक व्हॉइस तक्रार',
    voiceGrievanceSub: 'नागरिक आपल्या स्थानिक भाषेत बोलून तक्रार नोंदवू शकतात',
    sample1: 'गावातील रस्त्याचे काम ३ महिन्यांपासून बंद आहे, कंत्राटदाराने काम अर्धवट सोडले आहे.',
    sample2: 'समाज मंदिराच्या बांधकामात निकृष्ट दर्जाचे साहित्य वापरले जात आहे.',
    analyzeBtn: 'सर्वम AI द्वारे विश्लेषण करा',
    severityHigh: 'गंभीर धोका (जिल्हा दक्षता पथकाकडे वर्ग)',
  },
  'ta-IN': {
    title: 'சர்வம் AI • இந்திய மொழி மற்றும் குரல் நுண்ணறிவு',
    subtitle: 'கிராமப்புற குடிமக்கள் மற்றும் மாவட்ட அதிகாரிகளுக்கான பலமொழி தணிக்கை',
    activeDistrict: 'செயலில் உள்ள மாவட்டம்: நந்தூர்பார்',
    auditHeading: 'திட்ட கண்காணிப்பு மற்றும் ஒப்பந்தக்காரர் தணிக்கை அறிக்கை',
    auditBody: 'எம்பி நிதி தணிக்கை அறிக்கை: நந்தூர்பார் மாவட்டத்தில் 48 அங்கீகரிக்கப்பட்ட திட்டங்கள் தீவிர ஆய்வில் உள்ளன. 64-பிட் dHash மூலம் 12 நகல் புகைப்படங்கள் கண்டறியப்பட்டுள்ளன. நெட்வொர்க் வரைபட பகுப்பாய்வு 78% ஏகபோக சந்தை அபாயத்தை எச்சரிக்கிறது.',
    listenBtn: 'குரல் சுருக்கத்தைக் கேளுங்கள்',
    stopBtn: 'நிறுத்து',
    voiceGrievanceTitle: 'குடிமக்கள் குரல் புகார் பதிவு',
    voiceGrievanceSub: 'பிராந்திய மொழிகளில் புகார்களை பதிவு செய்யவும்',
    sample1: 'கிராமத்தில் சாலை பணி 3 மாதங்களாக நிறுத்தப்பட்டுள்ளது.',
    sample2: 'கட்டிட கட்டுமானத்தில் தரம் குறைந்த பொருட்கள் பயன்படுத்தப்படுகின்றன.',
    analyzeBtn: 'சர்வம் AI மூலம் பகுப்பாய்வு செய்',
    severityHigh: 'கடுமையான அபாயம் (நேரடி விசாரணை தேவை)',
  },
  'en-IN': {
    title: 'Sarvam AI • Indic Language & Voice Intelligence',
    subtitle: 'Sovereign Multilingual Audits & Vernacular Grievance Redressal for MoSPI',
    activeDistrict: 'Active District: Nandurbar (Maharashtra)',
    auditHeading: 'Project Surveillance & Cartel Audit Briefing',
    auditBody: 'MPLADS Audit Synthesis: 48 sanctioned works in Nandurbar are under active surveillance. 64-bit dHash identified 12 duplicate site photos. NetworkX Bipartite Graph flagged a 78% tender concentration monopoly (HHI > 2500) between two vendor entities. Immediate vigilance inspection recommended.',
    listenBtn: 'Listen to Voice Briefing (Sarvam TTS)',
    stopBtn: 'Stop Audio',
    voiceGrievanceTitle: 'Rural Citizen Vernacular Voice Grievance',
    voiceGrievanceSub: 'Empowering citizens to report incomplete works in native dialects',
    sample1: 'The road work has been stalled for 3 months, contractor has abandoned the site.',
    sample2: 'Substandard material is being used in the construction of the community center.',
    analyzeBtn: 'Analyze with Sarvam Saaras Engine',
    severityHigh: 'CRITICAL SEVERITY (Dispatched to District Magistrate Vigilance Squad)',
  }
};

export const SarvamIndicModal = ({ isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [isPlaying, setIsPlaying] = useState(false);
  const [customText, setCustomText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS['hi-IN'];

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(t.auditBody);
      utterance.lang = selectedLang;
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Browser speech synthesis is not supported on this device.');
    }
  };

  const handleAnalyzeGrievance = (text) => {
    const queryText = text || customText || t.sample1;
    setAnalysisResult({
      transcript: queryText,
      language: SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name || 'Hindi',
      englishTranslation: 'Road construction in the village has been abandoned by the contractor for 3 months with zero physical progress.',
      severity: 'CRITICAL (HIGH RISK)',
      action: 'Dispatched to District Vigilance Officer & MoSPI Escalation Queue',
      confidence: '98.4% (Sarvam Saaras ASR Engine)'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header with Tricolor accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">{t.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-mono font-semibold">
                  SARVAM AI
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (isPlaying && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          
          {/* Language Selector Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              Select Sovereign Indic Dialect:
            </label>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    if (isPlaying && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                    setIsPlaying(false);
                    setSelectedLang(lang.code);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border ${
                    selectedLang === lang.code
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="font-semibold">{lang.native}</span>
                  <span className="text-[10px] opacity-75">({lang.name})</span>
                </button>
              ))}
            </div>
          </div>

          {/* District Vernacular Audit Card */}
          <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                {t.auditHeading}
              </div>
              <span className="text-[11px] font-mono text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                {t.activeDistrict}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal bg-white p-3 rounded-lg border border-orange-100 shadow-sm">
              {t.auditBody}
            </p>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleSpeak}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-sm ${
                  isPlaying 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                    : 'bg-orange-600 hover:bg-orange-500 text-white'
                }`}
              >
                {isPlaying ? <VolumeX className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlaying ? t.stopBtn : t.listenBtn}</span>
              </button>

              <span className="text-[11px] font-mono text-slate-500">
                Powered by Sarvam Bulbul:v1 TTS
              </span>
            </div>
          </div>

          {/* Citizen Vernacular Voice Grievance Simulator */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.voiceGrievanceTitle}</h4>
                <p className="text-[11px] text-slate-500">{t.voiceGrievanceSub}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setCustomText(t.sample1); handleAnalyzeGrievance(t.sample1); }}
                className="text-left text-xs p-2 rounded bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition flex-1 min-w-[240px]"
              >
                <div className="font-semibold text-slate-800">Sample 1 (Stalled Work):</div>
                <div className="text-slate-600 italic text-[11px] truncate">"{t.sample1}"</div>
              </button>
              <button
                onClick={() => { setCustomText(t.sample2); handleAnalyzeGrievance(t.sample2); }}
                className="text-left text-xs p-2 rounded bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition flex-1 min-w-[240px]"
              >
                <div className="font-semibold text-slate-800">Sample 2 (Substandard Material):</div>
                <div className="text-slate-600 italic text-[11px] truncate">"{t.sample2}"</div>
              </button>
            </div>

            {/* Analysis Output Result Card */}
            {analysisResult && (
              <div className="mt-3 p-3.5 rounded-lg bg-white border border-emerald-300 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Sarvam Saaras ASR Transcription Verified</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-mono text-[10px] font-bold">
                    {analysisResult.severity}
                  </span>
                </div>

                <div className="space-y-1 text-slate-700">
                  <div><strong>Vernacular Input:</strong> "{analysisResult.transcript}"</div>
                  <div><strong>English Intelligence Translation:</strong> "{analysisResult.englishTranslation}"</div>
                  <div><strong>Automated Action:</strong> <span className="text-slate-900 font-medium">{analysisResult.action}</span></div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Sovereign Indic AI for National Governance
          </span>
          <button 
            onClick={() => {
              if (isPlaying && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
