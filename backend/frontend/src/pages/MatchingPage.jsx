import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import BookDetailModal from '../components/BookDetailModal';
import RequestModal from '../components/RequestModal';
import { playClickSound, playSliderTickSound, playSuccessSound, playConfettiSound } from '../utils/soundEffects';
import { fireConfetti } from '../utils/confetti';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  HelpCircle, 
  Layers, 
  Award,
  BookOpen,
  School,
  User,
  ShieldCheck,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function MatchingPage() {
  const { currentStudent, showToast } = useStudent();
  
  // Query Form
  const [targetTitle, setTargetTitle] = useState('NCERT Science Textbook Class 7');
  const [targetClass, setTargetClass] = useState('Class 7');
  const [targetSubject, setTargetSubject] = useState('Science');
  const [targetEdition, setTargetEdition] = useState('2024');

  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState(null);
  const [expandedExplanation, setExpandedExplanation] = useState(null);

  // Interactive Real-Time Weight Tuning Sliders
  const [weights, setWeights] = useState({
    classWeight: 40,
    subjectWeight: 35,
    titleWeight: 20,
    conditionWeight: 5
  });
  const [showWeightTuner, setShowWeightTuner] = useState(false);

  // Modals
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestBook, setRequestBook] = useState(null);

  const runSmartMatch = async (titleVal = targetTitle, classVal = targetClass, subjVal = targetSubject) => {
    setLoading(true);
    playClickSound();
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleVal.trim(),
          class_level: classVal,
          subject: subjVal,
          edition: targetEdition.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMatchResults(data);
        if (data.results && data.results.length > 0 && data.results[0].score >= 90) {
          playSuccessSound();
        }
        showToast(`Smart Matching evaluated available campus books! Found ${data.total_matched} ranked candidates.`, 'success');
      } else {
        showToast('Error executing matching engine', 'error');
      }
    } catch (e) {
      showToast('Network error while matching books', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initial auto-run on page mount for instant preview
  useEffect(() => {
    runSmartMatch();
  }, []);

  const handleJuryScenarioAutofill = (scenario) => {
    playClickSound();
    if (scenario === 'science7') {
      setTargetTitle('NCERT Science Textbook Class 7');
      setTargetClass('Class 7');
      setTargetSubject('Science');
      setTargetEdition('2024');
      runSmartMatch('NCERT Science Textbook Class 7', 'Class 7', 'Science');
    } else if (scenario === 'math7') {
      setTargetTitle('Mathematics Class 7 NCERT');
      setTargetClass('Class 7');
      setTargetSubject('Mathematics');
      setTargetEdition('2023-24');
      runSmartMatch('Mathematics Class 7 NCERT', 'Class 7', 'Mathematics');
    } else if (scenario === 'history7') {
      setTargetTitle('Our Pasts - II History Class 7');
      setTargetClass('Class 7');
      setTargetSubject('Social Science');
      setTargetEdition('2024');
      runSmartMatch('Our Pasts - II History Class 7', 'Class 7', 'Social Science');
    }
  };

  const handleWeightChange = (key, val) => {
    playSliderTickSound();
    setWeights(prev => ({ ...prev, [key]: Number(val) }));
  };

  // Calculate customized real-time adjusted score for candidates
  const getAdjustedResults = () => {
    if (!matchResults || !matchResults.results) return [];
    const totalWeight = weights.classWeight + weights.subjectWeight + weights.titleWeight + weights.conditionWeight;
    
    return matchResults.results.map(item => {
      let adjScore = 0;
      item.breakdown.forEach(b => {
        const factorRatio = b.max > 0 ? (b.points / b.max) : 0;
        if (b.factor.toLowerCase().includes('class')) {
          adjScore += factorRatio * weights.classWeight;
        } else if (b.factor.toLowerCase().includes('subject')) {
          adjScore += factorRatio * weights.subjectWeight;
        } else if (b.factor.toLowerCase().includes('title')) {
          adjScore += factorRatio * weights.titleWeight;
        } else {
          adjScore += factorRatio * weights.conditionWeight;
        }
      });

      const normalizedScore = Math.round((adjScore / totalWeight) * 100);
      return {
        ...item,
        adjustedScore: Math.min(100, Math.max(0, normalizedScore))
      };
    }).sort((a, b) => b.adjustedScore - a.adjustedScore);
  };

  const displayedResults = getAdjustedResults();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2357A5] mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Stage 03 • Explainable Smart Matching</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#162220]">
          Smart Curriculum Matching Engine
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5F736C]">
          Match student study requirements with available listings. Transparent multi-variate scoring explains exactly why each textbook is recommended — zero fabricated percentages.
        </p>
      </div>

      {/* Jury Quick Demos Banner */}
      <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-emerald-50/70 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#2357A5] block">
              Jury Demonstration Scenarios
            </span>
            <p className="text-xs font-bold text-[#162220]">
              Instant Class 7 Test Cases:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleJuryScenarioAutofill('science7')}
              className="rounded-xl bg-[#2357A5] text-white px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-[#183E75] transition-all hover:scale-105"
            >
              ★ Scenario 1: Class 7 Science (Harshit & Diya)
            </button>
            <button
              onClick={() => handleJuryScenarioAutofill('math7')}
              className="rounded-xl bg-white border border-blue-200 text-blue-900 px-3 py-1.5 text-xs font-bold hover:bg-blue-50 transition-all"
            >
              Scenario 2: Class 7 Math
            </button>
            <button
              onClick={() => handleJuryScenarioAutofill('history7')}
              className="rounded-xl bg-white border border-blue-200 text-blue-900 px-3 py-1.5 text-xs font-bold hover:bg-blue-50 transition-all"
            >
              Scenario 3: Class 7 History
            </button>
          </div>
        </div>
      </div>

      {/* Input Criteria Form */}
      <div className="rounded-3xl bg-white p-6 border border-[#E2E8E5] shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-bold text-[#162220]">
            Enter Your Learning Requirements
          </h3>
          <button
            type="button"
            onClick={() => setShowWeightTuner(!showWeightTuner)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2357A5] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>{showWeightTuner ? 'Hide Weight Simulator' : 'Tune Matching Weights (Live)'}</span>
          </button>
        </div>

        {/* Live Weight Tuner Simulator Slider Panel */}
        {showWeightTuner && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-50/60 to-emerald-50/60 p-4 border border-blue-100 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-[#2357A5]" />
                <span>Interactive Algorithm Weights (Slide to Re-Score Live)</span>
              </span>
              <span className="text-[10px] text-gray-500">Auto-adjusts candidate ranking order</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                  <span>Class Strictness:</span>
                  <span className="font-bold text-[#147D64]">{weights.classWeight}%</span>
                </div>
                <input 
                  type="range" min="10" max="60" step="5"
                  value={weights.classWeight}
                  onChange={(e) => handleWeightChange('classWeight', e.target.value)}
                  className="w-full cursor-pointer h-1.5 bg-gray-200 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                  <span>Subject Match:</span>
                  <span className="font-bold text-[#2357A5]">{weights.subjectWeight}%</span>
                </div>
                <input 
                  type="range" min="10" max="60" step="5"
                  value={weights.subjectWeight}
                  onChange={(e) => handleWeightChange('subjectWeight', e.target.value)}
                  className="w-full cursor-pointer h-1.5 bg-gray-200 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                  <span>Title Keyword:</span>
                  <span className="font-bold text-[#C99126]">{weights.titleWeight}%</span>
                </div>
                <input 
                  type="range" min="5" max="50" step="5"
                  value={weights.titleWeight}
                  onChange={(e) => handleWeightChange('titleWeight', e.target.value)}
                  className="w-full cursor-pointer h-1.5 bg-gray-200 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                  <span>Condition Health:</span>
                  <span className="font-bold text-gray-700">{weights.conditionWeight}%</span>
                </div>
                <input 
                  type="range" min="0" max="25" step="5"
                  value={weights.conditionWeight}
                  onChange={(e) => handleWeightChange('conditionWeight', e.target.value)}
                  className="w-full cursor-pointer h-1.5 bg-gray-200 rounded"
                />
              </div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); runSmartMatch(); }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          <div>
            <label className="block font-bold text-gray-700 mb-1">Required Book Title *</label>
            <input
              type="text"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              placeholder="e.g. Science Class 7"
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-[#2357A5] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Target Class *</label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-[#2357A5] focus:outline-none"
            >
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Subject *</label>
            <select
              value={targetSubject}
              onChange={(e) => setTargetSubject(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-[#2357A5] focus:outline-none"
            >
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Social Science">Social Science</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2357A5] p-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#183E75] disabled:opacity-50 transition-all hover:shadow-md"
            >
              {loading ? (
                <span>Scoring Candidates...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Execute Smart Match</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Explainability Distinction Disclaimer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
          <Info className="h-3.5 w-3.5 text-[#2357A5] shrink-0" />
          <span>
            <strong>Scoring Transparency:</strong> Matching is evaluated using multivariate deterministic rules (Class: {weights.classWeight}%, Subject: {weights.subjectWeight}%, Title: {weights.titleWeight}%, Condition: {weights.conditionWeight}%). No synthetic hallucinations.
          </span>
        </div>
      </div>

      {/* Match Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-[#162220]">
            Ranked Recommendations ({displayedResults.length} Matches)
          </h3>
          <span className="text-xs text-gray-500">
            Sorted descending by curriculum compatibility score
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 rounded-full border-2 border-[#2357A5] border-t-transparent animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Running multivariate matching engine...</p>
          </div>
        ) : displayedResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-xs text-gray-500">
            No matching textbooks currently available for this query. Try widening the subject or grade level.
          </div>
        ) : (
          <div className="space-y-4">
            {displayedResults.map((item, index) => {
              const book = item.book;
              const isTop = index === 0;
              const isExpanded = expandedExplanation === book.id;

              return (
                <div
                  key={book.id}
                  className={`rounded-2xl bg-white p-5 sm:p-6 border transition-all ${
                    isTop 
                      ? 'border-[#147D64] shadow-hover ring-1 ring-[#147D64]/20' 
                      : 'border-[#E2E8E5] shadow-card hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    
                    {/* Left: Book Media & Info */}
                    <div className="flex items-start gap-4">
                      
                      <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-xs">
                        <img 
                          src={book.cover_image_url || "/images/class7_science_cover.jpg"}
                          alt={book.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/class7_science_cover.jpg";
                          }}
                        />
                        {isTop && (
                          <div className="absolute top-1 left-1 rounded bg-[#147D64] px-1 py-0.2 text-[8px] font-bold text-white shadow-xs">
                            #1 RANK
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isTop ? 'bg-emerald-100 text-[#0E5B48]' : 'bg-blue-100 text-[#2357A5]'
                          }`}>
                            {item.match_badge}
                          </span>
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                            {book.class_level}
                          </span>
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                            {book.subject}
                          </span>
                          <span className="rounded-md bg-purple-50 text-purple-700 px-2 py-0.5 text-[10px] font-semibold">
                            {book.listing_type}
                          </span>
                        </div>

                        <h4 
                          onClick={() => {
                            playClickSound();
                            setSelectedBook(book);
                          }}
                          className="font-display text-base font-bold text-[#162220] hover:text-[#147D64] cursor-pointer"
                        >
                          {book.title}
                        </h4>

                        {/* Plain English Rationale */}
                        <p className="mt-1 text-xs text-[#147D64] font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          <span>Rationale: {item.rationale}</span>
                        </p>

                        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
                          <span>Owner: <strong className="text-gray-700">{book.owner_name}</strong> ({book.owner_grade})</span>
                          <span>•</span>
                          <span>Location: {book.pickup_area}</span>
                        </div>
                      </div>

                    </div>

                    {/* Right: Score Breakdown Card & Request Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                      
                      {/* Transparent Score Pill */}
                      <div className="rounded-xl bg-[#F5F7F4] p-3 text-center min-w-[120px] border border-gray-100">
                        <span className="block font-display text-2xl font-black text-[#162220]">
                          {item.adjustedScore || item.score}<span className="text-xs text-gray-400 font-normal"> / 100</span>
                        </span>
                        <span className="block text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                          Match Score
                        </span>
                      </div>

                      {/* Factor Checklist */}
                      <div className="hidden sm:block text-[10px] text-gray-600 space-y-1.5 w-36">
                        {item.breakdown.map((b, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">{b.factor}:</span>
                              <strong className="text-[#147D64] font-bold">{b.points}/{b.max}</strong>
                            </div>
                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-0.5">
                              <div 
                                className="h-full bg-[#147D64] rounded-full transition-all duration-300"
                                style={{ width: `${(b.points / b.max) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Request CTA Button */}
                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            playClickSound();
                            setRequestBook(book);
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#147D64] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0E5B48] transition-all hover:shadow-md"
                        >
                          <span>Request Book</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            playClickSound();
                            setSelectedBook(book);
                          }}
                          className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 text-center"
                        >
                          Details
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
            playSuccessSound();
            fireConfetti({ count: 70 });
            runSmartMatch();
          }}
        />
      )}

    </div>
  );
}
