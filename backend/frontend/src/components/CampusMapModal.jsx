import React, { useState } from 'react';
import { playClickSound, playSuccessSound } from '../utils/soundEffects';
import { 
  MapPin, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  X, 
  Building2, 
  Navigation, 
  Sparkles,
  Info
} from 'lucide-react';

export const CAMPUS_STATIONS = [
  {
    id: 'station-1',
    name: 'Central Library Counter',
    area: 'Ground Floor, Main Academic Block',
    supervisor: 'Mrs. Mehra (Head Librarian)',
    hours: '8:30 AM – 3:30 PM (All School Days)',
    safetyTier: 'Level 1: Continuous Teacher Supervision',
    features: ['Physical locker storage', 'Logbook registration', 'Condition verification desk'],
    availableSlots: 6,
    x: 48,
    y: 35,
    status: 'Open Now',
    color: '#147D64'
  },
  {
    id: 'station-2',
    name: 'Raman Science Block Foyer',
    area: 'Ground Floor, Physics & Chemistry Lab Wing',
    supervisor: 'Mr. Arvind Verma (Lab In-Charge)',
    hours: '9:00 AM – 2:30 PM',
    safetyTier: 'Level 1: Lab Staff Supervised',
    features: ['Dedicated STEM textbook shelf', 'Quick drop box', 'CCTV Covered'],
    availableSlots: 4,
    x: 75,
    y: 28,
    status: 'Open Now',
    color: '#2357A5'
  },
  {
    id: 'station-3',
    name: 'Student Council Helpdesk',
    area: 'Central Quadrangle / Assembly Corridor',
    supervisor: 'Class 10 Student Monitors & Prefects',
    hours: 'Recess Hours (11:00 AM – 11:45 AM)',
    safetyTier: 'Level 2: Peer Council Managed',
    features: ['Live exchange coordination', 'ID badge verification', 'Instant match lookup'],
    availableSlots: 8,
    x: 50,
    y: 65,
    status: 'Recess Hours Only',
    color: '#F2B544'
  },
  {
    id: 'station-4',
    name: 'Senior Block Exchange Corner',
    area: 'First Floor, Senior Wing Study Hall',
    supervisor: 'Dr. Shalini (Activity Coordinator)',
    hours: '12:00 PM – 3:00 PM',
    safetyTier: 'Level 1: Faculty Monitored',
    features: ['Quiet review tables', 'Class 7 & 8 transition corner'],
    availableSlots: 5,
    x: 22,
    y: 42,
    status: 'Open Now',
    color: '#0E5B48'
  }
];

export default function CampusMapModal({ isOpen, onClose, onSelectStation }) {
  const [selectedStation, setSelectedStation] = useState(CAMPUS_STATIONS[0]);

  if (!isOpen) return null;

  const handleSelect = (station) => {
    setSelectedStation(station);
    playClickSound();
  };

  const handleConfirmStation = (station) => {
    playSuccessSound();
    if (onSelectStation) {
      onSelectStation(station);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white border border-[#E2E8E5] shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Interactive Campus Blueprint / Floor Map */}
        <div className="flex-1 bg-slate-900 p-6 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-bold text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Safe School Handover Zones</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">DPS Campus Plan v2.4</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
              Campus Handover Locator
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Click any designated station on the campus blueprint to view supervisor details and hours.
            </p>
          </div>

          {/* Interactive Campus SVG Map */}
          <div className="relative my-6 aspect-video w-full rounded-2xl bg-slate-800/80 border border-slate-700/60 p-4 overflow-hidden flex items-center justify-center">
            
            {/* Campus Structural Layout SVG */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Outer Campus Boundary */}
              <rect x="5" y="5" width="90" height="90" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="0.8" strokeDasharray="2,2" />
              
              {/* Academic Blocks */}
              <rect x="35" y="15" width="30" height="35" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="0.6" />
              <text x="50" y="25" textAnchor="middle" fill="#94a3b8" fontSize="3" fontWeight="bold">CENTRAL LIBRARY & ADMIN</text>

              <rect x="68" y="18" width="22" height="25" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="0.6" />
              <text x="79" y="30" textAnchor="middle" fill="#94a3b8" fontSize="2.8" fontWeight="bold">SCIENCE WING</text>

              <rect x="10" y="25" width="22" height="30" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="0.6" />
              <text x="21" y="38" textAnchor="middle" fill="#94a3b8" fontSize="2.8" fontWeight="bold">SENIOR WING</text>

              {/* Central Quadrangle Courtyard */}
              <circle cx="50" cy="65" r="14" fill="#14532d" fillOpacity="0.25" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1" />
              <text x="50" y="73" textAnchor="middle" fill="#6ee7b7" fontSize="2.8" fontWeight="bold">CENTRAL QUADRANGLE</text>

              {/* Pathways */}
              <path d="M 50,50 L 50,65 M 35,32 L 68,32 M 32,40 L 50,55 M 68,35 L 50,55" stroke="#475569" strokeWidth="0.8" strokeDasharray="1,2" fill="none" />
            </svg>

            {/* Interactive Hotspots Overlaid */}
            {CAMPUS_STATIONS.map((station) => {
              const isSelected = selectedStation.id === station.id;
              return (
                <div
                  key={station.id}
                  onClick={() => handleSelect(station)}
                  style={{ left: `${station.x}%`, top: `${station.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  {/* Radar ping animation when selected */}
                  {isSelected && (
                    <div 
                      className="absolute -inset-3 rounded-full animate-radar-ping opacity-75"
                      style={{ backgroundColor: station.color }}
                    />
                  )}
                  
                  <div 
                    className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-lg transition-transform group-hover:scale-110 ${
                      isSelected 
                        ? 'text-white scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' 
                        : 'bg-white/90 text-slate-900 hover:bg-white'
                    }`}
                    style={isSelected ? { backgroundColor: station.color } : {}}
                  >
                    <span 
                      className="h-2 w-2 rounded-full" 
                      style={{ backgroundColor: isSelected ? '#ffffff' : station.color }} 
                    />
                    <span className="hidden sm:inline">{station.name.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>🛡️ Supervised by school faculty to ensure 100% child safety</span>
            <span className="text-emerald-400 font-semibold">{CAMPUS_STATIONS.length} Active Exchange Stations</span>
          </div>
        </div>

        {/* Right Side: Selected Station Detail Inspector */}
        <div className="w-full md:w-80 lg:w-96 p-6 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#147D64]">
                Station Details
              </span>
              <button 
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#E9F5F1] to-blue-50 p-4 border border-[#147D64]/20 mb-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-extrabold text-[#162220]">
                    {selectedStation.name}
                  </h3>
                  <div className="text-xs text-[#5F736C] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-[#147D64]" />
                    <span>{selectedStation.area}</span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {selectedStation.status}
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <UserCheck className="h-4 w-4 text-[#147D64] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#162220]">Supervising Authority</div>
                  <div className="text-gray-600">{selectedStation.supervisor}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-[#2357A5] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#162220]">Operating Hours</div>
                  <div className="text-gray-600">{selectedStation.hours}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#162220]">Safety Protocol</div>
                  <div className="text-emerald-700 font-medium">{selectedStation.safetyTier}</div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="font-bold text-[#162220] mb-2">Station Facilities</div>
                <ul className="space-y-1.5">
                  {selectedStation.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#147D64] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
            <button
              onClick={() => handleConfirmStation(selectedStation)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#147D64] px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-[#0E5B48] transition-all hover:shadow-lg"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Select as Handover Location</span>
            </button>
            <p className="text-[10px] text-center text-gray-400">
              Both exchange partners receive a custody receipt via SMS/App
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
