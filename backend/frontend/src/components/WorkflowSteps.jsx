import React from 'react';
import { Camera, Sparkles, Cpu, Handshake, TrendingUp } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export default function WorkflowSteps({ activeIndex = null }) {
  const { setCurrentPage } = useStudent();

  const steps = [
    {
      step: '01',
      title: 'INPUT',
      subtitle: 'Student Snap / Upload',
      desc: 'Student captures textbook cover on smartphone or computer.',
      icon: Camera,
      color: 'bg-emerald-100 text-[#147D64]',
      targetPage: 'scanner'
    },
    {
      step: '02',
      title: 'BOOK RECOGNITION',
      subtitle: 'AI OCR & Title Parsing',
      desc: 'EasyOCR extracts visible text; heuristics detect class, subject & edition.',
      icon: Cpu,
      color: 'bg-teal-100 text-[#0E5B48]',
      targetPage: 'scanner'
    },
    {
      step: '03',
      title: 'SMART MATCHING',
      subtitle: 'Explainable Ranking',
      desc: 'Multi-factor algorithm ranks books by curriculum, subject & condition.',
      icon: Sparkles,
      color: 'bg-blue-100 text-[#2357A5]',
      targetPage: 'matching'
    },
    {
      step: '04',
      title: 'BOOK SHARING',
      subtitle: 'Supervised Peer Handover',
      desc: 'Students request and exchange books safely at school library desks.',
      icon: Handshake,
      color: 'bg-amber-100 text-[#C99126]',
      targetPage: 'exchanges'
    },
    {
      step: '05',
      title: 'COMMUNITY IMPACT',
      subtitle: 'Live Eco & Resource Metrics',
      desc: 'Actual database counts calculate CO2 saved and students equipped.',
      icon: TrendingUp,
      color: 'bg-emerald-100 text-[#147D64]',
      targetPage: 'impact'
    }
  ];

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-card border border-[#E2E8E5]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#147D64]">
            Competition Innovation Pipeline
          </span>
          <h3 className="font-display text-lg font-bold text-[#162220]">
            The 5-Stage BOOKBRIDGE AI Engine
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5F736C]">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>End-to-End Functional Flow</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeIndex === idx;

          return (
            <div
              key={s.step}
              onClick={() => setCurrentPage(s.targetPage)}
              className={`group relative flex flex-col justify-between rounded-xl p-4 transition-all cursor-pointer border ${
                isSelected
                  ? 'border-[#147D64] bg-[#E9F5F1] shadow-md -translate-y-1'
                  : 'border-gray-100 bg-[#F5F7F4]/60 hover:bg-white hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              {/* Connector line on desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-8 z-10 text-gray-300 font-bold text-xs pointer-events-none">
                  →
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-gray-400">
                    {s.step}
                  </span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h4 className="font-display text-xs font-extrabold tracking-wide text-[#162220]">
                  {s.title}
                </h4>
                <p className="text-[11px] font-semibold text-[#147D64] mb-1">
                  {s.subtitle}
                </p>
                <p className="text-[11px] text-[#5F736C] leading-snug">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-200/50 flex items-center justify-between text-[10px] font-bold text-[#2357A5] group-hover:underline">
                <span>View Stage</span>
                <span>↗</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
