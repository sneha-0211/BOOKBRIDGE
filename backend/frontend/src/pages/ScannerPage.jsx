import React, { useState, useRef, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { playClickSound, playScanLaserSound, playSuccessSound, playConfettiSound } from '../utils/soundEffects';
import { fireConfetti } from '../utils/confetti';
import { 
  Scan, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Edit3, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  Info,
  HelpCircle,
  Camera,
  Crosshair,
  Eye,
  Sliders
} from 'lucide-react';

export default function ScannerPage() {
  const { currentStudent, showToast, setCurrentPage } = useStudent();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStepMessage, setScanStepMessage] = useState('');
  const [forceDemo, setForceDemo] = useState(false);
  const [demoPresetIndex, setDemoPresetIndex] = useState(0);

  // Scan result state
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeBoundingBox, setActiveBoundingBox] = useState(null);

  // Editable Form Fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Science');
  const [classLevel, setClassLevel] = useState('Class 7');
  const [edition, setEdition] = useState('');
  const [condition, setCondition] = useState('Good');
  const [listingType, setListingType] = useState('Free Donation');
  const [exchangePreference, setExchangePreference] = useState('');
  const [handoverMethod, setHandoverMethod] = useState('School Library Handover');
  const [pickupArea, setPickupArea] = useState('Junior Library Counter (Mrs. Mehra Desk)');
  const [notes, setNotes] = useState('');

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedBookId, setPublishedBookId] = useState(null);

  const demoPresets = [
    {
      name: 'Class 7 Science Textbook (NCERT)',
      index: 0,
      image: '/images/class7_science_cover.jpg',
      desc: 'Ideal for jury scenario demonstration: Harshit uploads Class 7 Science book',
      sampleBoxes: [
        { label: 'TITLE', text: 'SCIENCE', top: 20, left: 18, width: 62, height: 16, conf: '98.5%' },
        { label: 'CLASS', text: 'Textbook for Class VII', top: 40, left: 22, width: 56, height: 12, conf: '99.1%' },
        { label: 'CURRICULUM', text: 'NCERT', top: 78, left: 35, width: 30, height: 10, conf: '97.8%' }
      ]
    },
    {
      name: 'Class 7 Mathematics (NCERT)',
      index: 1,
      image: '/images/class7_math_cover.jpg',
      desc: 'Integers, Fractions and Equations textbook',
      sampleBoxes: [
        { label: 'TITLE', text: 'MATHEMATICS', top: 22, left: 16, width: 68, height: 16, conf: '97.9%' },
        { label: 'CLASS', text: 'Class 7', top: 42, left: 30, width: 40, height: 12, conf: '98.6%' },
        { label: 'CURRICULUM', text: 'NCERT', top: 75, left: 32, width: 35, height: 10, conf: '98.2%' }
      ]
    },
    {
      name: 'Class 7 History: Our Pasts - II',
      index: 2,
      image: '/images/class7_history_cover.jpg',
      desc: 'Social Science medieval history curriculum',
      sampleBoxes: [
        { label: 'TITLE', text: 'OUR PASTS - II', top: 24, left: 20, width: 60, height: 15, conf: '96.8%' },
        { label: 'SUBJECT', text: 'Social Science', top: 44, left: 25, width: 50, height: 12, conf: '97.4%' },
        { label: 'CLASS', text: 'Class VII', top: 62, left: 32, width: 36, height: 11, conf: '99.0%' }
      ]
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Image file size must be less than 10MB.');
        return;
      }
      playClickSound();
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
      setScanResult(null);
    }
  };

  const selectDemoPreset = (preset) => {
    playClickSound();
    setDemoPresetIndex(preset.index);
    setPreviewUrl(preset.image);
    setSelectedFile(null);
    setForceDemo(true);
    setErrorMsg('');
    setScanResult(null);
  };

  const runBookScan = async () => {
    if (!previewUrl && !selectedFile) {
      setErrorMsg('Please select a photo or load a demo textbook sample first.');
      return;
    }

    setScanning(true);
    setErrorMsg('');
    playScanLaserSound();
    setScanStepMessage('Initializing EasyOCR vision engine & reading cover pixels...');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('force_demo', forceDemo ? 'true' : 'false');
      formData.append('demo_index', demoPresetIndex.toString());

      setTimeout(() => {
        setScanStepMessage('Detecting curriculum tokens & extracting typography...');
      }, 700);

      const res = await fetch('/api/scan-book', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setScanResult(data);
        setTitle(data.title || '');
        setSubject(data.subject || 'Science');
        setClassLevel(data.class_level || 'Class 7');
        setEdition(data.edition || '2024 Revised Edition');
        setCondition(data.condition || 'Good');
        setNotes(data.notes || '');
        playSuccessSound();
        showToast('Textbook OCR completed! Review & adjust fields below.', 'success');
      } else {
        setErrorMsg(data.message || 'Could not parse textbook cover.');
      }
    } catch (err) {
      setErrorMsg('Failed to communicate with OCR service.');
    } finally {
      setScanning(false);
      setScanStepMessage('');
    }
  };

  const handlePublishListing = async () => {
    if (!title.trim()) {
      showToast('Please enter a textbook title', 'error');
      return;
    }

    setPublishing(true);
    playClickSound();
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
          pickup_area: pickupArea,
          cover_image_url: previewUrl || (scanResult?.uploaded_image_url) || '/images/class7_science_cover.jpg',
          notes: notes.trim(),
          owner_name: currentStudent.name,
          owner_student_id: currentStudent.student_id,
          owner_grade: currentStudent.grade,
          ai_scanned: true,
          ocr_raw_text: scanResult?.raw_text || ''
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPublishedBookId(data.id);
        setShowConfirmModal(false);
        playConfettiSound();
        fireConfetti({ count: 90 });
        showToast(`"${title}" published successfully to campus marketplace!`, 'success');
      } else {
        showToast(data.detail || 'Error publishing listing', 'error');
      }
    } catch (e) {
      showToast('Network error while saving listing', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const currentPreset = demoPresets[demoPresetIndex] || demoPresets[0];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E9F5F1] px-3 py-1 text-xs font-bold text-[#147D64] mb-2">
          <Scan className="h-3.5 w-3.5" />
          <span>Stage 02 • Intelligent Book Recognition</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#162220]">
          AI Book Scanner & Cover Identifier
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5F736C]">
          Extract visible title and curriculum details using local OCR or verified demonstration presets. You retain 100% control to review and edit extracted fields before publishing.
        </p>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Upload & Preview with HUD Viewfinder */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-3xl bg-white p-6 border border-[#E2E8E5] shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-[#162220] flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#147D64]" />
                <span>1. Book Cover Viewfinder</span>
              </h3>
              {previewUrl && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Image Ready
                </span>
              )}
            </div>

            {/* Interactive Viewfinder Box with Reticles & Laser */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border-2 overflow-hidden text-center cursor-pointer transition-all ${
                previewUrl 
                  ? 'border-[#147D64] bg-slate-900 shadow-inner' 
                  : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
              }`}
            >
              {previewUrl ? (
                <div className="relative h-72 w-full overflow-hidden flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Book Cover Preview" 
                    className="h-full w-full object-contain filter contrast-105"
                  />

                  {/* Corner Camera HUD Reticles */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

                  {/* Center HUD Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <Crosshair className="h-10 w-10 text-emerald-300 animate-pulse-subtle" />
                  </div>

                  {/* Laser Sweeper Beam Animation when scanning */}
                  {scanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-laser pointer-events-none z-30" />
                  )}

                  {/* Interactive OCR Bounding Box Overlays */}
                  {scanResult && currentPreset.sampleBoxes.map((box, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setActiveBoundingBox(idx)}
                      onMouseLeave={() => setActiveBoundingBox(null)}
                      style={{
                        top: `${box.top}%`,
                        left: `${box.left}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`
                      }}
                      className={`absolute border rounded transition-all cursor-pointer z-20 ${
                        activeBoundingBox === idx
                          ? 'border-emerald-400 bg-emerald-500/25 shadow-[0_0_12px_#10b981]'
                          : 'border-emerald-400/60 bg-emerald-500/10 hover:border-emerald-300'
                      }`}
                    >
                      <span className="absolute -top-4 left-0 rounded bg-emerald-700/90 px-1 py-0.2 text-[9px] font-mono text-white font-bold tracking-wider">
                        {box.label}: {box.conf}
                      </span>
                    </div>
                  ))}

                  {/* Overlay instructions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold z-30">
                    Click to replace photo
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#147D64]">
                    <Upload className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#162220]">Click or drag textbook cover photo</p>
                    <p className="text-[11px] text-gray-500">Supports JPG, PNG, WebP (up to 10MB)</p>
                  </div>
                </div>
              )}

              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Demo Presets Selector for Competition Jurors */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-700">
                  Competition Demo Presets:
                </span>
                <span className="text-[10px] rounded-md bg-[#F2B544]/20 text-[#C99126] font-bold px-1.5 py-0.5">
                  1-Click Test
                </span>
              </div>

              <div className="space-y-1.5">
                {demoPresets.map((preset) => (
                  <button
                    key={preset.index}
                    type="button"
                    onClick={() => selectDemoPreset(preset)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all border ${
                      previewUrl === preset.image
                        ? 'border-[#147D64] bg-[#E9F5F1] text-[#0E5B48] font-bold shadow-xs'
                        : 'border-gray-100 bg-[#F5F7F4] text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span className="text-[10px] text-gray-400">Load Cover →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scan Action Button */}
            <div className="mt-5">
              <button
                type="button"
                disabled={scanning || !previewUrl}
                onClick={runBookScan}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#147D64] py-3.5 px-4 text-xs font-bold text-white shadow-md shadow-[#147D64]/20 hover:bg-[#0E5B48] hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {scanning ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Analyzing Cover Typography...</span>
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4" />
                    <span>Run AI Book Recognition</span>
                  </>
                )}
              </button>

              {scanStepMessage && (
                <p className="mt-2 text-center text-[11px] font-semibold text-[#147D64] animate-pulse">
                  {scanStepMessage}
                </p>
              )}

              {errorMsg && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-2.5 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Review, Evidence & Edit Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E2E8E5] shadow-card">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="font-display text-base font-bold text-[#162220]">
                  2. Review & Edit Extracted Information
                </h3>
                <p className="text-xs text-[#5F736C]">
                  Verify extracted details and adjust if necessary before publishing.
                </p>
              </div>

              {/* Engine Badge */}
              {scanResult && (
                <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border ${
                  scanResult.is_demo_mode 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  <Sparkles className="h-3 w-3" />
                  <span>{scanResult.badge}</span>
                </div>
              )}
            </div>

            {/* Notice if no scan has run yet */}
            {!scanResult && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F5F7F4] p-8 text-center text-xs text-gray-500 mb-6">
                <Scan className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="font-semibold text-gray-700">Cover Scan Pending</p>
                <p className="mt-1">
                  Upload a photo or select a Class 7 demo preset, then click <strong>"Run AI Book Recognition"</strong> to extract metadata with visible evidence.
                </p>
              </div>
            )}

            {/* Transparent Evidence Box */}
            {scanResult && scanResult.evidence && scanResult.evidence.length > 0 && (
              <div className="mb-6 rounded-2xl bg-[#F5F7F4] p-4 border border-gray-100 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-gray-700 mb-2">
                  <Info className="h-4 w-4 text-[#147D64]" />
                  <span>Evidence Extracted From Visible Cover Text:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scanResult.evidence.map((ev, i) => (
                    <div key={i} className="rounded-lg bg-white p-2.5 border border-gray-100 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">{ev.field}</span>
                      <strong className="text-gray-800 text-xs font-semibold">"{ev.detected_text}"</strong>
                      <span className="text-[10px] text-emerald-600 block">Confidence: {ev.confidence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editable Form */}
            <div className="space-y-4 text-xs">
              
              {/* Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Textbook Title *
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NCERT Science - Textbook for Class VII"
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none focus:ring-1 focus:ring-[#147D64]"
                />
              </div>

              {/* Subject & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Social Science">Social Science</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Sanskrit">Sanskrit</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Class Level *
                  </label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none"
                  >
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>
              </div>

              {/* Edition */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Edition / Curriculum Year
                </label>
                <input 
                  type="text"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  placeholder="e.g. 2024-2025 Revised Edition"
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none"
                />
              </div>

              {/* Interactive Condition Picker Cards */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  Book Physical Condition *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'Like New', desc: 'Crisp pages, no marks', pct: '98%', color: '#10B981' },
                    { val: 'Good', desc: 'Minor notes, solid spine', pct: '85%', color: '#3B82F6' },
                    { val: 'Used', desc: 'Cover wear, complete text', pct: '70%', color: '#F59E0B' }
                  ].map((card) => {
                    const isSelected = condition === card.val;
                    return (
                      <div
                        key={card.val}
                        onClick={() => {
                          setCondition(card.val);
                          playClickSound();
                        }}
                        className={`rounded-xl p-2.5 cursor-pointer border text-center transition-all ${
                          isSelected 
                            ? 'border-[#147D64] bg-[#E9F5F1] shadow-xs' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#162220] flex items-center justify-center gap-1">
                          <span>{card.val}</span>
                          <span className="text-[10px] text-gray-400">({card.pct})</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{card.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sharing Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Sharing Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none"
                  >
                    <option value="Free Donation">Free Donation (Gift to peer)</option>
                    <option value="Exchange">Exchange (Swap for another subject/class)</option>
                  </select>
                </div>

                {listingType === 'Exchange' && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Exchange Preference
                    </label>
                    <input 
                      type="text"
                      value={exchangePreference}
                      onChange={(e) => setExchangePreference(e.target.value)}
                      placeholder="e.g. Looking for Class 8 Math"
                      className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Handover & Pickup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Handover Method *
                  </label>
                  <select
                    value={handoverMethod}
                    onChange={(e) => setHandoverMethod(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none"
                  >
                    <option value="School Library Handover">School Library Handover</option>
                    <option value="Teacher-Assisted Exchange">Teacher-Assisted Exchange</option>
                    <option value="Classroom Section Handover">Classroom Section Handover</option>
                    <option value="Parent Supervised">Parent Supervised</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Campus Pickup Area *
                  </label>
                  <input 
                    type="text"
                    value={pickupArea}
                    onChange={(e) => setPickupArea(e.target.value)}
                    placeholder="e.g. Junior Library Counter, Room 7B"
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Notes for Student Recipient
                </label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. All chapters intact. Includes revision question summaries."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs font-medium focus:border-[#147D64] focus:outline-none"
                />
              </div>

              {/* Publisher student tag */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-gray-500">
                <span>Listing as: <strong className="text-gray-800">{currentStudent.name}</strong> ({currentStudent.grade})</span>
                <span className="text-[11px] text-[#147D64]">Campus ID: {currentStudent.student_id}</span>
              </div>

              {/* Confirm & Publish Button */}
              <div className="pt-3">
                <button
                  type="button"
                  disabled={!title.trim()}
                  onClick={() => {
                    playClickSound();
                    setShowConfirmModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#147D64] py-3.5 px-4 text-xs font-bold text-white shadow-md hover:bg-[#0E5B48] disabled:opacity-50 transition-all hover:shadow-lg"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verify Details & Publish Listing</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#147D64]">
                Step 3 of 3 • Final Confirmation
              </span>
              <h3 className="font-display text-xl font-bold text-[#162220]">
                Confirm & Publish Book?
              </h3>
              <p className="text-xs text-[#5F736C]">
                Please review the finalized listing details before publishing to your school peers.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F5F7F4] p-4 text-xs space-y-2">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Title</span>
                <strong className="text-[#162220] font-bold">{title}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Class & Subject</span>
                  <span>{classLevel} • {subject}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Condition</span>
                  <span>{condition}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Handover Location</span>
                <span>{handoverMethod} ({pickupArea})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-[11px] text-[#0E5B48]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#147D64]" />
              <span>No phone number or home address will be shown publicly.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Back to Edit
              </button>

              <button
                type="button"
                disabled={publishing}
                onClick={handlePublishListing}
                className="rounded-xl bg-[#147D64] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0E5B48] disabled:opacity-50"
              >
                {publishing ? 'Publishing...' : 'Yes, Publish Listing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Published Success Banner */}
      {publishedBookId && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#147D64] text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-[#0E5B48]">Listing Published Live!</h4>
              <p className="text-xs text-gray-600">
                Your textbook is now visible in the Marketplace and ready for Smart Matching recommendations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('marketplace')}
              className="rounded-xl bg-[#147D64] px-4 py-2 text-xs font-bold text-white hover:bg-[#0E5B48]"
            >
              View in Marketplace
            </button>
            <button
              onClick={() => {
                setPublishedBookId(null);
                setPreviewUrl('');
                setSelectedFile(null);
                setScanResult(null);
                setTitle('');
              }}
              className="rounded-xl border border-emerald-300 px-4 py-2 text-xs font-bold text-[#147D64] hover:bg-white"
            >
              Scan Another Book
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
