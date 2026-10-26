import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import BookCard from '../components/BookCard';
import BookDetailModal from '../components/BookDetailModal';
import RequestModal from '../components/RequestModal';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  BookOpen, 
  Sparkles, 
  Layers,
  Inbox
} from 'lucide-react';

export default function MarketplacePage() {
  const { currentStudent } = useStudent();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestBook, setRequestBook] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append('query', query.trim());
      if (classFilter !== 'All') params.append('class_level', classFilter);
      if (subjectFilter !== 'All') params.append('subject', subjectFilter);
      if (conditionFilter !== 'All') params.append('condition', conditionFilter);
      if (typeFilter !== 'All') params.append('listing_type', typeFilter);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      params.append('viewer_student_id', currentStudent.student_id);

      const res = await fetch(`/api/books?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (e) {
      console.error("Marketplace fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [classFilter, subjectFilter, conditionFilter, typeFilter, statusFilter, currentStudent]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleResetFilters = () => {
    setQuery('');
    setClassFilter('All');
    setSubjectFilter('All');
    setConditionFilter('All');
    setTypeFilter('All');
    setStatusFilter('All');
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2357A5] mb-2">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Campus Resource Catalog</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#162220]">
            Book Marketplace
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5F736C]">
            Explore pre-owned school textbooks donated or listed for exchange by your school peers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-[#E9F5F1] px-3 py-1.5 text-xs font-bold text-[#147D64]">
            {books.length} Books Found
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-white p-5 border border-[#E2E8E5] shadow-card space-y-4">
        
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, subject, topics (e.g. Science, Mathematics, Integers)..."
            className="w-full rounded-xl border border-gray-200 bg-[#F5F7F4] py-3 pl-10 pr-24 text-xs font-medium focus:border-[#147D64] focus:bg-white focus:outline-none"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1.5 rounded-lg bg-[#147D64] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#0E5B48]"
          >
            Filter
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          
          {/* Class Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Class Level</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-[#147D64] focus:outline-none"
            >
              <option value="All">All Classes</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-[#147D64] focus:outline-none"
            >
              <option value="All">All Subjects</option>
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Social Science">Social Science</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Condition</label>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-[#147D64] focus:outline-none"
            >
              <option value="All">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sharing Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-[#147D64] focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Free Donation">Free Donation</option>
              <option value="Exchange">Exchange</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Availability</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-[#147D64] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="available">Available Now</option>
              <option value="requested">Pending Request</option>
              <option value="exchanged">Exchanged</option>
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 p-2 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>

      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-[#147D64] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading campus book listings...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-card">
          <Inbox className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="font-display text-base font-bold text-gray-800">No Books Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            No listings matched your active filter criteria. Try clearing some filters or be the first to list this book!
          </p>
          <button
            onClick={handleResetFilters}
            className="rounded-xl bg-[#147D64] px-4 py-2 text-xs font-bold text-white hover:bg-[#0E5B48]"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpenDetails={(b) => setSelectedBook(b)}
              onOpenRequest={(b) => setRequestBook(b)}
            />
          ))}
        </div>
      )}

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
          onSuccess={() => fetchBooks()}
        />
      )}

    </div>
  );
}
