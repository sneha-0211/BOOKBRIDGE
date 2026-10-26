import React from 'react';
import BookBridgeLogo from '../components/BookBridgeLogo';
import SafetyBanner from '../components/SafetyBanner';
import { 
  Sparkles, 
  BookOpen, 
  TreePine, 
  ShieldCheck, 
  Cpu, 
  Heart, 
  Award,
  Globe2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      
      {/* Hero Statement */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E9F5F1] px-4 py-1.5 text-xs font-bold text-[#147D64]">
          <Award className="h-4 w-4" />
          <span>The Brand Architects • Class 7 Innovation Project</span>
        </div>
        
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#162220] tracking-tight">
          One Book. One Bridge. <br />
          <span className="text-[#147D64]">Endless Possibilities.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#5F736C] leading-relaxed">
          BOOKBRIDGE AI was conceived by Class 7 students to tackle an everyday problem in our school corridors: why do valuable textbooks get abandoned in shelves while fellow students struggle to afford them?
        </p>
      </div>

      {/* Brand Identity & Logo Philosophy */}
      <div className="rounded-3xl bg-white p-8 border border-[#E2E8E5] shadow-card">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            <BookBridgeLogo size="large" showTagline={true} />
          </div>
          <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-display text-base font-bold text-[#162220]">
              The Symbol Behind Our Logo
            </h3>
            <p>
              Our emblem features an <strong>open book forming an arching bridge</strong> between two school students. The arch symbolizes knowledge transfer, connection, and empathy.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="rounded-xl bg-[#E9F5F1] p-2 text-center border border-emerald-200">
                <span className="block font-bold text-[#147D64]">Deep Green</span>
                <span className="text-[10px] text-gray-500">#147D64 • Growth & Sustainability</span>
              </div>
              <div className="rounded-xl bg-[#EEF4FC] p-2 text-center border border-blue-200">
                <span className="block font-bold text-[#2357A5]">Knowledge Blue</span>
                <span className="text-[10px] text-gray-500">#2357A5 • Education & Trust</span>
              </div>
              <div className="rounded-xl bg-[#FEF7E8] p-2 text-center border border-amber-200">
                <span className="block font-bold text-[#C99126]">Hope Yellow</span>
                <span className="text-[10px] text-gray-500">#F2B544 • Student Optimism</span>
              </div>
              <div className="rounded-xl bg-gray-50 p-2 text-center border border-gray-200">
                <span className="block font-bold text-gray-700">Off-White</span>
                <span className="text-[10px] text-gray-500">#F5F7F4 • Clean Accessibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars: Mission, AI Architecture, Sustainability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: Mission */}
        <div className="group rounded-3xl bg-white overflow-hidden border border-[#E2E8E5] shadow-card flex flex-col justify-between transition-all hover:border-[#147D64]">
          <div className="relative h-44 w-full overflow-hidden bg-gray-100">
            <img 
              src="/images/book_drive_students.jpg" 
              alt="Students organizing BookBridge Textbook Reuse Drive"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-white drop-shadow-sm">
              Student-Led Campus Drives
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#147D64] mb-3">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#162220] mb-2">
                Peer Empathy Mission
              </h3>
              <p className="text-xs text-[#5F736C] leading-relaxed">
                Every student deserves access to textbooks without financial hardship. By creating a frictionless school-based exchange network, no book sits idle.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-[#147D64]">
              Aligned with UN SDG 4: Quality Education
            </div>
          </div>
        </div>

        {/* Pillar 2: AI Technology */}
        <div className="group rounded-3xl bg-white overflow-hidden border border-[#E2E8E5] shadow-card flex flex-col justify-between transition-all hover:border-[#2357A5]">
          <div className="relative h-44 w-full overflow-hidden bg-gray-100">
            <img 
              src="/images/hero_students_exchange.jpg" 
              alt="Students with science textbook in library"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-white drop-shadow-sm">
              Real Textbook Recognition
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#2357A5] mb-3">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#162220] mb-2">
                Explainable AI Design
              </h3>
              <p className="text-xs text-[#5F736C] leading-relaxed">
                We employ real local EasyOCR with transparent evidence extraction. Our Smart Matching engine prioritizes curriculum relevance with explainable scoring breakdown.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-[#2357A5]">
              Zero Fake Percentages
            </div>
          </div>
        </div>

        {/* Pillar 3: Sustainability */}
        <div className="group rounded-3xl bg-white overflow-hidden border border-[#E2E8E5] shadow-card flex flex-col justify-between transition-all hover:border-[#C99126]">
          <div className="relative h-44 w-full overflow-hidden bg-gray-100">
            <img 
              src="/images/environmental_trees_impact.jpg" 
              alt="Students planting trees in school campus"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-white drop-shadow-sm">
              Saving Trees & Paper Pulp
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-[#C99126] mb-3">
                <TreePine className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#162220] mb-2">
                Circular Sustainability
              </h3>
              <p className="text-xs text-[#5F736C] leading-relaxed">
                Reusing one textbook saves 1.8 kg of CO₂ emissions and paper pulp consumption. When an entire class participates, hundreds of trees remain standing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-[#C99126]">
              Aligned with UN SDG 12: Responsible Consumption
            </div>
          </div>
        </div>

      </div>

      {/* Student Safety Charter with Real Librarian Handover Photo */}
      <div className="rounded-3xl bg-white p-8 border border-[#E2E8E5] shadow-card">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
          <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-md group">
            <img 
              src="/images/school_handover_safe.jpg" 
              alt="School librarian supervising student book handover" 
              className="w-full h-56 sm:h-64 object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
              <span className="inline-block rounded bg-[#147D64] px-2 py-0.5 text-[9px] font-bold uppercase mb-1">On-Campus Safety</span>
              <p className="font-semibold text-white drop-shadow-xs">Librarian Mrs. Mehra overseeing Class 7 handover at the junior library desk</p>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#147D64]" />
              <h3 className="font-display text-lg font-bold text-[#162220]">
                Child Safety & Privacy Charter
              </h3>
            </div>
            <p className="text-xs text-[#5F736C] leading-relaxed">
              Designed specifically for middle school environments. BOOKBRIDGE ensures safety through institutional oversight, removing the vulnerabilities of open classifieds.
            </p>
            <div className="space-y-2 pt-1 text-xs text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-[#147D64] font-bold">✓</span>
                <span><strong>Zero Private Phone Numbers:</strong> All requests stay strictly inside the school portal.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#147D64] font-bold">✓</span>
                <span><strong>Designated Campus Hubs:</strong> Central library counter and homerooms only.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#147D64] font-bold">✓</span>
                <span><strong>Teacher Co-Sign:</strong> Every transaction tags a faculty supervisor.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-700 pt-4 border-t border-gray-100">
          <div className="rounded-xl bg-[#F5F7F4] p-4">
            <strong className="block font-bold text-[#162220] mb-1">1. Zero Private Data</strong>
            <p className="text-[#5F736C]">
              No phone numbers, home addresses, or personal emails are ever published. Students only see first names and class sections.
            </p>
          </div>
          <div className="rounded-xl bg-[#F5F7F4] p-4">
            <strong className="block font-bold text-[#162220] mb-1">2. Campus Handovers Only</strong>
            <p className="text-[#5F736C]">
              All exchanges are scheduled at verified school points such as the school library counter or homeroom teacher desk.
            </p>
          </div>
          <div className="rounded-xl bg-[#F5F7F4] p-4">
            <strong className="block font-bold text-[#162220] mb-1">3. Adult Supervision</strong>
            <p className="text-[#5F736C]">
              Every exchange request includes a designated teacher or school librarian supervisor tag for full accountability.
            </p>
          </div>
        </div>
      </div>

      <SafetyBanner />

    </div>
  );
}
