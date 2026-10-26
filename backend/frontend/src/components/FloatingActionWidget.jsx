import React, { useState, useEffect } from 'react';
import { useStudent, DEMO_PROFILES } from '../context/StudentContext';
import { 
  playClickSound, 
  playSwitchSound, 
  isSoundEnabled, 
  setSoundEnabled 
} from '../utils/soundEffects';
import { 
  Search, 
  Scan, 
  MapPin, 
  Calculator, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronUp, 
  User,
  Zap
} from 'lucide-react';

export default function FloatingActionWidget({ onOpenSearch, onOpenCampusMap, onOpenCalculator }) {
  const { setCurrentPage, currentStudent, setCurrentStudent, showToast } = useStudent();
  const [soundOn, setSoundOn] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = (e) => {
    e.stopPropagation();
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    playClickSound();
    showToast(nextState ? "Sound effects enabled 🔊" : "Sound effects muted 🔇", "info");
  };

  const handleNextPersona = (e) => {
    e.stopPropagation();
    const currentIndex = DEMO_PROFILES.findIndex(p => p.student_id === currentStudent.student_id);
    const nextIndex = (currentIndex + 1) % DEMO_PROFILES.length;
    const nextStudent = DEMO_PROFILES[nextIndex];
    playSwitchSound();
    setCurrentStudent(nextStudent);
    showToast(`Switched active profile to ${nextStudent.name} (${nextStudent.grade})`, 'success');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      
      {/* Expanded Quick Tool Palette */}
      {expanded && (
        <div className="flex flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-2xl border border-gray-200 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          
          {/* Quick Search */}
          <button
            onClick={() => {
              setExpanded(false);
              onOpenSearch();
              playClickSound();
            }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#E9F5F1] hover:text-[#147D64] transition-colors"
          >
            <Search className="h-4 w-4 text-[#147D64]" />
            <span>Search Catalog <kbd className="text-[10px] bg-gray-100 px-1 py-0.5 rounded border">Ctrl+K</kbd></span>
          </button>

          {/* Quick AI Scanner */}
          <button
            onClick={() => {
              setExpanded(false);
              setCurrentPage('scanner');
              playClickSound();
            }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#2357A5] transition-colors"
          >
            <Scan className="h-4 w-4 text-[#2357A5]" />
            <span>AI Book Scanner</span>
          </button>

          {/* Campus Handover Map */}
          <button
            onClick={() => {
              setExpanded(false);
              onOpenCampusMap();
              playClickSound();
            }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Campus Handover Map</span>
          </button>

          {/* Interactive Calculator */}
          <button
            onClick={() => {
              setExpanded(false);
              onOpenCalculator();
              playClickSound();
            }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:text-[#C99126] transition-colors"
          >
            <Calculator className="h-4 w-4 text-[#C99126]" />
            <span>CO₂ & Savings Calculator</span>
          </button>

          <div className="h-px bg-gray-100 my-0.5" />

          {/* Persona Fast Switcher */}
          <button
            onClick={handleNextPersona}
            className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            title="Cycle to next demo student profile"
          >
            <div className="flex items-center gap-2">
              <div 
                className="h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: currentStudent.avatar_bg }}
              >
                {currentStudent.name[0]}
              </div>
              <span>Next Student Persona</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">↻</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              {soundOn ? <Volume2 className="h-4 w-4 text-[#147D64]" /> : <VolumeX className="h-4 w-4 text-gray-400" />}
              <span>Tactile Audio</span>
            </div>
            <span className={`text-[10px] font-bold ${soundOn ? 'text-[#147D64]' : 'text-gray-400'}`}>
              {soundOn ? 'ON' : 'MUTED'}
            </span>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Pill */}
      <div className="flex items-center gap-2 shadow-2xl rounded-full bg-white/95 border border-[#E2E8E5] p-1.5 backdrop-blur-md transition-transform hover:scale-105">
        {/* Fast Action 1: Search Button */}
        <button
          onClick={() => {
            onOpenSearch();
            playClickSound();
          }}
          className="flex items-center gap-1.5 rounded-full bg-[#F5F7F4] hover:bg-[#E9F5F1] px-3 py-2 text-xs font-bold text-[#147D64] transition-colors"
          title="Search catalog (Ctrl + K)"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline text-[9px] bg-white border px-1 rounded text-gray-500 font-mono">⌘K</kbd>
        </button>

        {/* Fast Action 2: Cycle Persona Button */}
        <button
          onClick={handleNextPersona}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          title={`Active: ${currentStudent.name}. Click to switch to next student.`}
        >
          <div 
            className="h-5 w-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0"
            style={{ backgroundColor: currentStudent.avatar_bg }}
          >
            {currentStudent.name[0]}
          </div>
          <span className="hidden md:inline text-[11px] font-bold text-[#162220]">{currentStudent.name.split(' ')[0]}</span>
        </button>

        {/* Fast Action 3: Sound Button */}
        <button
          onClick={toggleSound}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          title={soundOn ? "Mute interactive audio" : "Enable interactive audio"}
        >
          {soundOn ? <Volume2 className="h-4 w-4 text-[#147D64]" /> : <VolumeX className="h-4 w-4 text-gray-400" />}
        </button>

        {/* Fast Action 4: Menu Expander */}
        <button
          onClick={() => {
            setExpanded(!expanded);
            playClickSound();
          }}
          className={`rounded-full p-2 text-white transition-all ${
            expanded ? 'bg-[#2357A5] rotate-180' : 'bg-[#147D64] hover:bg-[#0E5B48]'
          }`}
          title="Toggle interactive toolbox"
        >
          <Zap className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
