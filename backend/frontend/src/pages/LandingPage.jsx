import React, { useEffect, useState } from 'react';
import BookBridgeLogo from '../components/BookBridgeLogo';
import WorkflowSteps from '../components/WorkflowSteps';
import SafetyBanner from '../components/SafetyBanner';
import BookCard from '../components/BookCard';
import BookDetailModal from '../components/BookDetailModal';
import RequestModal from '../components/RequestModal';
import { useStudent } from '../context/StudentContext';
import { playClickSound } from '../utils/soundEffects';
import { 
  Scan, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  TreePine, 
  Library,
  Layers,
  ChevronRight,
  MapPin,
  Calculator
} from 'lucide-react';

export default function LandingPage({ onOpenCampusMap, onOpenCalculator }) {
  const { setCurrentPage, currentStudent } = useStudent();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [impactSummary, setImpactSummary] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestBook, setRequestBook] = useState(null);

  useEffect(() => {
    // Fetch top books
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        setFeaturedBooks(data.slice(0, 3));
      })
      .catch(err => console.error(err));

    // Fetch impact
    fetch('/api/impact')
      .then(res => res.json())
      .then(data => {
        setImpactSummary(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#F5F7F4] to-white border border-[#E2E8E5] p-8 md:p-14 shadow-card">
        
        {/* Subtle Decorative Backdrop Blobs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#147D64]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#2357A5]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#F2B544]/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          
          {/* Competition Category Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-[#147D64] shadow-xs mb-6 backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#147D64] animate-pulse" />
            <span>The Brand Architects • Class 7 Innovation Prototype</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#162220] leading-[1.15]">
            Every Book Deserves a <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#147D64] via-[#2357A5] to-[#147D64] bg-clip-text text-transparent">
              New Chapter.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#5F736C] max-w-2xl mx-auto leading-relaxed">
            Stop textbook waste. Connect students who have completed a class with students stepping in. AI-assisted book recognition, transparent smart matching, and safe school-supervised handovers.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                playClickSound();
                setCurrentPage('marketplace');
              }}
              className="flex items-center gap-2 rounded-2xl bg-[#147D64] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#147D64]/25 transition-all hover:bg-[#0E5B48] hover:shadow-xl hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Find a Book</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                playClickSound();
                setCurrentPage('scanner');
              }}
              className="flex items-center gap-2 rounded-2xl bg-white border-2 border-[#2357A5] px-7 py-3.5 text-sm font-bold text-[#2357A5] shadow-sm transition-all hover:bg-[#EEF4FC] hover:-translate-y-0.5"
            >
              <Scan className="h-4 w-4" />
              <span>Scan & Share a Book</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setCurrentPage('matching');
              }}
              className="flex items-center gap-2 rounded-2xl bg-[#FEF7E8] border border-[#F2B544] px-5 py-3.5 text-sm font-bold text-[#C99126] transition-all hover:bg-[#F2B544]/20 hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Smart Match Demo</span>
            </button>

            {onOpenCampusMap && (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenCampusMap();
                }}
                className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3.5 text-sm font-bold text-[#147D64] transition-all hover:bg-emerald-100 hover:-translate-y-0.5"
              >
                <MapPin className="h-4 w-4" />
                <span>Campus Map</span>
              </button>
            )}

            {onOpenCalculator && (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenCalculator();
                }}
                className="flex items-center gap-2 rounded-2xl bg-blue-50 border border-blue-200 px-5 py-3.5 text-sm font-bold text-[#2357A5] transition-all hover:bg-blue-100 hover:-translate-y-0.5"
              >
                <Calculator className="h-4 w-4" />
                <span>CO₂ Calculator</span>
              </button>
            )}
          </div>

          {/* Live Impact Pill (Clickable to open interactive calculator) */}
          {impactSummary && impactSummary.has_data && (
            <div 
              onClick={() => {
                playClickSound();
                if (onOpenCalculator) onOpenCalculator();
              }}
              className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl bg-white/90 border border-gray-200/80 px-6 py-3 text-xs shadow-xs cursor-pointer hover:border-[#147D64] hover:shadow-md transition-all group"
              title="Click to launch interactive CO2 & money savings calculator"
            >
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#147D64] text-sm">{impactSummary.total_books_listed}</span>
                <span className="text-gray-500 font-medium">Books Listed</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#2357A5] text-sm">{impactSummary.successful_exchanges}</span>
                <span className="text-gray-500 font-medium">Exchanges Completed</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-emerald-600 text-sm">{impactSummary.co2_saved_kg} kg</span>
                <span className="text-gray-500 font-medium">CO₂ Saved</span>
              </div>
              <div className="text-[10px] text-[#147D64] font-bold group-hover:underline flex items-center gap-1">
                <span>Calculate Yours</span>
                <span>↗</span>
              </div>
            </div>
          )}

          {/* Real-World School Campus Action Showcase */}
          <div className="mt-10 relative rounded-3xl overflow-hidden border border-[#E2E8E5] shadow-xl bg-black/5 group">
            <img 
              src="/images/hero_students_exchange.jpg" 
              alt="Class 7 students exchanging NCERT Science textbook in school library" 
              className="w-full h-72 sm:h-88 md:h-[420px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            
            {/* Floating Live Badges */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-wrap gap-2 z-10">
              <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-[#147D64] shadow-md">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Class 7 Peer Exchange in Action</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-white shadow-md border border-white/20">
                <Library className="h-3.5 w-3.5 text-[#F2B544]" />
                <span>School Junior Library</span>
              </div>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white text-left z-10">
              <div className="max-w-xl">
                <div className="inline-block rounded-md bg-[#F2B544] text-[#162220] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 mb-1.5">
                  Verified Campus Handover
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-bold font-display text-white drop-shadow-sm">
                  Harshit (Class 7th) passing NCERT Science to Diya Patel
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 mt-1 line-clamp-2">
                  Zero money required. Zero stranger danger. Safe, peer-to-peer textbook handovers supervised under teacher and librarian oversight.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 px-3.5 py-2.5 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-[#147D64] flex items-center justify-center text-white text-base">
                  🌱
                </div>
                <div>
                  <div className="text-xs font-bold text-white">1.8 kg CO₂ Saved</div>
                  <div className="text-[10px] text-gray-200">Textbook Kept in Study Circulation</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5-Step Functional Pipeline Banner */}
      <section>
        <WorkflowSteps />
      </section>

      {/* Community Problem & Solution Section */}
      <section className="rounded-3xl bg-white p-8 md:p-12 border border-[#E2E8E5] shadow-card">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#147D64]">
            Community Mission
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#162220] mt-1">
            Bridging the Textbook Gap in Our Schools
          </h2>
          <p className="mt-2 text-sm text-[#5F736C] leading-relaxed">
            Every academic year in India, millions of school textbooks are discarded or locked away in cupboards, while peer students scramble to purchase expensive new copies or lack basic study resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Problem Card */}
          <div className="rounded-2xl border border-red-100 bg-red-50/40 p-6">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100">
                ✕
              </div>
              <span>The Problem We Observed</span>
            </div>
            <ul className="space-y-3 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Textbook Waste:</strong> 70%+ of school books are discarded after a single school year despite remaining in readable condition.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Access Inequity:</strong> Class 7 and secondary students from underprivileged backgrounds struggle to buy reference guides and workbooks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Safety Risk:</strong> Generic public classifieds expose students and parents to stranger danger and privacy leakage.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
            <div className="flex items-center gap-2 text-[#0E5B48] font-bold text-sm mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-200">
                ✓
              </div>
              <span>The BOOKBRIDGE AI Solution</span>
            </div>
            <ul className="space-y-3 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>AI Cover Recognition:</strong> Instant OCR captures textbook titles and curriculum grades without manual typing errors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Curriculum Smart Matching:</strong> Match students needing Class 7 Science with donors with transparent, explainable ranking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>School Library Supervised:</strong> Zero public phone numbers. Handover occurs safely at school counters under teacher oversight.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Real-World Operational Photos Showcase */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ground Reality: Our School Implementation</span>
            <span className="text-xs text-[#147D64] font-semibold flex items-center gap-1">
              <span>Verified School Program</span>
              <span>✓</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Real Photo 1: Textbook Collection Drive */}
            <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition-all hover:shadow-md">
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img 
                  src="/images/book_drive_students.jpg" 
                  alt="Students organizing BookBridge Textbook Reuse Drive in school courtyard" 
                  className="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#147D64] shadow-xs">
                  Campus Drive
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-display text-sm font-bold leading-tight">Student-Led Book Collection Drives</h4>
                  <p className="text-[11px] text-gray-200 mt-0.5 line-clamp-1">Class 7 & 8 student volunteers categorizing curriculum books for incoming batches</p>
                </div>
              </div>
            </div>

            {/* Real Photo 2: Safe Supervised Handover */}
            <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition-all hover:shadow-md">
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img 
                  src="/images/school_handover_safe.jpg" 
                  alt="School librarian supervising textbook exchange between students" 
                  className="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#2357A5] shadow-xs">
                  Zero Stranger Risk
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-display text-sm font-bold leading-tight">Adult-Supervised Campus Handovers</h4>
                  <p className="text-[11px] text-gray-200 mt-0.5 line-clamp-1">School Librarian Mrs. Mehra facilitating book transfers at the junior library desk</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards: AI Scanner, Smart Matching, Community Impact */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2357A5]">
            Engineered Capabilities
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#162220] mt-1">
            Three Core Innovation Pillars
          </h2>
          <p className="text-xs text-[#5F736C] mt-2">
            Designed for functional reliability, testable AI, and community sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Book Scanner */}
          <div 
            onClick={() => setCurrentPage('scanner')}
            className="group flex flex-col justify-between rounded-3xl bg-white p-7 border border-[#E2E8E5] shadow-card transition-all hover:-translate-y-1 hover:border-[#147D64] hover:shadow-hover cursor-pointer"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#147D64] mb-5 group-hover:scale-110 transition-transform">
                <Scan className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#162220] mb-2">
                AI Book Scanner
              </h3>
              <p className="text-xs text-[#5F736C] leading-relaxed mb-4">
                Upload or capture any textbook cover. EasyOCR extracts visible title, detects Class & Subject, provides transparent evidence, and lets you verify before publishing.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#147D64] pt-4 border-t border-gray-100">
              <span>Launch Scanner</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 2: Smart Matching */}
          <div 
            onClick={() => setCurrentPage('matching')}
            className="group flex flex-col justify-between rounded-3xl bg-white p-7 border border-[#E2E8E5] shadow-card transition-all hover:-translate-y-1 hover:border-[#2357A5] hover:shadow-hover cursor-pointer"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#2357A5] mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#162220] mb-2">
                Smart Matching
              </h3>
              <p className="text-xs text-[#5F736C] leading-relaxed mb-4">
                No fake percentages. Our multi-variate recommendation engine transparently breaks down scores based on syllabus class, subject alignment, and book condition.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#2357A5] pt-4 border-t border-gray-100">
              <span>Try Smart Match</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 3: Community Impact */}
          <div 
            onClick={() => setCurrentPage('impact')}
            className="group flex flex-col justify-between rounded-3xl bg-white p-7 border border-[#E2E8E5] shadow-card transition-all hover:-translate-y-1 hover:border-[#F2B544] hover:shadow-hover cursor-pointer"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[#C99126] mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#162220] mb-2">
                Community Impact
              </h3>
              <p className="text-xs text-[#5F736C] leading-relaxed mb-4">
                Dynamic live analytics calculated strictly from verified database exchange transactions. Track CO₂ emissions prevented, paper trees saved, and students helped.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#C99126] pt-4 border-t border-gray-100">
              <span>View Impact Metrics</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

        </div>
      </section>

      {/* Featured Class 7 Listings Preview */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#147D64]">
              Available on Campus
            </span>
            <h2 className="font-display text-2xl font-bold text-[#162220]">
              Featured School Books
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('marketplace')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#147D64] hover:text-[#0E5B48]"
          >
            <span>Explore All Books in Marketplace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onOpenDetails={(b) => setSelectedBook(b)}
              onOpenRequest={(b) => setRequestBook(b)}
            />
          ))}
        </div>
      </section>

      {/* Safety Protocol Banner */}
      <section>
        <SafetyBanner />
      </section>

      {/* Modals */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onRequest={(b) => setRequestBook(b)}
        />
      )}

      {requestBook && (
        <RequestModal
          book={requestBook}
          onClose={() => setRequestBook(null)}
          onSuccess={() => {
            // Re-fetch books
            fetch('/api/books')
              .then(res => res.json())
              .then(data => setFeaturedBooks(data.slice(0, 3)));
          }}
        />
      )}

    </div>
  );
}
