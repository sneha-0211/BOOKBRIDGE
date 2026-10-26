import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export const DEMO_PROFILES = [
  {
    student_id: 'STU-701',
    name: 'Harshit',
    grade: 'Class 7th',
    avatar_bg: '#147D64',
    role_badge: 'Listing Contributor',
    role_description: 'Has unused Class 7 Science textbook to share'
  },
  {
    student_id: 'STU-702',
    name: 'Diya Patel',
    grade: 'Class 7-A',
    avatar_bg: '#2357A5',
    role_badge: 'Book Seeker',
    role_description: 'Needs Class 7 Science book for Term 1 projects'
  },
  {
    student_id: 'STU-703',
    name: 'Priya Nair',
    grade: 'Class 7-B',
    avatar_bg: '#F2B544',
    role_badge: 'Peer Exchanger',
    role_description: 'Looking to exchange Class 7 Math for Class 8 books'
  },
  {
    student_id: 'STU-801',
    name: 'Rohan Gupta',
    grade: 'Class 8-C',
    avatar_bg: '#0E5B48',
    role_badge: 'Senior Donor',
    role_description: 'Donating previous year Class 7 History books'
  }
];

export function StudentProvider({ children }) {
  const [currentStudent, setCurrentStudent] = useState(DEMO_PROFILES[0]);
  const [currentPage, setCurrentPage] = useState('landing');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [scannerPreFill, setScannerPreFill] = useState(null);

  // Load pending requests count for current student
  const refreshRequestsCount = async () => {
    try {
      const res = await fetch(`/api/requests?student_id=${currentStudent.student_id}&role=received`);
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter(r => r.status === 'pending');
        setPendingRequestsCount(pending.length);
      }
    } catch (e) {
      console.error("Could not fetch requests count", e);
    }
  };

  useEffect(() => {
    refreshRequestsCount();
  }, [currentStudent]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const resetDemoDatabase = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        showToast("Demo database successfully reset to clean Class 7 competition state!", 'success');
        refreshRequestsCount();
      }
    } catch (e) {
      showToast("Error resetting database", 'error');
    }
  };

  return (
    <StudentContext.Provider value={{
      currentStudent,
      setCurrentStudent,
      currentPage,
      setCurrentPage,
      pendingRequestsCount,
      refreshRequestsCount,
      showToast,
      resetDemoDatabase,
      scannerPreFill,
      setScannerPreFill
    }}>
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-3.5 shadow-xl transition-all animate-bounce-subtle">
          <div className={`h-3 w-3 rounded-full ${toastMessage.type === 'error' ? 'bg-red-500' : 'bg-[#147D64]'}`} />
          <p className="text-sm font-semibold text-[#162220]">{toastMessage.message}</p>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-xs font-bold text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}
    </StudentContext.Provider>
  );
}

export const useStudent = () => useContext(StudentContext);
