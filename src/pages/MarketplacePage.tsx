import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  X, 
  AlertCircle, 
  Trash2, 
  CreditCard, 
  Check, 
  Sparkles,
  BookOpen,
  Info,
  ShieldCheck,
  Building2,
  Lock,
  Tag,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookListing, ItemCondition } from '../types';

export const MarketplacePage: React.FC = () => {
  const { 
    listings, 
    favourites, 
    toggleFavourite, 
    addBook, 
    deleteListing, 
    completePurchase, 
    currentUser,
    commissionRate 
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<BookListing | null>(null);
  const [checkoutBook, setCheckoutBook] = useState<BookListing | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Simulated Campus UPI');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccessTx, setCheckoutSuccessTx] = useState<any | null>(null);

  // Form State for Sell a Book
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formSubject, setFormSubject] = useState('Computer Science & IT');
  const [formCourse, setFormCourse] = useState('');
  const [formPrice, setFormPrice] = useState<string>('500');
  const [formOriginalPrice, setFormOriginalPrice] = useState<string>('1200');
  const [formCondition, setFormCondition] = useState<ItemCondition>('Like New');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  const subjects = [
    'All',
    'Computer Science & IT',
    'Electronics & Communication',
    'Mechanical & Civil',
    'Design & Architecture',
    'Mathematics & Sciences',
    'Business & Management',
    'Competitive Exams'
  ];

  // Filtered & Sorted books
  const filteredBooks = listings.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.sellerCollege.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'All' || book.category === selectedSubject;
    const matchesCondition = selectedCondition === 'all' || book.condition === selectedCondition;

    return matchesSearch && matchesSubject && matchesCondition;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
  });

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAuthor.trim()) {
      setFormError('Please enter both book title and author.');
      return;
    }

    const priceNum = parseFloat(formPrice);
    const origNum = parseFloat(formOriginalPrice);

    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Please enter a valid price in rupees.');
      return;
    }

    addBook({
      title: formTitle.trim(),
      author: formAuthor.trim(),
      subject: formSubject,
      course: formCourse.trim() || undefined,
      category: formSubject as any,
      price: priceNum,
      originalReferencePrice: isNaN(origNum) ? priceNum * 2 : origNum,
      condition: formCondition,
      listingType: 'sell',
      description: formDescription.trim() || 'Verified student textbook in great condition.',
      images: [
        formImageUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
      ],
      tags: [formSubject, 'Textbook']
    });

    // Reset Form
    setFormTitle('');
    setFormAuthor('');
    setFormCourse('');
    setFormPrice('500');
    setFormOriginalPrice('1200');
    setFormDescription('');
    setFormImageUrl('');
    setFormError('');
    setIsSellModalOpen(false);
  };

  const handleExecuteCheckout = () => {
    if (!checkoutBook) return;
    setIsProcessingCheckout(true);

    setTimeout(() => {
      const result = completePurchase(checkoutBook.id, paymentMethod);
      setIsProcessingCheckout(false);
      if (result.success) {
        setCheckoutSuccessTx(result.transaction);
      }
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Second-Hand Book Exchange
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Commission Rate: {(commissionRate * 100).toFixed(0)}%
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Book Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Buy affordable second-hand textbooks from students or sell books you no longer need.
          </p>
        </div>

        {/* Sell a Book Button */}
        <button
          onClick={() => { setIsSellModalOpen(true); setFormError(''); }}
          className="px-5 py-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start md:self-auto group"
        >
          <Plus className="w-4 h-4" />
          <span>Sell a Book</span>
        </button>
      </div>

      {/* Marketplace & Credit Bonus Notice */}
      <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-950">
        <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-extrabold flex items-center gap-2">
            <span>Fair Student Book Trades</span>
            <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-black px-2 py-0.5 rounded-full">
              +2 Bonus Credits
            </span>
          </p>
          <p className="text-[11px] text-emerald-900/90 leading-relaxed">
            Transparent flat 2% platform fee on sales. Both the buyer and seller earn <strong>+2 learning credits</strong> on every completed book transaction!
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search books by title, author, subject, or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Condition: All</option>
              <option value="New">Condition: New</option>
              <option value="Like New">Condition: Like New</option>
              <option value="Good">Condition: Good</option>
              <option value="Fair">Condition: Fair</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubject === subj
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Books Match Your Criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or clearing subject filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedSubject('All'); setSelectedCondition('all'); }}
            className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isFavourited = favourites.includes(book.id);
            const isMine = book.sellerId === currentUser.id;
            const isSold = book.status === 'sold';

            return (
              <div 
                key={book.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                {/* Book Image & Badges */}
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img 
                      src={book.images[0]} 
                      alt={book.title} 
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        isSold ? 'grayscale opacity-75' : 'group-hover:scale-105'
                      }`}
                    />

                    {/* Condition badge */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                      {book.condition}
                    </span>

                    {/* Sold overlay */}
                    {isSold && (
                      <span className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center text-white font-black text-sm uppercase tracking-wider">
                        Sold Out
                      </span>
                    )}

                    {/* Favourite button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavourite(book.id); }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 shadow-sm transition-all"
                    >
                      <Heart className={`w-4 h-4 ${isFavourited ? 'text-rose-600 fill-rose-600' : ''}`} />
                    </button>
                  </div>

                  {/* Book Info */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                      {book.category}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className="text-xs text-slate-500 font-medium">By {book.author}</p>
                    )}
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {book.description}
                    </p>
                  </div>

                  {/* Seller info pill */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <img 
                      src={book.sellerAvatar} 
                      alt={book.sellerName} 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="truncate">{book.sellerName} ({book.sellerCollege})</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-900">₹{book.price}</span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{book.originalReferencePrice}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold block -mt-0.5">
                      Save ₹{Math.max(0, book.originalReferencePrice - book.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isMine ? (
                      <button
                        onClick={() => deleteListing(book.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : isSold ? (
                      <button
                        disabled
                        className="px-3 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed"
                      >
                        Sold
                      </button>
                    ) : (
                      <button
                        onClick={() => setCheckoutBook(book)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* SELL A BOOK MODAL */}
      {/* ============================================================ */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Sell a Second-Hand Book</h3>
                <p className="text-xs text-slate-500">List educational textbooks for student reuse.</p>
              </div>
              <button 
                onClick={() => setIsSellModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSellSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Book Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Core Java: Fundamentals (11th Edition)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Author / Publisher *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cay S. Horstmann"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Course / Semester</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech CS 3rd Sem"
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Subject Category</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {subjects.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Book Condition</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="New">New (Unopened)</option>
                    <option value="Like New">Like New (Clean pages)</option>
                    <option value="Good">Good (Minor pencil notes)</option>
                    <option value="Fair">Fair (Readable, worn cover)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Original Retail Price (₹)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Commission Preview */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Selling Price:</span>
                  <span className="font-bold text-slate-900">₹{parseFloat(formPrice) || 0}</span>
                </div>
                <div className="flex justify-between text-indigo-700">
                  <span>Platform Commission (2%):</span>
                  <span className="font-bold">₹{Math.round((parseFloat(formPrice) || 0) * 0.02)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold border-t border-slate-200 pt-1">
                  <span>Your Net Payout:</span>
                  <span>₹{(parseFloat(formPrice) || 0) - Math.round((parseFloat(formPrice) || 0) * 0.02)}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Description & Notes</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mention markings, highlighting, included CDs/keys..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                List Book in Marketplace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SIMULATED BOOK CHECKOUT MODAL (WITH TRANSPARENT 2% COMMISSION) */}
      {/* ============================================================ */}
      {checkoutBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Simulated Book Purchase</h3>
                <p className="text-xs text-slate-500">Transparent campus escrow checkout.</p>
              </div>
              <button 
                onClick={() => { setCheckoutBook(null); setCheckoutSuccessTx(null); }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccessTx ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Purchase Completed!</h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span>Book:</span>
                    <strong className="text-slate-900 truncate max-w-[200px]">{checkoutSuccessTx.listingTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Price:</span>
                    <strong>₹{checkoutSuccessTx.price}</strong>
                  </div>
                  <div className="flex justify-between text-indigo-700">
                    <span>2% Platform Fee:</span>
                    <strong>₹{checkoutSuccessTx.platformCommission}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Seller Payout:</span>
                    <strong>₹{checkoutSuccessTx.sellerPayout}</strong>
                  </div>
                </div>

                {/* +2 Credits Added Confirmation */}
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>+2 Learning Credits added to your wallet!</span>
                </div>

                <button
                  onClick={() => { setCheckoutBook(null); setCheckoutSuccessTx(null); }}
                  className="w-full py-3 bg-purple-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : isProcessingCheckout ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">Processing Book Escrow Payment...</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Book Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img 
                    src={checkoutBook.images[0]} 
                    alt={checkoutBook.title} 
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 line-clamp-1">{checkoutBook.title}</h4>
                    <p className="text-[11px] text-slate-500">Seller: {checkoutBook.sellerName}</p>
                    <p className="text-sm font-black text-slate-900">₹{checkoutBook.price}</p>
                  </div>
                </div>

                {/* Community Credit Reward Banner */}
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Transaction Bonus:</span>
                  </span>
                  <span className="font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                    +2 Credits for Both Buyer & Seller!
                  </span>
                </div>

                {/* Transparent Commission Breakdown */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
                    Transparent Price Breakdown
                  </span>
                  <div className="flex justify-between text-slate-700">
                    <span>Book Price:</span>
                    <span className="font-bold">₹{checkoutBook.price}</span>
                  </div>
                  <div className="flex justify-between text-indigo-700">
                    <span>Platform Fee (2%):</span>
                    <span className="font-bold">₹{Math.round(checkoutBook.price * commissionRate)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 border-t border-purple-200 pt-1 font-semibold">
                    <span>Seller Receives:</span>
                    <span>₹{checkoutBook.price - Math.round(checkoutBook.price * commissionRate)}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Simulated Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
                  >
                    <option value="Simulated Campus UPI">Simulated Campus UPI (Instant Sandbox)</option>
                    <option value="Simulated RuPay Card">Simulated RuPay / Debit Card</option>
                    <option value="Cash on Campus Handover">Cash on Campus Handover</option>
                  </select>
                </div>

                <button
                  onClick={handleExecuteCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Confirm Simulated Payment (₹{checkoutBook.price})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
