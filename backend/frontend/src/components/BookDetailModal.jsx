import React from 'react';
import { X, ShieldCheck, MapPin, School, BookOpen, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export default function BookDetailModal({ book, onClose, onRequest }) {
  const { currentStudent } = useStudent();
  if (!book) return null;

  const isOwner = book.owner_student_id === currentStudent.student_id;
  const isAvailable = book.status === 'available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="relative h-52 w-full sm:w-40 shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-md">
            <img 
              src={book.cover_image_url || "/images/class7_science_cover.jpg"} 
              alt={book.title} 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/class7_science_cover.jpg";
              }}
            />
            <div className="absolute top-2 left-2 rounded-md bg-[#147D64] px-2 py-0.5 text-[10px] font-bold text-white">
              {book.class_level}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-md bg-emerald-50 text-[#147D64] border border-emerald-200 px-2 py-0.5 text-xs font-bold">
                  {book.subject}
                </span>
                <span className="rounded-md bg-blue-50 text-[#2357A5] border border-blue-200 px-2 py-0.5 text-xs font-bold">
                  {book.condition} Condition
                </span>
                <span className="rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-xs font-bold">
                  {book.listing_type}
                </span>
              </div>

              <h2 className="font-display text-xl font-bold text-[#162220] leading-tight mb-2">
                {book.title}
              </h2>

              <p className="text-xs text-gray-500">
                Edition: <strong className="text-gray-700">{book.edition || 'Current School Curriculum'}</strong>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#147D64]/10 text-[#147D64] font-bold text-sm">
                {book.owner_name[0]}
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#162220]">Listed by {book.owner_name}</p>
                <p className="text-gray-500">{book.owner_grade} - Verified Student</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4 text-xs">
          {/* Notes */}
          <div className="rounded-2xl bg-[#F5F7F4] p-4">
            <h4 className="font-bold text-gray-700 mb-1">Student Notes & Book State</h4>
            <p className="text-[#5F736C] leading-relaxed">
              {book.notes || 'Book has been kept in good condition. All chapters and revision exercises are intact.'}
            </p>
          </div>

          {/* Handover & Location */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-2 font-bold text-[#0E5B48] mb-2">
              <School className="h-4 w-4 text-[#147D64]" />
              <span>Designated Handover Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
              <div>
                <span className="text-gray-500 block text-[11px]">Method:</span>
                <strong className="font-semibold">{book.handover_method}</strong>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Campus Location:</span>
                <strong className="font-semibold">{book.pickup_area}</strong>
              </div>
            </div>
            {book.exchange_preference && (
              <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[11px] text-[#0E5B48]">
                <strong>Exchange Preference:</strong> {book.exchange_preference}
              </div>
            )}
          </div>

          {/* OCR Verification Tag */}
          {book.ai_scanned ? (
            <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/60 p-3 text-[11px] text-teal-800">
              <Sparkles className="h-4 w-4 shrink-0 text-[#147D64]" />
              <span>
                <strong>AI OCR Verified:</strong> Cover text extracted and validated for Class 7 curriculum compliance.
              </span>
            </div>
          ) : null}

          {/* Student Safety notice */}
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#147D64]" />
            <span>Handover will occur on school premises under adult / librarian supervision.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
          
          {isOwner ? (
            <div className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500">
              Your Listed Book
            </div>
          ) : (
            <button
              disabled={!isAvailable}
              onClick={() => {
                onClose();
                onRequest(book);
              }}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all ${
                isAvailable ? 'bg-[#147D64] hover:bg-[#0E5B48]' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {book.listing_type === 'Free Donation' ? 'Claim This Donation' : 'Request Book Exchange'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
