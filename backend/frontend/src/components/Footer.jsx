import React from 'react';
import BookBridgeLogo from './BookBridgeLogo';
import { useStudent } from '../context/StudentContext';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  const { setCurrentPage } = useStudent();

  return (
    <footer className="mt-16 border-t border-[#E2E8E5] bg-white py-12 text-xs text-[#5F736C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <BookBridgeLogo size="default" showTagline={true} />
            <p className="mt-3 max-w-md text-xs leading-relaxed text-[#5F736C]">
              BOOKBRIDGE AI is an educational technology solution designed for Class 7 innovation competition <em>The Brand Architects</em>. We connect students with unused books through AI book recognition, intelligent matching, and safe school-supervised sharing.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-[#147D64]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>One Book. One Bridge. Endless Possibilities.</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#162220] mb-3">
              Core Capabilities
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('scanner')} className="hover:text-[#147D64] transition-colors">
                  AI Book Scanner (OCR)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('matching')} className="hover:text-[#147D64] transition-colors">
                  Smart Curriculum Matching
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('marketplace')} className="hover:text-[#147D64] transition-colors">
                  Book Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('share')} className="hover:text-[#147D64] transition-colors">
                  Share or Donate a Book
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('impact')} className="hover:text-[#147D64] transition-colors">
                  Real Community Impact
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Competition info */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#162220] mb-3">
              Safety & Standards
            </h4>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Zero Public Contact Info</span>
              </p>
              <p>School library & campus handover</p>
              <p>Transparent explainable matching</p>
              <p className="pt-2 text-gray-400">Class 7 Innovation Project • The Brand Architects</p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} BOOKBRIDGE AI. All rights reserved. Class 7 Innovation Prototype.</p>
          <div className="flex items-center gap-1 text-gray-600">
            <span>Empowering students through circular education & sustainable learning.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
