import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Star, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Check, 
  AlertCircle,
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceListing, ServiceBooking } from '../types';

export const ServicesPage: React.FC = () => {
  const { 
    services, 
    serviceBookings, 
    addService, 
    bookService, 
    updateBookingStatus, 
    addServiceReview, 
    currentUser 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(1000);
  const [activeTab, setActiveTab] = useState<'browse' | 'my_bookings' | 'my_services'>('browse');

  // Modals
  const [bookingService, setBookingService] = useState<ServiceListing | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-29');
  const [bookingTime, setBookingTime] = useState('6:00 PM - 7:00 PM');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Create Service Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ServiceListing['category']>('Programming Mentorship');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState<number>(300);
  const [newDuration, setNewDuration] = useState('45 mins');
  const [newAvailability, setNewAvailability] = useState('Weekdays 6 PM - 9 PM');
  const [newMode, setNewMode] = useState<'Online' | 'In-Person' | 'Flexible'>('Online');

  // Review Modal
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  const categories = [
    'All',
    'Programming Mentorship',
    'UI/UX & Graphic Design',
    'Resume & Interview Prep',
    'Academic Concept Tutoring',
    'Project Guidance',
    'Presentation & Pitch Deck'
  ];

  const filteredServices = services.filter((srv) => {
    const matchesSearch = srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesBudget = srv.price <= maxBudget;

    return matchesSearch && matchesCategory && matchesBudget;
  });

  const myBookings = serviceBookings.filter(b => b.clientId === currentUser.id || b.providerId === currentUser.id);

  const handleCreateServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addService({
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim() || 'Hands-on student mentorship session.',
      price: Number(newPrice),
      duration: newDuration,
      deliveryMode: newMode,
      availability: newAvailability
    });

    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleConfirmBooking = () => {
    if (!bookingService) return;
    bookService(bookingService.id, bookingDate, bookingTime, bookingNotes);
    setBookingSuccess(true);
  };

  const handleSubmitReview = () => {
    if (!reviewBookingId) return;
    addServiceReview(reviewBookingId, reviewRating, reviewComment);
    setReviewBookingId(null);
    setReviewComment('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Student Talent & Skills
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Empowering Student Micro-Entrepreneurship
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 tracking-tight mt-1">
            Student Services Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Book peer code reviews, UI/UX portfolio critiques, and conceptual tutoring from verified students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-3 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Offer a Service</span>
          </button>
        </div>
      </div>

      {/* Academic Dishonesty Warning Banner */}
      <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Strict Academic Honesty Commitment</p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            CampusLoop enforces strict ethics. Services must be educational and mentorship-based only. Completing homework, writing graded code, or taking tests on behalf of others is strictly forbidden and results in immediate account suspension.
          </p>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab('browse')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'browse' ? 'text-forest-800 border-b-2 border-forest-800' : 'hover:text-slate-800'
          }`}
        >
          Browse All Services ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('my_bookings')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'my_bookings' ? 'text-forest-800 border-b-2 border-forest-800' : 'hover:text-slate-800'
          }`}
        >
          My Service Bookings ({myBookings.length})
        </button>
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services by mentor name, skill, or keyword..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Max Price: ₹{maxBudget}</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-28 accent-forest-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((srv) => {
              const isOwner = currentUser.id === srv.providerId;

              return (
                <div
                  key={srv.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Provider info */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={srv.providerAvatar} 
                          alt={srv.providerName} 
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-forest-500/20"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-900">{srv.providerName}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="text-[10px] text-slate-400 block -mt-0.5">{srv.providerCollege}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 text-amber-800 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{srv.providerRating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({srv.reviewCount})</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {srv.category}
                    </span>

                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-forest-800 transition-colors mt-2">
                      {srv.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {srv.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {srv.availability}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-charcoal-950">
                        {srv.price === 0 ? 'Free Student Support' : `₹${srv.price}`}
                      </span>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">
                        {srv.price === 0 ? 'Mentorship session' : 'per scheduled session'}
                      </span>
                    </div>

                    {!isOwner ? (
                      <button
                        onClick={() => {
                          setBookingService(srv);
                          setBookingSuccess(false);
                        }}
                        className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        Request Session
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Your Service</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'my_bookings' && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Service Bookings Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Book a session or receive client requests to see them here.</p>
            </div>
          ) : (
            myBookings.map((b) => (
              <div 
                key={b.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'accepted' ? 'bg-teal-100 text-teal-800' :
                      b.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Date: {b.scheduledDate} • {b.timeSlot}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{b.serviceTitle}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Client: <strong>{b.clientName}</strong> • Provider: <strong>{b.providerName}</strong> • Price: <strong>₹{b.price}</strong>
                  </p>
                  {b.notes && (
                    <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg">
                      “{b.notes}”
                    </p>
                  )}
                  {b.review && (
                    <div className="mt-2 text-xs bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-900">★ {b.review.rating} Review:</span> “{b.review.comment}”
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {currentUser.id === b.providerId && b.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(b.id, 'accepted')}
                        className="px-3 py-1.5 bg-forest-800 text-white rounded-lg text-xs font-bold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b.id, 'declined')}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {b.status === 'accepted' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      Mark Completed
                    </button>
                  )}

                  {b.status === 'completed' && !b.review && currentUser.id === b.clientId && (
                    <button
                      onClick={() => setReviewBookingId(b.id)}
                      className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm"
                    >
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Request Mentorship Booking</h3>
              <button onClick={() => setBookingService(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Session Request Sent!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {bookingService.providerName} has been notified and will review your preferred time slot ({bookingDate}, {bookingTime}).
                </p>
                <button
                  onClick={() => {
                    setBookingService(null);
                    setActiveTab('my_bookings');
                  }}
                  className="px-5 py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold"
                >
                  View in My Bookings
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800">{bookingService.title}</h4>
                  <p className="text-[11px] text-slate-500">Mentor: {bookingService.providerName} • Price: ₹{bookingService.price}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Window</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30 bg-white"
                  >
                    <option>5:00 PM - 6:00 PM</option>
                    <option>6:00 PM - 7:00 PM</option>
                    <option>7:00 PM - 8:00 PM</option>
                    <option>Weekend Morning (10 AM - 11 AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">What would you like help with?</label>
                  <textarea
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. Need feedback on Figma component structure and auto-layout before our hackathon demo..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                  />
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  Send Booking Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leave Review Modal */}
      {reviewBookingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Leave Mentorship Review</h3>
              <button onClick={() => setReviewBookingId(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${s <= reviewRating ? 'fill-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Comment</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share constructive feedback on how helpful this student mentorship session was..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                />
              </div>

              <button
                onClick={handleSubmitReview}
                className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Submit Verified Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Service Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Offer a Student Service</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateServiceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. React & TypeScript Architecture Mentorship"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30 bg-white"
                  >
                    <option value="Programming Mentorship">Programming Mentorship</option>
                    <option value="UI/UX & Graphic Design">UI/UX & Graphic Design</option>
                    <option value="Resume & Interview Prep">Resume & Interview Prep</option>
                    <option value="Academic Concept Tutoring">Academic Concept Tutoring</option>
                    <option value="Project Guidance">Project Guidance</option>
                    <option value="Presentation & Pitch Deck">Presentation & Pitch Deck</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Session Price (₹0 for Free Support)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 45 mins"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30 bg-white"
                  >
                    <option value="Online">Online Video Call</option>
                    <option value="In-Person">In-Person Campus Meetup</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Availability Window</label>
                <input
                  type="text"
                  value={newAvailability}
                  onChange={(e) => setNewAvailability(e.target.value)}
                  placeholder="e.g. Tue & Thu 6-8 PM, Weekends"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & What Students Learn</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain what topics or projects you will guide the student through..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Publish Service Listing
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
