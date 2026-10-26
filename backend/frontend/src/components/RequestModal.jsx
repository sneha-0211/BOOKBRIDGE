import React, { useState } from 'react';
import { X, Send, ShieldCheck, School, MessageSquare } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export default function RequestModal({ book, onClose, onSuccess }) {
  const { currentStudent, showToast, refreshRequestsCount, setCurrentPage } = useStudent();
  const [message, setMessage] = useState(
    `Hi ${book.owner_name}! I am in ${currentStudent.grade} and would love to read/use this book for our Class 7 coursework.`
  );
  const [proposedHandover, setProposedHandover] = useState(
    book.pickup_area || 'School Central Library Desk'
  );
  const [supervisorNote, setSupervisorNote] = useState(
    'Class Teacher / School Librarian supervision'
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: book.id,
          requester_name: currentStudent.name,
          requester_student_id: currentStudent.student_id,
          requester_grade: currentStudent.grade,
          message: message.trim(),
          proposed_handover: proposedHandover.trim(),
          parent_teacher_contact_note: supervisorNote.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Request sent to ${book.owner_name} for "${book.title}"!`, 'success');
        refreshRequestsCount();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showToast(data.detail || 'Could not send request', 'error');
      }
    } catch (err) {
      showToast('Network error while sending request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sampleMessages = [
    `I am preparing for the Term 1 Science exam and need this book.`,
    `I have a Class 7 Mathematics book I can exchange with you!`,
    `Our teacher recommended we practice chapter exercises from this edition.`
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#147D64]">
            Supervised Book Sharing Request
          </span>
          <h3 className="font-display text-xl font-bold text-[#162220]">
            Request "{book.title}"
          </h3>
          <p className="text-xs text-[#5F736C]">
            From: <strong>{currentStudent.name}</strong> ({currentStudent.grade}) → To: <strong>{book.owner_name}</strong> ({book.owner_grade})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Quick Snippets */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
              Quick message templates:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sampleMessages.map((msg, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setMessage(msg)}
                  className="rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-[#147D64] px-2.5 py-1 text-[11px] text-gray-700 transition-colors"
                >
                  {msg.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Your Message to {book.owner_name}:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none focus:ring-1 focus:ring-[#147D64]"
              placeholder="Explain why you need the book or what you can exchange..."
            />
          </div>

          {/* Proposed Handover Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              School Handover Location:
            </label>
            <div className="relative">
              <input
                type="text"
                value={proposedHandover}
                onChange={(e) => setProposedHandover(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 p-3 pl-8 text-xs focus:border-[#147D64] focus:outline-none focus:ring-1 focus:ring-[#147D64]"
                placeholder="e.g. School Library Counter, Classroom 7-B after 3 PM"
              />
              <School className="absolute left-2.5 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Supervisor / Adult Oversight Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Teacher or Parent Supervisor:
            </label>
            <input
              type="text"
              value={supervisorNote}
              onChange={(e) => setSupervisorNote(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#147D64] focus:outline-none focus:ring-1 focus:ring-[#147D64]"
              placeholder="e.g. Mrs. Mehra, 7B Class Teacher"
            />
          </div>

          {/* Safety Reminder */}
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 p-3 text-[11px] text-[#0E5B48] border border-emerald-200/50">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#147D64]" />
            <span>
              All book handovers must be conducted on school grounds during designated hours.
            </span>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#147D64] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0E5B48] disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{loading ? 'Sending Request...' : 'Send Safe Request'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
