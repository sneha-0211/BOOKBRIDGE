import React, { useState, useRef } from 'react';
import { 
  Bookmark, 
  MapPin, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  School,
  Eye,
  Heart
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { playClickSound, playSuccessSound } from '../utils/soundEffects';

export default function BookCard({ book, onOpenDetails, onOpenRequest }) {
  const { currentStudent, showToast } = useStudent();
  const [isSaved, setIsSaved] = useState(book.is_saved || false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef(null);

  // 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const toggleSave = async (e) => {
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    playClickSound();
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-books/${book.id}?student_id=${currentStudent.student_id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setIsSaved(false);
          showToast(`Removed "${book.title}" from saved books.`);
        }
      } else {
        const res = await fetch(`/api/saved-books/${book.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: currentStudent.student_id })
        });
        if (res.ok) {
          setIsSaved(true);
          playSuccessSound();
          showToast(`Saved "${book.title}" to your wishlist!`, 'success');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getConditionConfig = (cond) => {
    switch (cond) {
      case 'Like New':
        return { style: 'bg-emerald-100 text-emerald-800 border-emerald-200', pct: 98, color: '#10B981' };
      case 'Good':
        return { style: 'bg-blue-100 text-blue-800 border-blue-200', pct: 85, color: '#3B82F6' };
      default:
        return { style: 'bg-amber-100 text-amber-800 border-amber-200', pct: 72, color: '#F59E0B' };
    }
  };

  const conditionConfig = getConditionConfig(book.condition);
  const isOwner = book.owner_student_id === currentStudent.student_id;
  const isAvailable = book.status === 'available';

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out'
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E2E8E5] shadow-card hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Holographic light sheen on hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none z-20 opacity-30 transition-opacity bg-gradient-to-tr from-transparent via-white to-transparent"
          style={{
            transform: `translate(${tilt.y * 8}px, ${tilt.x * 8}px)`
          }}
        />
      )}
      
      {/* Top Media & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-emerald-900/10 to-blue-900/10">
        <img 
          src={book.cover_image_url || "/images/class7_science_cover.jpg"} 
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/class7_science_cover.jpg";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="rounded-md bg-[#147D64] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            {book.class_level}
          </span>
          <span className="rounded-md bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-[#162220] shadow-xs">
            {book.subject}
          </span>
        </div>

        {/* Quick Preview Hover Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            onOpenDetails(book);
          }}
          className="absolute top-3 right-12 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-gray-700 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white shadow-sm"
          title="Quick preview details"
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Bookmark Action with pop effect */}
        <button
          onClick={toggleSave}
          className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-115 active:scale-95 shadow-sm ${
            isSaved ? 'bg-rose-500 text-white' : 'bg-white/85 text-gray-700 hover:bg-white'
          }`}
          title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 transition-transform ${isSaved ? 'fill-white scale-110' : ''}`} />
        </button>

        {/* Bottom Strip on Image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] z-10">
          <span className="flex items-center gap-1 font-medium drop-shadow-sm">
            <School className="h-3.5 w-3.5 text-[#F2B544]" />
            <span className="truncate max-w-[160px]">{book.pickup_area}</span>
          </span>
          <span className={`rounded-full px-2 py-0.2 text-[9px] font-extrabold uppercase border ${
            isAvailable ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-amber-500/90 text-white border-amber-400'
          }`}>
            {book.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow justify-between relative z-10">
        <div>
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 
              onClick={() => {
                playClickSound();
                onOpenDetails(book);
              }}
              className="font-display text-sm font-bold text-[#162220] line-clamp-2 cursor-pointer hover:text-[#147D64] transition-colors"
              title={book.title}
            >
              {book.title}
            </h3>
          </div>

          {/* Condition & Health Bar */}
          <div className="mb-2.5">
            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
              <span className={`rounded-md border px-2 py-0.2 font-semibold ${conditionConfig.style}`}>
                {book.condition}
              </span>
              <span className="font-semibold text-gray-600">{conditionConfig.pct}% Condition</span>
            </div>
            {/* Visual Condition Meter Bar */}
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${conditionConfig.pct}%`, 
                  backgroundColor: conditionConfig.color 
                }}
              />
            </div>
          </div>

          {/* Listing Type & AI Badge */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
              book.listing_type === 'Free Donation' 
                ? 'bg-purple-50 text-purple-700 border-purple-200' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              {book.listing_type}
            </span>
            {book.ai_scanned ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#147D64] bg-[#E9F5F1] px-1.5 py-0.5 rounded" title="Scanned via EasyOCR Computer Vision">
                <Sparkles className="h-3 w-3 text-[#147D64]" />
                <span>AI Verified</span>
              </span>
            ) : null}
          </div>

          {/* Edition Preview */}
          <p className="text-xs text-[#5F736C] line-clamp-2 mb-3 leading-relaxed">
            {book.notes || `${book.edition || 'Standard Edition'} - Verified for school syllabus.`}
          </p>
        </div>

        {/* Card Footer: Owner Info & Actions */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-gray-400" />
              <span>Owner: <strong className="text-gray-700 font-semibold">{book.owner_name}</strong> ({book.owner_grade})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                onOpenDetails(book);
              }}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-700 transition-colors hover:border-[#147D64] hover:text-[#147D64]"
            >
              Details
            </button>
            
            {isOwner ? (
              <div className="rounded-xl bg-gray-100 px-3 py-2 text-center text-xs font-bold text-gray-500">
                Your Listing
              </div>
            ) : (
              <button
                disabled={!isAvailable}
                onClick={() => {
                  playClickSound();
                  onOpenRequest(book);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-3.5 text-xs font-bold transition-all shadow-xs ${
                  isAvailable
                    ? 'bg-[#147D64] text-white hover:bg-[#0E5B48] hover:shadow-md'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>{book.listing_type === 'Free Donation' ? 'Claim Book' : 'Request Book'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
