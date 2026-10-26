import React, { useState } from 'react';
import BookBridgeLogo from './BookBridgeLogo';
import { useStudent, DEMO_PROFILES } from '../context/StudentContext';
import { playClickSound, playSwitchSound } from '../utils/soundEffects';
import { 
  BookOpen, 
  Search, 
  Scan, 
  Sparkles, 
  PlusCircle, 
  Repeat, 
  BarChart3, 
  Info, 
  Menu, 
  X, 
  RotateCcw,
  User,
  ChevronDown,
  MapPin,
  Calculator
} from 'lucide-react';

export default function Navbar({ onOpenSearch, onOpenCampusMap, onOpenCalculator }) {
  const { 
    currentPage, 
    setCurrentPage, 
    currentStudent, 
    setCurrentStudent, 
    pendingRequestsCount,
    resetDemoDatabase 
  } = useStudent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'scanner', label: 'AI Scanner', icon: Scan },
    { id: 'marketplace', label: 'Marketplace', icon: Search },
    { id: 'matching', label: 'Smart Matching', icon: Sparkles },
    { id: 'share', label: 'Share Book', icon: PlusCircle },
    { 
      id: 'exchanges', 
      label: 'My Exchanges', 
      icon: Repeat, 
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null 
    },
    { id: 'impact', label: 'Impact', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (pageId) => {
    playClickSound();
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8E5] bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="cursor-pointer transition-transform hover:opacity-95"
        >
          <BookBridgeLogo size="default" showTagline={true} />
        </div>

        {/* Quick Universal Search Trigger (Spotlight Ctrl+K) */}
        <button
          onClick={() => {
            playClickSound();
            if (onOpenSearch) onOpenSearch();
          }}
          className="hidden md:flex items-center gap-2 rounded-xl bg-gray-100/80 hover:bg-[#E9F5F1] px-3 py-1.5 text-xs text-gray-500 hover:text-[#147D64] transition-all border border-transparent hover:border-emerald-200"
          title="Search books, actions, student profiles (Ctrl + K)"
        >
          <Search className="h-3.5 w-3.5 text-[#147D64]" />
          <span className="font-medium">Quick search...</span>
          <kbd className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-gray-400 border font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#147D64] text-white shadow-xs'
                    : 'text-[#5F736C] hover:bg-[#F5F7F4] hover:text-[#162220]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-[#147D64]'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F2B544] text-[10px] font-extrabold text-[#162220]">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Persona Switcher & Tool Triggers */}
        <div className="hidden md:flex items-center gap-2">
          
          {/* Campus Map Trigger */}
          <button
            onClick={() => {
              playClickSound();
              if (onOpenCampusMap) onOpenCampusMap();
            }}
            className="flex items-center gap-1 rounded-xl bg-gray-50 hover:bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#147D64] border border-gray-200 hover:border-emerald-200 transition-colors"
            title="Open Interactive Campus Map"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden lg:inline text-[11px]">Campus Map</span>
          </button>

          {/* Impact Calculator Trigger */}
          <button
            onClick={() => {
              playClickSound();
              if (onOpenCalculator) onOpenCalculator();
            }}
            className="flex items-center gap-1 rounded-xl bg-gray-50 hover:bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#C99126] border border-gray-200 hover:border-amber-200 transition-colors"
            title="Open CO2 & Savings Calculator"
          >
            <Calculator className="h-3.5 w-3.5 text-[#C99126]" />
            <span className="hidden lg:inline text-[11px]">Calculator</span>
          </button>

          {/* Quick Demo Persona Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                playClickSound();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="flex items-center gap-2 rounded-xl border border-[#E2E8E5] bg-[#F5F7F4] px-2.5 py-1 text-xs font-medium text-[#162220] transition-colors hover:border-[#147D64]"
              title="Switch demo student persona to test both giver and seeker journeys"
            >
              <div 
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white shrink-0"
                style={{ backgroundColor: currentStudent.avatar_bg }}
              >
                {currentStudent.name[0]}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block font-semibold leading-tight text-[11px]">{currentStudent.name}</span>
                <span className="block text-[9px] text-[#5F736C]">{currentStudent.grade}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl z-50 animate-in fade-in duration-150">
                <div className="border-b border-gray-100 px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Competition Demo Personas
                </div>
                {DEMO_PROFILES.map((p) => (
                  <button
                    key={p.student_id}
                    onClick={() => {
                      playSwitchSound();
                      setCurrentStudent(p);
                      setProfileDropdownOpen(false);
                    }}
                    className={`flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition-colors ${
                      currentStudent.student_id === p.student_id ? 'bg-[#E9F5F1]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div 
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: p.avatar_bg }}
                    >
                      {p.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-[#162220]">{p.name} <span className="text-[10px] font-normal text-gray-500">({p.grade})</span></div>
                      <div className="text-[11px] text-[#147D64] font-medium">{p.role_badge}</div>
                      <div className="text-[10px] text-gray-500 leading-tight">{p.role_description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              playClickSound();
              resetDemoDatabase();
            }}
            className="flex items-center gap-1 rounded-xl border border-dashed border-gray-300 p-1.5 text-xs text-gray-600 transition-colors hover:border-[#147D64] hover:text-[#147D64]"
            title="Reset database to initial Class 7 scenario for jury presentation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={() => {
              playClickSound();
              if (onOpenSearch) onOpenSearch();
            }}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            title="Search"
          >
            <Search className="h-5 w-5 text-[#147D64]" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 xl:hidden shadow-lg animate-in fade-in duration-200">
          <div className="mb-4 rounded-xl bg-[#F5F7F4] p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Student Persona</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEMO_PROFILES.map((p) => (
                <button
                  key={p.student_id}
                  onClick={() => {
                    playSwitchSound();
                    setCurrentStudent(p);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    currentStudent.student_id === p.student_id 
                      ? 'bg-[#147D64] text-white' 
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {p.name} ({p.grade})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold ${
                    isActive 
                      ? 'bg-[#147D64] text-white' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto rounded-full bg-[#F2B544] px-1.5 py-0.2 text-[10px] font-bold text-gray-900">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCampusMap) onOpenCampusMap();
              }}
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#147D64]"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>Campus Map</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCalculator) onOpenCalculator();
              }}
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#C99126]"
            >
              <Calculator className="h-3.5 w-3.5 text-[#C99126]" />
              <span>CO₂ Calculator</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                resetDemoDatabase();
              }}
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#147D64]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Clean Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
