import React, { useState, useEffect, useRef } from 'react';
import { useStudent, DEMO_PROFILES } from '../context/StudentContext';
import { playClickSound, playSwitchSound, playSuccessSound } from '../utils/soundEffects';
import { 
   Search, 
   Command, 
   Scan, 
   Sparkles, 
   BookOpen, 
   Repeat, 
   BarChart3, 
   MapPin, 
   Calculator, 
   RotateCcw, 
   User, 
   ArrowRight, 
   X,
   Book,
   CheckCircle2
 } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onOpenCampusMap, onOpenCalculator }) {
  const { setCurrentPage, setCurrentStudent, currentStudent, resetDemoDatabase, showToast } = useStudent();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Fetch books once for quick searching
  useEffect(() => {
    if (isOpen) {
      fetch('/api/books')
        .then(res => res.json())
        .then(data => setBooks(data || []))
        .catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  // Static navigation and actions
  const navItems = [
    { id: 'marketplace', label: 'Explore Marketplace', category: 'Navigation', icon: BookOpen, page: 'marketplace' },
    { id: 'scanner', label: 'Launch AI Cover Scanner', category: 'Navigation', icon: Scan, page: 'scanner' },
    { id: 'matching', label: 'Smart Curriculum Matcher', category: 'Navigation', icon: Sparkles, page: 'matching' },
    { id: 'dashboard', label: 'Student Dashboard', category: 'Navigation', icon: User, page: 'dashboard' },
    { id: 'exchanges', label: 'My Exchange Requests', category: 'Navigation', icon: Repeat, page: 'exchanges' },
    { id: 'impact', label: 'Live Environmental Impact', category: 'Navigation', icon: BarChart3, page: 'impact' },
    { id: 'campus-map', label: 'Interactive Campus Handover Map', category: 'Tool', icon: MapPin, action: 'map' },
    { id: 'calculator', label: 'CO₂ & Money Savings Calculator', category: 'Tool', icon: Calculator, action: 'calc' },
    { id: 'reset-demo', label: 'Reset Demo Database to Initial State', category: 'Action', icon: RotateCcw, action: 'reset' }
  ];

  // Filter books matching query
  const filteredBooks = query.trim()
    ? books.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.subject.toLowerCase().includes(query.toLowerCase()) ||
        b.class_level.toLowerCase().includes(query.toLowerCase()) ||
        (b.owner_name && b.owner_name.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Filter commands
  const filteredNav = query.trim()
    ? navItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    : navItems;

  // Filter personas
  const filteredPersonas = query.trim()
    ? DEMO_PROFILES.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.grade.toLowerCase().includes(query.toLowerCase()))
    : DEMO_PROFILES;

  // Aggregate results
  const allResults = [
    ...filteredBooks.map(b => ({ type: 'book', data: b })),
    ...filteredNav.map(n => ({ type: 'nav', data: n })),
    ...filteredPersonas.map(p => ({ type: 'persona', data: p }))
  ];

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, allResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % Math.max(1, allResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        executeResult(allResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const executeResult = (item) => {
    playClickSound();
    if (item.type === 'book') {
      setCurrentPage('marketplace');
      onClose();
    } else if (item.type === 'nav') {
      if (item.data.action === 'map') {
        onClose();
        if (onOpenCampusMap) onOpenCampusMap();
      } else if (item.data.action === 'calc') {
        onClose();
        if (onOpenCalculator) onOpenCalculator();
      } else if (item.data.action === 'reset') {
        resetDemoDatabase();
        onClose();
      } else if (item.data.page) {
        setCurrentPage(item.data.page);
        onClose();
      }
    } else if (item.type === 'persona') {
      playSwitchSound();
      setCurrentStudent(item.data);
      showToast(`Switched active profile to ${item.data.name} (${item.data.grade})`, 'success');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white border border-[#E2E8E5] shadow-2xl transition-all"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 bg-gray-50/70">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a book name, subject, feature, or student persona..."
            className="w-full bg-transparent text-sm text-[#162220] placeholder-gray-400 focus:outline-none font-medium"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-block rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">
              ESC
            </kbd>
            <button 
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          
          {/* Books Section */}
          {filteredBooks.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#147D64]">
                Matching Textbooks ({filteredBooks.length})
              </div>
              <div className="mt-1 space-y-1">
                {filteredBooks.map((book, idx) => {
                  const globalIdx = idx;
                  const isSelected = selectedIndex === globalIdx;
                  return (
                    <div
                      key={book.id}
                      onClick={() => executeResult({ type: 'book', data: book })}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between rounded-xl p-2.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#E9F5F1] text-[#147D64]' : 'hover:bg-gray-50 text-[#162220]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={book.cover_image_url || "/images/class7_science_cover.jpg"}
                          alt={book.title}
                          className="h-10 w-8 object-cover rounded shadow-xs shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/class7_science_cover.jpg";
                          }}
                        />
                        <div>
                          <div className="text-xs font-bold leading-tight">{book.title}</div>
                          <div className="text-[11px] text-gray-500">
                            {book.class_level} • {book.subject} • Owned by {book.owner_name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {book.condition}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions & Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Actions & Navigation
              </div>
              <div className="mt-1 space-y-1">
                {filteredNav.map((item, idx) => {
                  const globalIdx = filteredBooks.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => executeResult({ type: 'nav', data: item })}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between rounded-xl p-2.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 text-[#2357A5]' : 'hover:bg-gray-50 text-[#162220]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#2357A5] text-white' : 'bg-gray-100 text-gray-600'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">{item.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Switch Demo Student Persona */}
          {filteredPersonas.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Quick Switch Student Persona
              </div>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredPersonas.map((p, idx) => {
                  const globalIdx = filteredBooks.length + filteredNav.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const isCurrent = currentStudent.student_id === p.student_id;
                  return (
                    <div
                      key={p.student_id}
                      onClick={() => executeResult({ type: 'persona', data: p })}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between rounded-xl p-2.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-50 text-[#C99126]' : 'hover:bg-gray-50 text-[#162220]'
                      } ${isCurrent ? 'ring-1 ring-[#147D64]' : ''}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ backgroundColor: p.avatar_bg }}
                        >
                          {p.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                            {p.name}
                            {isCurrent && <CheckCircle2 className="h-3 w-3 text-[#147D64]" />}
                          </div>
                          <div className="text-[10px] text-gray-500">{p.grade} • {p.role_badge}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">Switch</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {allResults.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">
              No matching books, actions, or student profiles found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white border px-1 rounded">↑</kbd> <kbd className="font-mono bg-white border px-1 rounded">↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-white border px-1 rounded">↵</kbd> Select</span>
          </div>
          <span>Active: <strong>{currentStudent.name}</strong> ({currentStudent.grade})</span>
        </div>

      </div>
    </div>
  );
}
