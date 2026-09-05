import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Sitewide Interactive Text-to-Speech (TTS) Component
 * Reads out the current page title, active summaries, or key metrics using Web Speech Synthesis.
 * Works seamlessly across every page in both English and Indic languages.
 */
export const TextToSpeechButton = ({ className = '', showLabel = true }) => {
  const { currentLanguage } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    const handleEnd = () => setIsSpeaking(false);
    window.speechSynthesis?.addEventListener?.('end', handleEnd);

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleToggleSpeech = (e) => {
    e.stopPropagation();

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Collect readable content from the active page
    const pageTitle = document.querySelector('h1')?.innerText || document.title || 'MPLADS e-SAKSHI Intelligence Platform';
    const subTitle = document.querySelector('h2')?.innerText || document.querySelector('p')?.innerText || '';
    const mainText = `${pageTitle}. ${subTitle}`.trim();

    const utterance = new SpeechSynthesisUtterance(mainText);
    
    // Choose appropriate voice/lang
    const langCode = currentLanguage.startsWith('hi') ? 'hi-IN' : 'en-IN';
    utterance.lang = langCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === langCode || v.lang.includes(langCode.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleToggleSpeech}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
        isSpeaking
          ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]'
          : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/10'
      } ${className}`}
      title={isSpeaking ? 'Stop Screen Reader (Speaking...)' : 'Listen to Page (Text-to-Speech)'}
      aria-label="Toggle Text to Speech"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-white" />
          {showLabel && <span className="font-mono text-[10px]">Stop Audio</span>}
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
          {showLabel && <span className="font-mono text-[10px]">Read Page</span>}
        </>
      )}
    </button>
  );
};
