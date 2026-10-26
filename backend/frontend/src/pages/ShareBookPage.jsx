import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import SafetyBanner from '../components/SafetyBanner';
import { 
  PlusCircle, 
  Upload, 
  CheckCircle2, 
  School, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function ShareBookPage() {
  const { currentStudent, showToast, setCurrentPage } = useStudent();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Science');
  const [classLevel, setClassLevel] = useState('Class 7');
  const [edition, setEdition] = useState('2024 Revised Edition');
  const [condition, setCondition] = useState('Good');
  const [listingType, setListingType] = useState('Free Donation');
  const [exchangePreference, setExchangePreference] = useState('');
  const [handoverMethod, setHandoverMethod] = useState('School Library Handover');
  const [pickupArea, setPickupArea] = useState('Junior Library Counter (Mrs. Mehra Desk)');
  const [coverImageUrl, setCoverImageUrl] = useState('/images/class7_science_cover.jpg');
  const [notes, setNotes] = useState('');
  const [agreeSafety, setAgreeSafety] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);

  const sampleCoverImages = [
    { label: 'Science Cover', url: '/images/class7_science_cover.jpg' },
    { label: 'Mathematics Cover', url: '/images/class7_math_cover.jpg' },
    { label: 'History / Social', url: '/images/class7_history_cover.jpg' },
    { label: 'English Literature', url: '/images/class7_english_cover.jpg' },
    { label: 'Class 8 Math', url: '/images/class8_math_cover.jpg' },
    { label: 'Class 6 Science', url: '/images/class6_science_cover.jpg' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a textbook title', 'error');
      return;
    }
    if (!agreeSafety) {
      showToast('Please confirm adherence to school handover guidelines', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subject,
          class_level: classLevel,
          edition: edition.trim(),
          condition,
          listing_type: listingType,
          exchange_preference: exchangePreference.trim(),
          handover_method: handoverMethod,
          pickupArea: pickupArea.trim(),
          cover_image_url: coverImageUrl,
          notes: notes.trim(),
          owner_name: currentStudent.name,
          owner_student_id: currentStudent.student_id,
          owner_grade: currentStudent.grade,
          ai_scanned: false,
          pickup_area: pickupArea.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessId(data.id);
        showToast(`"${title}" successfully listed for school sharing!`, 'success');
      } else {
        showToast(data.detail || 'Error saving listing', 'error');
      }
    } catch (err) {
      showToast('Network error while saving listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#147D64] mb-2">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Stage 04 • Supervised Sharing</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#162220]">
          Share or Donate a School Book
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5F736C]">
          Give your completed textbooks a new chapter. Fill in the details below to publish directly into your school resource network.
        </p>
      </div>

      {successId ? (
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-card space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#147D64] text-white">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#162220]">
            Book Listed Successfully!
          </h2>
          <p className="text-xs text-[#5F736C] max-w-md mx-auto">
            Your listing for <strong>"{title}"</strong> is now active. Students seeking this book can submit requests for library-supervised handover.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentPage('marketplace')}
              className="rounded-xl bg-[#147D64] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0E5B48]"
            >
              View in Marketplace
            </button>
            <button
              onClick={() => {
                setSuccessId(null);
                setTitle('');
                setNotes('');
              }}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              List Another Book
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E2E8E5] shadow-card">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Basic Metadata */}
            <div>
              <h3 className="font-display text-base font-bold text-[#162220] mb-3">
                1. Textbook Identity
              </h3>
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. NCERT Science - Textbook for Class VII"
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject *</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                    >
                      <option value="Science">Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Social Science">Social Science</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Sanskrit">Sanskrit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Class Level *</label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                    >
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Edition / Year</label>
                    <input
                      type="text"
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                      placeholder="e.g. 2024-25"
                      className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Condition & Sharing Type */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-display text-base font-bold text-[#162220] mb-3">
                2. Condition & Sharing Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Condition *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                  >
                    <option value="Like New">Like New (no marks, crisp cover)</option>
                    <option value="Good">Good (clean, readable, minor notes)</option>
                    <option value="Used">Used (wear on cover, all pages intact)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sharing Type *</label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                  >
                    <option value="Free Donation">Free Donation (Gift)</option>
                    <option value="Exchange">Exchange (Swap)</option>
                  </select>
                </div>
              </div>

              {listingType === 'Exchange' && (
                <div className="mt-3 text-xs">
                  <label className="block font-bold text-gray-700 mb-1">Exchange Preference</label>
                  <input
                    type="text"
                    value={exchangePreference}
                    onChange={(e) => setExchangePreference(e.target.value)}
                    placeholder="e.g. Seeking Class 8 Science or Olympiad Book"
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Step 3: School Handover Details */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-display text-base font-bold text-[#162220] mb-3">
                3. Campus Handover Protocol
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Supervision Method *</label>
                  <select
                    value={handoverMethod}
                    onChange={(e) => setHandoverMethod(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                  >
                    <option value="School Library Handover">School Library Handover</option>
                    <option value="Teacher-Assisted Exchange">Teacher-Assisted Exchange</option>
                    <option value="Classroom 7-B Desk">Classroom 7-B Desk</option>
                    <option value="Junior Wing Reception">Junior Wing Reception</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Campus Pickup Area *</label>
                  <input
                    type="text"
                    value={pickupArea}
                    onChange={(e) => setPickupArea(e.target.value)}
                    required
                    placeholder="e.g. Junior Library Counter (Mrs. Mehra Desk)"
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-bold text-gray-700 mb-1 text-xs">Notes for Recipient</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Covered with brown paper. Includes extra solved questions."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none"
                />
              </div>
            </div>

            {/* Step 4: Cover Image Picker */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block font-bold text-gray-700 mb-2 text-xs">
                Select Cover Image Sample:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sampleCoverImages.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCoverImageUrl(sample.url)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 p-1 transition-all ${
                      coverImageUrl === sample.url ? 'border-[#147D64] bg-[#E9F5F1]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={sample.url} alt={sample.label} className="h-20 w-full object-cover rounded-lg" />
                    <span className="block text-center text-[10px] font-semibold text-gray-700 mt-1">
                      {sample.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Agreement */}
            <div className="rounded-xl bg-emerald-50 p-3 text-xs text-[#0E5B48] flex items-center gap-3">
              <input
                type="checkbox"
                id="safety-check"
                checked={agreeSafety}
                onChange={(e) => setAgreeSafety(e.target.checked)}
                className="h-4 w-4 rounded text-[#147D64] focus:ring-[#147D64]"
              />
              <label htmlFor="safety-check" className="cursor-pointer">
                <strong>Safety Promise:</strong> I confirm that handover will happen strictly on school premises under teacher, librarian, or parent supervision.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#147D64] py-3.5 px-4 text-xs font-bold text-white shadow-md hover:bg-[#0E5B48] disabled:opacity-50 transition-all"
            >
              {submitting ? 'Saving to Database...' : 'Publish Book Listing'}
            </button>

          </form>

        </div>
      )}

      {/* Safety Notice */}
      <SafetyBanner compact={true} />

    </div>
  );
}
