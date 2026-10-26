import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import BookCard from '../components/BookCard';
import BookDetailModal from '../components/BookDetailModal';
import RequestModal from '../components/RequestModal';
import { 
  Search, 
  Scan, 
  PlusCircle, 
  Repeat, 
  BookOpen, 
  Sparkles, 
  Bell, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function DashboardPage() {
  const { currentStudent, setCurrentPage, pendingRequestsCount } = useStudent();
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [recentExchanges, setRecentExchanges] = useState([]);
  const [myListingsCount, setMyListingsCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestBook, setRequestBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Recommended books (Class 7 focus)
      const booksRes = await fetch('/api/books?class_level=Class 7');
      if (booksRes.ok) {
        const data = await booksRes.json();
        setRecommendedBooks(data.slice(0, 4));
      }

      // 2. My listings
      const myBooksRes = await fetch(`/api/books?owner_student_id=${currentStudent.student_id}`);
      if (myBooksRes.ok) {
        const myData = await myBooksRes.json();
        setMyListingsCount(myData.length);
      }

      // 3. Saved books
      const savedRes = await fetch(`/api/saved-books?student_id=${currentStudent.student_id}`);
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedCount(savedData.length);
      }

      // 4. Recent exchange requests / activity
      const reqRes = await fetch('/api/requests');
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRecentExchanges(reqData.slice(0, 4));
      }
    } catch (e) {
      console.error("Dashboard data load error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentStudent]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to marketplace with search query
      setCurrentPage('marketplace');
    }
  };

  return (
    <div className="space-y-10 py-4">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#147D64] via-[#0E5B48] to-[#2357A5] p-6 sm:p-8 text-white shadow-card">
        {/* Subtle realistic photo texture backdrop */}
        <div className="absolute inset-0 opacity-12 mix-blend-overlay pointer-events-none">
          <img src="/images/hero_students_exchange.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white mb-3">
              <span className="h-2 w-2 rounded-full bg-[#F2B544]" />
              <span>{currentStudent.role_badge}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentStudent.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-xl">
              Grade: <strong>{currentStudent.grade}</strong> • Student ID: <strong>{currentStudent.student_id}</strong>
              <br />
              {currentStudent.role_description}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 px-4 text-center border border-white/15">
              <span className="block text-xl font-black">{myListingsCount}</span>
              <span className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold">Your Books</span>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 px-4 text-center border border-white/15">
              <span className="block text-xl font-black">{pendingRequestsCount}</span>
              <span className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold">Pending Requests</span>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 px-4 text-center border border-white/15">
              <span className="block text-xl font-black">{savedCount}</span>
              <span className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold">Wishlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Search Bar Container */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-[#E2E8E5] shadow-card">
          <h3 className="font-display text-base font-bold text-[#162220] mb-2">
            Search Campus Resources
          </h3>
          <p className="text-xs text-[#5F736C] mb-4">
            Search by textbook title, syllabus topic, class level, or subject.
          </p>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Science Class 7, NCERT Mathematics, History, Honeycomb..."
              className="w-full rounded-2xl border border-gray-200 bg-[#F5F7F4] py-3.5 pl-11 pr-24 text-xs font-medium focus:border-[#147D64] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#147D64]"
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-2 rounded-xl bg-[#147D64] px-4 py-2 text-xs font-bold text-white hover:bg-[#0E5B48]"
            >
              Search
            </button>
          </form>

          {/* Quick Filter chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-bold text-gray-400">Popular:</span>
            {['Class 7 Science', 'Class 7 Math', 'Social Science', 'English', 'NCERT'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  setCurrentPage('marketplace');
                }}
                className="rounded-lg bg-gray-100 px-2.5 py-1 font-semibold text-gray-600 hover:bg-[#E9F5F1] hover:text-[#147D64]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Quick Actions */}
        <div className="rounded-2xl bg-white p-6 border border-[#E2E8E5] shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-[#162220] mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setCurrentPage('scanner')}
                className="flex flex-col items-center justify-center rounded-xl bg-[#E9F5F1] p-3 text-center transition-all hover:bg-[#147D64] hover:text-white group"
              >
                <Scan className="h-5 w-5 text-[#147D64] group-hover:text-white mb-1.5" />
                <span className="text-xs font-bold">Scan Book</span>
              </button>

              <button
                onClick={() => setCurrentPage('matching')}
                className="flex flex-col items-center justify-center rounded-xl bg-[#EEF4FC] p-3 text-center transition-all hover:bg-[#2357A5] hover:text-white group"
              >
                <Sparkles className="h-5 w-5 text-[#2357A5] group-hover:text-white mb-1.5" />
                <span className="text-xs font-bold">Smart Match</span>
              </button>

              <button
                onClick={() => setCurrentPage('share')}
                className="flex flex-col items-center justify-center rounded-xl bg-[#FEF7E8] p-3 text-center transition-all hover:bg-[#F2B544] hover:text-[#162220] group"
              >
                <PlusCircle className="h-5 w-5 text-[#C99126] group-hover:text-[#162220] mb-1.5" />
                <span className="text-xs font-bold">Share / Donate</span>
              </button>

              <button
                onClick={() => setCurrentPage('exchanges')}
                className="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-3 text-center transition-all hover:bg-gray-800 hover:text-white group relative"
              >
                <Repeat className="h-5 w-5 text-gray-700 group-hover:text-white mb-1.5" />
                <span className="text-xs font-bold">My Exchanges</span>
                {pendingRequestsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F2B544] text-[9px] font-extrabold text-[#162220]">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Handover safety verified</span>
            <ShieldCheck className="h-4 w-4 text-[#147D64]" />
          </div>
        </div>

      </div>

      {/* Recommended Books Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#147D64]">
              Personalized Recommendations
            </span>
            <h2 className="font-display text-xl font-bold text-[#162220]">
              Recommended for {currentStudent.grade}
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('marketplace')}
            className="flex items-center gap-1 text-xs font-bold text-[#147D64] hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpenDetails={(b) => setSelectedBook(b)}
              onOpenRequest={(b) => setRequestBook(b)}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="rounded-2xl bg-white p-6 border border-[#E2E8E5] shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#147D64]" />
            <h3 className="font-display text-base font-bold text-[#162220]">
              Recent Campus Sharing Activity
            </h3>
          </div>
          <button
            onClick={() => setCurrentPage('exchanges')}
            className="text-xs font-bold text-[#2357A5] hover:underline"
          >
            Manage Your Requests →
          </button>
        </div>

        <div className="space-y-3">
          {recentExchanges.map((req) => (
            <div
              key={req.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#F5F7F4]/60 p-3.5 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-xs ${
                  req.status === 'completed' ? 'bg-emerald-600' : req.status === 'accepted' ? 'bg-blue-600' : 'bg-amber-500'
                }`}>
                  {req.status === 'completed' ? '✓' : req.status === 'accepted' ? '★' : '•'}
                </div>
                <div>
                  <p className="font-bold text-[#162220]">
                    {req.requester_name} ({req.requester_grade}) requested <span className="text-[#147D64]">"{req.book_title}"</span>
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Handover at: {req.proposed_handover || 'School Central Library'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  req.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {req.status}
                </span>
                <span className="text-[10px] text-gray-400">
                  {req.created_at ? req.created_at.slice(0, 10) : 'Recent'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onRequest={(b) => setRequestBook(b)}
        />
      )}

      {requestBook && (
        <RequestModal
          book={requestBook}
          onClose={() => setRequestBook(null)}
          onSuccess={() => loadDashboardData()}
        />
      )}

    </div>
  );
}
