import React, { useState } from 'react';
import { playClickSound, playSliderTickSound, playConfettiSound } from '../utils/soundEffects';
import { fireConfetti } from '../utils/confetti';
import { useStudent } from '../context/StudentContext';
import { 
  Calculator, 
  TreePine, 
  Droplets, 
  TrendingUp, 
  IndianRupee, 
  Sparkles, 
  CheckCircle2, 
  X,
  Share2
} from 'lucide-react';

export default function ImpactCalculatorModal({ isOpen, onClose }) {
  const { showToast, currentStudent } = useStudent();
  const [booksCount, setBooksCount] = useState(4);
  const [cycles, setCycles] = useState(2);
  const [avgPrice, setAvgPrice] = useState(380);
  const [hasPledged, setHasPledged] = useState(false);

  if (!isOpen) return null;

  // Real-time calculation models (based on paper industry LCA metrics)
  // 1 Textbook ~ 0.9kg virgin paper = ~2.6kg CO2 emissions + ~35 liters water
  const totalBooksExchanged = booksCount * cycles;
  const co2Saved = (totalBooksExchanged * 2.8).toFixed(1);
  const treesSaved = (totalBooksExchanged * 0.048).toFixed(2);
  const waterSaved = totalBooksExchanged * 35;
  const moneySaved = totalBooksExchanged * avgPrice;

  const handleSliderChange = (setter, val) => {
    setter(Number(val));
    playSliderTickSound();
  };

  const handlePledge = () => {
    playConfettiSound();
    fireConfetti({ count: 90 });
    setHasPledged(true);
    showToast(`🌟 Awesome! ${currentStudent.name} pledged to save ${co2Saved} kg of CO₂ and ₹${moneySaved.toLocaleString()}!`, 'success');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white border border-[#E2E8E5] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#147D64] via-[#0E5B48] to-[#2357A5] p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-xs">
              <Calculator className="h-3.5 w-3.5" />
              <span>Interactive Sustainability Engine</span>
            </div>
            <button 
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="font-display text-2xl font-extrabold mt-3">
            Your Textbook Impact Calculator
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Slide the controls to calculate your environmental and financial savings in real time.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Sliders Area */}
          <div className="space-y-4 rounded-2xl bg-[#F5F7F4] p-4 border border-[#E2E8E5]">
            {/* Slider 1: Books Count */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#162220] mb-1.5">
                <span>Textbooks You Can Donate or Exchange</span>
                <span className="text-[#147D64] bg-[#E9F5F1] px-2 py-0.5 rounded-full font-extrabold text-sm">
                  {booksCount} books
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="15"
                step="1"
                value={booksCount}
                onChange={(e) => handleSliderChange(setBooksCount, e.target.value)}
                className="w-full cursor-pointer h-2 bg-gray-200 rounded-lg accent-[#147D64]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1 textbook</span>
                <span>8 textbooks</span>
                <span>15 textbooks</span>
              </div>
            </div>

            {/* Slider 2: Reusability Cycles */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#162220] mb-1.5">
                <span>Reuse Cycles (Passed down through junior batches)</span>
                <span className="text-[#2357A5] bg-blue-50 px-2 py-0.5 rounded-full font-extrabold text-sm">
                  {cycles} {cycles === 1 ? 'batch' : 'batches'}
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="4"
                step="1"
                value={cycles}
                onChange={(e) => handleSliderChange(setCycles, e.target.value)}
                className="w-full cursor-pointer h-2 bg-gray-200 rounded-lg accent-[#2357A5]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1 junior batch</span>
                <span>2 batches</span>
                <span>3 batches</span>
                <span>4 batches</span>
              </div>
            </div>

            {/* Slider 3: Average Textbook Cost */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#162220] mb-1.5">
                <span>Average Retail Price of New Textbook</span>
                <span className="text-[#C99126] bg-[#FEF7E8] px-2 py-0.5 rounded-full font-extrabold text-sm">
                  ₹{avgPrice}
                </span>
              </div>
              <input 
                type="range"
                min="150"
                max="750"
                step="25"
                value={avgPrice}
                onChange={(e) => handleSliderChange(setAvgPrice, e.target.value)}
                className="w-full cursor-pointer h-2 bg-gray-200 rounded-lg accent-[#F2B544]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹150 (NCERT Core)</span>
                <span>₹450 (Reference Book)</span>
                <span>₹750 (Advanced Guide)</span>
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Scoreboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1 */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 text-center transition-all hover:scale-105">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#147D64] text-white mb-2">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="font-display text-xl font-extrabold text-[#147D64]">
                {co2Saved} <span className="text-xs font-semibold">kg</span>
              </div>
              <div className="text-[10px] font-bold text-gray-600 mt-0.5">CO₂ Offset</div>
            </div>

            {/* Metric 2 */}
            <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-3.5 text-center transition-all hover:scale-105">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#0E5B48] text-white mb-2">
                <TreePine className="h-4 w-4" />
              </div>
              <div className="font-display text-xl font-extrabold text-[#0E5B48]">
                {treesSaved}
              </div>
              <div className="text-[10px] font-bold text-gray-600 mt-0.5">Trees Conserved</div>
            </div>

            {/* Metric 3 */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5 text-center transition-all hover:scale-105">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#2357A5] text-white mb-2">
                <Droplets className="h-4 w-4" />
              </div>
              <div className="font-display text-xl font-extrabold text-[#2357A5]">
                {waterSaved} <span className="text-xs font-semibold">L</span>
              </div>
              <div className="text-[10px] font-bold text-gray-600 mt-0.5">Water Saved</div>
            </div>

            {/* Metric 4 */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-3.5 text-center transition-all hover:scale-105">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#C99126] text-white mb-2">
                <IndianRupee className="h-4 w-4" />
              </div>
              <div className="font-display text-xl font-extrabold text-[#C99126]">
                ₹{moneySaved.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold text-gray-600 mt-0.5">Family Budget Saved</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {!hasPledged ? (
              <button
                onClick={handlePledge}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#147D64] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#147D64]/25 hover:bg-[#0E5B48] transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4 text-[#F2B544]" />
                <span>Pledge to Share These Textbooks</span>
              </button>
            ) : (
              <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-3.5 text-center flex items-center justify-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                <span>Pledge Recorded for {currentStudent.name}! You're a Campus Eco-Champion.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
