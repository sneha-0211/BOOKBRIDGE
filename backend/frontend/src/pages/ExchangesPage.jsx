import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import SafetyBanner from '../components/SafetyBanner';
import { 
  Repeat, 
  Check, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  School, 
  User, 
  ShieldCheck, 
  Sparkles,
  Inbox
} from 'lucide-react';

export default function ExchangesPage() {
  const { currentStudent, showToast, refreshRequestsCount } = useStudent();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'received', 'sent', 'completed'
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/requests?student_id=${currentStudent.student_id}&role=all`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentStudent]);

  const handleUpdateStatus = async (requestId, newStatus, bookTitle) => {
    setActionLoadingId(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          handover_location: 'School Library Counter',
          supervisor_role: 'School Librarian'
        })
      });

      if (res.ok) {
        showToast(`Exchange request for "${bookTitle}" marked as ${newStatus}!`, 'success');
        fetchRequests();
        refreshRequestsCount();
      } else {
        showToast('Error updating request status', 'error');
      }
    } catch (e) {
      showToast('Network error while updating request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'received') return r.owner_student_id === currentStudent.student_id;
    if (activeTab === 'sent') return r.requester_student_id === currentStudent.student_id;
    if (activeTab === 'completed') return r.status === 'completed';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2357A5] mb-2">
          <Repeat className="h-3.5 w-3.5" />
          <span>Stage 04 • Exchange Management</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#162220]">
          My Book Exchanges & Requests
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5F736C]">
          Manage incoming requests for your listed books and track requests you've sent to classmates. All exchanges are conducted under school library or teacher supervision.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'all', label: 'All Exchanges' },
          { id: 'received', label: 'Received (For My Books)' },
          { id: 'sent', label: 'Sent (My Requests)' },
          { id: 'completed', label: 'Completed Exchanges' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#147D64] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Exchange Cards List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-[#147D64] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading exchange transactions...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-card">
          <Inbox className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="font-display text-base font-bold text-gray-800">No Exchange Records in This Category</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            You don't have any requests matching this tab yet. Explore the Marketplace to request a book or use the AI Scanner to list one!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isOwner = req.owner_student_id === currentStudent.student_id;
            const isRequester = req.requester_student_id === currentStudent.student_id;
            const isPending = req.status === 'pending';
            const isAccepted = req.status === 'accepted';
            const isCompleted = req.status === 'completed';

            return (
              <div
                key={req.id}
                className="rounded-2xl bg-white p-5 sm:p-6 border border-[#E2E8E5] shadow-card transition-all hover:border-gray-300"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Left: Book & Exchange Details */}
                  <div className="flex items-start gap-4">
                    <img 
                      src={req.book_cover || "/images/class7_science_cover.jpg"}
                      alt={req.book_title}
                      className="h-20 w-16 shrink-0 rounded-xl object-cover shadow-2xs"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/class7_science_cover.jpg";
                      }}
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                          {req.book_class} • {req.book_subject}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400">
                          {isOwner ? 'Incoming Request for your book' : 'You requested this book'}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-bold text-[#162220]">
                        {req.book_title}
                      </h3>

                      {/* Requester / Owner Info */}
                      <p className="mt-1 text-xs text-gray-600">
                        {isOwner ? (
                          <>Requested by: <strong className="text-gray-900">{req.requester_name}</strong> ({req.requester_grade})</>
                        ) : (
                          <>Owner: <strong className="text-gray-900">{req.book_owner_name}</strong></>
                        )}
                      </p>

                      {/* Message */}
                      {req.message && (
                        <div className="mt-2 rounded-xl bg-[#F5F7F4] p-2.5 text-xs text-[#5F736C]">
                          <strong>Message:</strong> "{req.message}"
                        </div>
                      )}

                      {/* Handover Details */}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <School className="h-3.5 w-3.5 text-[#147D64]" />
                          <span>Handover: <strong>{req.proposed_handover}</strong></span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#2357A5]" />
                          <span>Supervision: {req.parent_teacher_contact_note || 'School Librarian / Teacher'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Owner Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    
                    {/* Owner can Accept or Decline when pending */}
                    {isOwner && isPending && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          disabled={actionLoadingId === req.id}
                          onClick={() => handleUpdateStatus(req.id, 'accepted', req.book_title)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#147D64] px-4 py-2 text-xs font-bold text-white hover:bg-[#0E5B48]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Accept Request</span>
                        </button>

                        <button
                          disabled={actionLoadingId === req.id}
                          onClick={() => handleUpdateStatus(req.id, 'declined', req.book_title)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}

                    {/* When Accepted, Owner can Mark as Completed after library handover */}
                    {isOwner && isAccepted && (
                      <button
                        disabled={actionLoadingId === req.id}
                        onClick={() => handleUpdateStatus(req.id, 'completed', req.book_title)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Confirm Handover Completed</span>
                      </button>
                    )}

                    {/* Requester status indicators */}
                    {isRequester && (
                      <div className="text-center sm:text-right text-xs">
                        {isPending && (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Waiting for {req.book_owner_name}'s confirmation</span>
                          </span>
                        )}
                        {isAccepted && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Request Accepted! Meet at {req.proposed_handover}</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-gray-500 font-semibold">
                            ✓ Handover completed and verified
                          </span>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Safety Protocol Banner */}
      <SafetyBanner />

    </div>
  );
}
