import React from 'react';
import { ShieldCheck, School, Users, Lock } from 'lucide-react';

export default function SafetyBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 border border-emerald-200/60 p-3 text-xs text-[#0E5B48]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#147D64]" />
        <span><strong>Student Safe Zone:</strong> Exchanges happen at designated school library desks under teacher supervision. No phone numbers or private addresses are shared.</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-blue-50/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#147D64] text-white shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-[#0E5B48]">
              School-Verified Safety & Privacy Protocol
            </h4>
            <p className="text-xs text-[#5F736C]">
              Built specially for school students and parent-teacher community confidence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-[11px] font-medium text-[#162220] border border-emerald-100">
            <School className="h-3.5 w-3.5 text-[#147D64]" />
            <span>Campus Library Handover</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-[11px] font-medium text-[#162220] border border-blue-100">
            <Users className="h-3.5 w-3.5 text-[#2357A5]" />
            <span>Teacher/Parent Assisted</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-[11px] font-medium text-[#162220] border border-amber-100">
            <Lock className="h-3.5 w-3.5 text-[#C99126]" />
            <span>Zero Public Private Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
