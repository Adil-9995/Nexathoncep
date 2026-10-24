import React, { useState, useEffect } from 'react';
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
  Unlock,
  Tag,
  Coins,
  FileText,
  Download,
  Eye,
  Layers,
  BookMarked,
  PenTool,
  Clock,
  AlertTriangle,
  RotateCcw,
  User,
  DollarSign,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookListing, ItemCondition, TransactionRecord } from '../types';
import { WritingGigsPage } from './WritingGigsPage';

interface MarketplacePageProps {
  initialTab?: 'books' | 'writing' | 'escrow';
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ initialTab = 'books' }) => {
  const { 
    listings, 
    favourites, 
    toggleFavourite, 
    addBook, 
    deleteListing, 
    completePurchase, 
    releaseBookEscrow,
    disputeBookEscrow,
    currentUser,
    commissionRate,
    transactions,
    writingGigs,
    writingOrders,
    approveAndCompleteWritingOrder
  } = useApp();

  // Top-level Marketplace tab: Books & Notes | Writing Gigs | Escrow Vault
  const [activeMarketplaceTab, setActiveMarketplaceTab] = useState<'books' | 'writing' | 'escrow'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveMarketplaceTab(initialTab);
    }
  }, [initialTab]);

  // Search & Filter State for Books
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'physical' | 'pdf'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<BookListing | null>(null);
  const [checkoutBook, setCheckoutBook] = useState<BookListing | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Simulated Campus UPI');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccessTx, setCheckoutSuccessTx] = useState<TransactionRecord | null>(null);

  // Escrow Vault State
  const [escrowFilter, setEscrowFilter] = useState<'all' | 'books' | 'writing'>('all');
  const [confirmReleaseTx, setConfirmReleaseTx] = useState<TransactionRecord | null>(null);
  const [disputeModalTx, setDisputeModalTx] = useState<TransactionRecord | null>(null);
  const [disputeReason, setDisputeReason] = useState('Missing or torn pages');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [isReleasingEscrow, setIsReleasingEscrow] = useState(false);

  // Form State for Sell a Book / Digital PDF Notes
  const [formItemFormat, setFormItemFormat] = useState<'physical' | 'pdf'>('physical');
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formSubject, setFormSubject] = useState('Computer Science & IT');
  const [formCourse, setFormCourse] = useState('');
  const [formPrice, setFormPrice] = useState<string>('500');
  const [formOriginalPrice, setFormOriginalPrice] = useState<string>('1200');
  const [formCondition, setFormCondition] = useState<ItemCondition>('Like New');
  const [formPdfPageCount, setFormPdfPageCount] = useState<string>('45');
  const [formPdfFileSize, setFormPdfFileSize] = useState<string>('12.5 MB');
  const [formPdfSampleUrl, setFormPdfSampleUrl] = useState<string>('');
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

  const physicalCount = listings.filter(b => b.itemFormat !== 'pdf').length;
  const pdfCount = listings.filter(b => b.itemFormat === 'pdf').length;

  // Active Escrow Counts & Calculations
  const activeBookEscrows = transactions.filter(t => 
    t.status === 'escrow_hold' || t.escrowStatus === 'held_in_escrow'
  );
  const myBookEscrows = transactions.filter(t => 
    (t.buyerId === currentUser.id || t.sellerId === currentUser.id) && 
    (t.itemFormat === 'physical' || t.escrowStatus || t.status === 'escrow_hold')
  );
  const myWritingOrders = writingOrders.filter(o => 
    o.requesterId === currentUser.id || o.writerId === currentUser.id
  );
  const activeWritingEscrows = myWritingOrders.filter(o => 
    o.status === 'advance_pending' || o.status === 'in_progress' || o.status === 'submitted_for_review'
  );
  const totalActiveEscrowCount = activeBookEscrows.length + activeWritingEscrows.length;
  const totalHeldEscrowFunds = activeBookEscrows.reduce((sum, t) => sum + t.price, 0) + 
    activeWritingEscrows.reduce((sum, o) => sum + (o.advanceAmount || 10), 0);

  // Filtered & Sorted books & PDF notes
  const filteredBooks = listings.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.sellerCollege.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'All' || book.category === selectedSubject;
    const matchesCondition = selectedCondition === 'all' || book.condition === selectedCondition;
    const matchesFormat = 
      selectedFormat === 'all' || 
      (selectedFormat === 'pdf' ? book.itemFormat === 'pdf' : book.itemFormat !== 'pdf');

    return matchesSearch && matchesSubject && matchesCondition && matchesFormat;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
  });

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAuthor.trim()) {
      setFormError('Please enter both title and author / contributor.');
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
      condition: formItemFormat === 'pdf' ? 'Like New' : formCondition,
      itemFormat: formItemFormat,
      pdfPageCount: formItemFormat === 'pdf' ? parseInt(formPdfPageCount, 10) || 45 : undefined,
      pdfFileSize: formItemFormat === 'pdf' ? formPdfFileSize.trim() || '10 MB' : undefined,
      pdfSampleUrl: formItemFormat === 'pdf' ? formPdfSampleUrl.trim() || undefined : undefined,
      listingType: 'sell',
      description: formDescription.trim() || (formItemFormat === 'pdf' ? 'High-quality curated handwritten student notes in PDF format.' : 'Verified student textbook in great condition with campus escrow protection.'),
      images: [
        formImageUrl.trim() || (
          formItemFormat === 'pdf'
            ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80'
        )
      ],
      tags: [formSubject, formItemFormat === 'pdf' ? 'PDF Notes' : 'Paperback', 'Verified Student']
    });

    setFormTitle('');
    setFormAuthor('');
    setFormCourse('');
    setFormPrice('500');
    setFormOriginalPrice('1200');
    setFormPdfPageCount('45');
    setFormPdfFileSize('12.5 MB');
    setFormPdfSampleUrl('');
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
      if (result.success && result.transaction) {
        setCheckoutSuccessTx(result.transaction);
      }
    }, 900);
  };

  const handleConfirmReleaseEscrow = () => {
    if (!confirmReleaseTx) return;
    setIsReleasingEscrow(true);
    setTimeout(() => {
      releaseBookEscrow(confirmReleaseTx.id);
      setIsReleasingEscrow(false);
      setConfirmReleaseTx(null);
    }, 700);
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeModalTx) return;
    const fullReason = `${disputeReason}${disputeNotes ? ` — ${disputeNotes}` : ''}`;
    disputeBookEscrow(disputeModalTx.id, fullReason);
    setDisputeModalTx(null);
    setDisputeNotes('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* ============================================================ */}
      {/* UNIFIED ACADEMIC MARKETPLACE & ESCROW HEADER */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
              Academic Exchange & Safe Escrow
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              <span>100% Escrow Protected</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Campus Fee: {(commissionRate * 100).toFixed(0)}%
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Book Marketplace & Writing Gigs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Buy & sell textbooks, download verified student notes, hire peer writers with ₹10 advance escrow, and track orders safely in the Campus Escrow Vault.
          </p>
        </div>

        {/* Action Button: Sell Book or Post Gig */}
        <div className="flex items-center gap-2">
          {activeMarketplaceTab === 'books' && (
            <button
              onClick={() => { setIsSellModalOpen(true); setFormError(''); }}
              className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Sell Book / Notes</span>
            </button>
          )}

          <button
            onClick={() => setActiveMarketplaceTab('escrow')}
            className={`px-3.5 py-2.5 sm:py-3 rounded-2xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMarketplaceTab === 'escrow'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
            title="View Campus Escrow Vault"
          >
            <ShieldCheck className={`w-4 h-4 ${activeMarketplaceTab === 'escrow' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Escrow Vault</span>
            {totalActiveEscrowCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black rounded-full text-[10px]">
                {totalActiveEscrowCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3 TOP-LEVEL MARKETPLACE TABS: BOOKS | WRITING GIGS | ESCROW */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 backdrop-blur-md rounded-2xl w-full sm:w-fit border border-slate-300/60 overflow-x-auto">
        <button
          onClick={() => setActiveMarketplaceTab('books')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeMarketplaceTab === 'books'
              ? 'bg-white text-purple-950 font-black shadow-sm ring-1 ring-black/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-700" />
          <span>Textbooks & PDF Notes</span>
          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded-md">
            {listings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMarketplaceTab('writing')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeMarketplaceTab === 'writing'
              ? 'bg-white text-purple-950 font-black shadow-sm ring-1 ring-black/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <PenTool className="w-4 h-4 text-purple-700" />
          <span>Writing Gigs</span>
          <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.5 rounded-md">
            ₹10 Escrow
          </span>
        </button>

        <button
          onClick={() => setActiveMarketplaceTab('escrow')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeMarketplaceTab === 'escrow'
              ? 'bg-white text-emerald-950 font-black shadow-sm ring-1 ring-black/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Escrow Vault & Orders</span>
          {totalActiveEscrowCount > 0 && (
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md animate-pulse">
              {totalActiveEscrowCount} Active
            </span>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: TEXTBOOKS & PDF NOTES (BOOK MARKETPLACE) */}
      {/* ============================================================ */}
      {activeMarketplaceTab === 'books' && (
        <div className="space-y-6 animate-in fade-in-50">
          
          {/* Marketplace & Credit Bonus Notice */}
          <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-950">
            <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-extrabold flex items-center gap-2">
                <span>Fair Campus Trades with 48-Hour Escrow Protection</span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-black px-2 py-0.5 rounded-full">
                  +2 Bonus Credits
                </span>
              </p>
              <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                When you buy physical textbooks, funds are held safely in <strong>Campus Escrow</strong>. Inspect the book condition on campus, then release payment. Both buyer and seller receive <strong>+2 learning credits</strong> upon delivery!
              </p>
            </div>
          </div>

          {/* Format Selector: Physical Textbooks vs Digital PDF Notes */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl w-fit">
              <button
                onClick={() => setSelectedFormat('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFormat === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Materials ({listings.length})
              </button>
              <button
                onClick={() => setSelectedFormat('physical')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFormat === 'physical'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Physical Books ({physicalCount})</span>
                <span className="text-[9px] bg-purple-800 text-purple-200 px-1 py-0.2 rounded font-normal">Escrow</span>
              </button>
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFormat === 'pdf'
                    ? 'bg-indigo-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Notes ({pdfCount})</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <strong>{filteredBooks.length}</strong> available listings
            </div>
          </div>

          {/* Subject Pills Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubject === subject
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Search, Condition & Sort Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by book title, author, syllabus keywords, or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer"
              >
                <option value="all">All Conditions</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <BookMarked className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-base text-slate-800">No books or notes matched your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader keywords, switching subject categories, or clearing condition filters.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedSubject('All'); setSelectedCondition('all'); setSelectedFormat('all'); }}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
                const isPdf = book.itemFormat === 'pdf';

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

                        {/* Format / Condition badge */}
                        {isPdf ? (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-indigo-950/90 text-cyan-300 border border-indigo-700/60 text-[10px] font-black flex items-center gap-1 backdrop-blur-md shadow-sm">
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span>PDF Notes</span>
                            {book.pdfPageCount && <span>• {book.pdfPageCount}p</span>}
                          </span>
                        ) : (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                            {book.condition}
                          </span>
                        )}

                        {/* Escrow Guarantee Pill for Physical Books */}
                        {!isPdf && (
                          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-950/85 text-[9px] text-emerald-300 font-bold backdrop-blur-md flex items-center gap-1 border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>48h Escrow Guarantee</span>
                          </span>
                        )}

                        {/* File Size Badge for PDF */}
                        {isPdf && book.pdfFileSize && (
                          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-[9px] text-cyan-200 font-mono backdrop-blur-md">
                            {book.pdfFileSize}
                          </span>
                        )}

                        {/* Sold overlay */}
                        {isSold && (
                          <span className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center text-white font-black text-sm uppercase tracking-wider">
                            Sold Out
                          </span>
                        )}

                        {/* Favourite button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavourite(book.id); }}
                          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 shadow-sm transition-all cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isFavourited ? 'text-rose-600 fill-rose-600' : ''}`} />
                        </button>
                      </div>

                      {/* Book Info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                            {book.category}
                          </span>
                          {isPdf && (
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                              Instant Digital Access
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                          {book.title}
                        </h3>
                        {book.author && (
                          <p className="text-xs text-slate-500 font-medium">By {book.author}</p>
                        )}
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {book.description}
                        </p>

                        {/* PDF Sample Preview Link if available */}
                        {isPdf && book.pdfSampleUrl && (
                          <a
                            href={book.pdfSampleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Sample Preview Pages</span>
                          </a>
                        )}
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
                            className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                            title="Remove my listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : isSold ? (
                          <span className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-100">
                            Unavailable
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedBookForDetails(book)}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => setCheckoutBook(book)}
                              className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-purple-900 hover:bg-purple-950 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{isPdf ? 'Get Notes' : 'Buy (Escrow)'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: STUDENT WRITING GIGS (INTEGRATED INSIDE MARKETPLACE) */}
      {/* ============================================================ */}
      {activeMarketplaceTab === 'writing' && (
        <div className="animate-in fade-in-50">
          <WritingGigsPage onNavigateToCredits={() => {}} />
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: CAMPUS ESCROW VAULT & ORDER TRACKER */}
      {/* ============================================================ */}
      {activeMarketplaceTab === 'escrow' && (
        <div className="space-y-6 animate-in fade-in-50">
          
          {/* Escrow Vault Hero Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Active Campus Protection</span>
                  </span>
                  <span className="text-xs text-purple-200/70 font-mono">
                    Smart Hold Algorithm
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Campus Escrow Vault & Order Tracker
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Zero scam risk. When buying physical textbooks or commissioning student writing gigs, payments stay locked in escrow until handover is inspected and approved.
                </p>
              </div>

              {/* Escrow Summary Metrics */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-0.5">
                  <span className="text-[10px] text-purple-200 font-bold block uppercase tracking-wider">Held In Escrow</span>
                  <p className="text-xl font-black text-amber-300">₹{totalHeldEscrowFunds}</p>
                  <span className="text-[10px] text-slate-300">{totalActiveEscrowCount} active holds</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-0.5">
                  <span className="text-[10px] text-purple-200 font-bold block uppercase tracking-wider">Protection Rate</span>
                  <p className="text-xl font-black text-emerald-400">100%</p>
                  <span className="text-[10px] text-slate-300">48h inspection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subfilter inside Escrow: All | Books | Writing */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEscrowFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                escrowFilter === 'all'
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Escrow Orders ({myBookEscrows.length + myWritingOrders.length})
            </button>
            <button
              onClick={() => setEscrowFilter('books')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                escrowFilter === 'books'
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Book Purchases ({myBookEscrows.length})
            </button>
            <button
              onClick={() => setEscrowFilter('writing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                escrowFilter === 'writing'
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Writing Gig Orders ({myWritingOrders.length})
            </button>
          </div>

          {/* SECTION A: PHYSICAL BOOK ESCROW ORDERS */}
          {(escrowFilter === 'all' || escrowFilter === 'books') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Physical Book Orders & Campus Inspection ({myBookEscrows.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-500">48-Hour Condition Guarantee</span>
              </div>

              {myBookEscrows.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <BookMarked className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No textbook escrow transactions yet</p>
                  <p className="text-[11px] text-slate-400">
                    When you purchase physical textbooks from student peers, they will appear here under 48-hour inspection hold.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myBookEscrows.map((tx) => {
                    const isBuyer = tx.buyerId === currentUser.id;
                    const isHeld = tx.status === 'escrow_hold' || tx.escrowStatus === 'held_in_escrow';
                    const isReleased = tx.status === 'completed' || tx.escrowStatus === 'released_to_seller';
                    const isDisputed = tx.status === 'disputed' || tx.escrowStatus === 'disputed';

                    return (
                      <div 
                        key={tx.id}
                        className={`p-5 rounded-3xl border transition-all space-y-4 bg-white shadow-xs ${
                          isHeld ? 'border-amber-300 ring-2 ring-amber-100' : 
                          isDisputed ? 'border-rose-300 bg-rose-50/20' : 
                          'border-slate-200'
                        }`}
                      >
                        {/* Status Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                              {isBuyer ? 'Your Book Purchase' : 'Your Book Sale'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">#{tx.id.slice(-6)}</span>
                          </div>

                          {isHeld && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Held In Escrow</span>
                            </span>
                          )}

                          {isReleased && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Escrow Released</span>
                            </span>
                          )}

                          {isDisputed && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-black flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-700" />
                              <span>Disputed / On Hold</span>
                            </span>
                          )}
                        </div>

                        {/* Book Title & Peers */}
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{tx.listingTitle}</h4>
                          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                            <span>Seller: <strong className="text-slate-800">{tx.sellerName}</strong></span>
                            <span>Buyer: <strong className="text-slate-800">{tx.buyerName}</strong></span>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                          <div className="flex justify-between text-slate-600">
                            <span>Total Payment:</span>
                            <strong className="text-slate-900">₹{tx.price}</strong>
                          </div>
                          <div className="flex justify-between text-purple-700">
                            <span>Campus Fee (2%):</span>
                            <span>₹{tx.platformCommission}</span>
                          </div>
                          <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1">
                            <span>Seller Net Payout:</span>
                            <span>₹{tx.sellerPayout}</span>
                          </div>
                        </div>

                        {/* Inspection Window or Dispute Reason */}
                        {isHeld && (
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block">48-Hour Inspection Active</strong>
                              <span>{tx.inspectionDeadline || 'Please inspect condition before releasing funds.'}</span>
                            </div>
                          </div>
                        )}

                        {isDisputed && tx.disputeReason && (
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-950 space-y-0.5">
                            <strong className="block text-rose-900">Dispute Report Filed:</strong>
                            <p>{tx.disputeReason}</p>
                            <span className="text-[10px] text-rose-700 font-semibold block pt-1">
                              Campus mediator assigned. Funds frozen securely.
                            </span>
                          </div>
                        )}

                        {/* Interactive Escrow Controls */}
                        {isHeld && (
                          <div className="pt-2 flex flex-col sm:flex-row gap-2">
                            {isBuyer ? (
                              <>
                                <button
                                  onClick={() => setConfirmReleaseTx(tx)}
                                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Verify & Release (₹{tx.sellerPayout})</span>
                                </button>
                                <button
                                  onClick={() => { setDisputeModalTx(tx); setDisputeNotes(''); }}
                                  className="py-2.5 px-3 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-rose-300 transition-all cursor-pointer"
                                >
                                  Raise Dispute
                                </button>
                              </>
                            ) : (
                              <div className="w-full text-center py-2 px-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold">
                                Waiting for {tx.buyerName} to inspect book or 48h auto-release.
                              </div>
                            )}
                          </div>
                        )}

                        {isReleased && (
                          <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 font-bold flex items-center justify-between">
                            <span>✅ Transaction Completed</span>
                            <span>+2 Credits Rewarded</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION B: STUDENT WRITING GIG ESCROW ORDERS */}
          {(escrowFilter === 'all' || escrowFilter === 'writing') && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-purple-700" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Student Writing Gigs Escrow ({myWritingOrders.length})
                  </h3>
                </div>
                <span className="text-xs text-purple-700 font-bold">₹10 Advance Escrow Protection</span>
              </div>

              {myWritingOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <PenTool className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No active writing orders</p>
                  <p className="text-[11px] text-slate-400">
                    Hire a peer for lab records or assignments to protect your deposit in escrow.
                  </p>
                  <button
                    onClick={() => setActiveMarketplaceTab('writing')}
                    className="mt-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Browse Writing Gigs
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myWritingOrders.map((order) => {
                    const isRequester = order.requesterId === currentUser.id;
                    return (
                      <div 
                        key={order.id}
                        className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                          <span className="font-mono text-purple-800 font-bold">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px]">
                            {order.category}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{order.title}</h4>
                          <p className="text-xs text-slate-500">
                            {isRequester ? `Writer: ${order.writerName}` : `Client: ${order.requesterName}`} • {order.pagesCount} Pages
                          </p>
                        </div>

                        {/* Escrow Breakdown for Writing */}
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Total Price:</span>
                            <span className="font-bold">₹{order.totalAmount}</span>
                          </div>
                          <div className="flex justify-between text-amber-900">
                            <span>Advance Locked in Escrow:</span>
                            <strong className="text-amber-800">₹{order.advanceAmount}</strong>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Remaining Due on Delivery:</span>
                            <span>₹{order.remainingAmount}</span>
                          </div>
                        </div>

                        {/* Status Message */}
                        <div className="text-xs">
                          {order.status === 'submitted_for_review' ? (
                            <div className="space-y-2">
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-bold text-[11px]">
                                ✍️ Work Submitted for Review
                              </span>
                              {isRequester && (
                                <button
                                  onClick={() => approveAndCompleteWritingOrder(order.id)}
                                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                                >
                                  Approve & Release Remaining (₹{order.remainingAmount})
                                </button>
                              )}
                            </div>
                          ) : order.status === 'completed' ? (
                            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-900 font-bold text-[11px] text-center">
                              ✅ Order Completed & Payout Released
                            </div>
                          ) : (
                            <div className="p-2 bg-slate-100 rounded-xl text-slate-600 text-[11px] text-center font-medium">
                              {isRequester ? 'Writer is currently drafting your pages' : 'You are assigned to draft these pages'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Campus Escrow Dispute & Guarantee Policy Card */}
          <div className="p-5 rounded-3xl bg-slate-100 border border-slate-200/90 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-black">
              <Shield className="w-4 h-4 text-purple-700" />
              <span>CampusLoop Fair Trade & Escrow Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              CampusLoop protects students against counterfeit, missing pages, and defective course materials. Escrow deposits remain frozen in your campus loop vault until confirmed by the recipient. In the event of a dispute, an elected student council mediator reviews syllabus verification within 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: VIEW BOOK DETAILS */}
      {/* ============================================================ */}
      {selectedBookForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                {selectedBookForDetails.category}
              </span>
              <button 
                onClick={() => setSelectedBookForDetails(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 relative">
              <img 
                src={selectedBookForDetails.images[0]} 
                alt={selectedBookForDetails.title}
                className="w-full h-full object-cover" 
              />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold">
                Condition: {selectedBookForDetails.condition}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">{selectedBookForDetails.title}</h3>
              {selectedBookForDetails.author && (
                <p className="text-xs text-slate-500 font-semibold">Author / Contributor: {selectedBookForDetails.author}</p>
              )}
              {selectedBookForDetails.course && (
                <p className="text-xs text-purple-700 font-semibold">Course: {selectedBookForDetails.course}</p>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {selectedBookForDetails.description}
            </p>

            {/* Escrow Guarantee Highlight */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-950 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Campus Escrow Protected: Payment is held securely until you inspect the book on campus.</span>
            </div>

            {/* Seller profile card */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img 
                  src={selectedBookForDetails.sellerAvatar} 
                  alt={selectedBookForDetails.sellerName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-600/30" 
                />
                <div>
                  <p className="font-bold text-xs text-slate-900">{selectedBookForDetails.sellerName}</p>
                  <p className="text-[10px] text-slate-500">{selectedBookForDetails.sellerCollege}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Verified Student
              </span>
            </div>

            {/* Price & Checkout action */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-2xl font-black text-slate-900">₹{selectedBookForDetails.price}</span>
                <span className="text-xs text-slate-400 line-through ml-2">₹{selectedBookForDetails.originalReferencePrice}</span>
              </div>
              <button
                onClick={() => {
                  const bookToBuy = selectedBookForDetails;
                  setSelectedBookForDetails(null);
                  setCheckoutBook(bookToBuy);
                }}
                className="px-6 py-3 bg-purple-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Buy with Escrow Protection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: SELL A BOOK / DIGITAL PDF NOTES */}
      {/* ============================================================ */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">List Study Material</h3>
                <p className="text-xs text-slate-500">Sell physical textbooks or publish digital handwritten notes.</p>
              </div>
              <button 
                onClick={() => setIsSellModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSellSubmit} className="space-y-4 text-xs">
              {/* Item Format Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Material Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormItemFormat('physical')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      formItemFormat === 'physical'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-950 font-extrabold ring-1 ring-purple-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-purple-700 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold">Physical Textbook</span>
                      <span className="block text-[10px] text-slate-500 font-normal">Campus handover with escrow</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormItemFormat('pdf')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      formItemFormat === 'pdf'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-extrabold ring-1 ring-indigo-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold">Digital PDF Notes</span>
                      <span className="block text-[10px] text-slate-500 font-normal">Handwritten notes & formula sheets</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {formItemFormat === 'pdf' ? 'Notes Title *' : 'Book Title *'}
                </label>
                <input
                  type="text"
                  placeholder={formItemFormat === 'pdf' ? 'e.g. Complete DSA & LeetCode Python Revision Notes' : 'e.g. Core Java: Fundamentals (11th Edition)'}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {formItemFormat === 'pdf' ? 'Note Maker / Contributor *' : 'Author / Publisher *'}
                  </label>
                  <input
                    type="text"
                    placeholder={formItemFormat === 'pdf' ? 'e.g. Adil Hassan (Class Topper)' : 'e.g. Cay S. Horstmann'}
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

                {formItemFormat === 'pdf' ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Total PDF Pages</label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={formPdfPageCount}
                      onChange={(e) => setFormPdfPageCount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                ) : (
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
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Asking Price (₹) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-purple-950"
                  />
                </div>
              </div>

              {/* Transparent 2% Commission Note */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900 space-y-1">
                <div className="flex justify-between">
                  <span>Transparent 2% Campus Fee:</span>
                  <span className="font-bold">₹{Math.round((parseFloat(formPrice) || 0) * 0.02)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-emerald-800 border-t border-purple-200 pt-1">
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
                  placeholder={formItemFormat === 'pdf' ? 'Mention topics covered, syllabus, formula summaries...' : 'Mention markings, highlighting, included CDs/keys...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {formItemFormat === 'pdf' ? 'Publish PDF Notes to Marketplace' : 'List Book with Escrow Protection'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CHECKOUT MODAL (WITH CAMPUS ESCROW) */}
      {/* ============================================================ */}
      {checkoutBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {checkoutBook.itemFormat === 'pdf' ? 'Instant PDF Notes Checkout' : 'Campus Escrow Book Checkout'}
                </h3>
                <p className="text-xs text-slate-500">
                  {checkoutBook.itemFormat === 'pdf' ? 'Instant digital access with simulated UPI escrow.' : 'Funds locked safely until you inspect book.'}
                </p>
              </div>
              <button 
                onClick={() => { setCheckoutBook(null); setCheckoutSuccessTx(null); }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccessTx ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  {checkoutBook.itemFormat === 'pdf' ? 'PDF Notes Unlocked!' : 'Locked in Campus Escrow!'}
                </h4>
                
                <p className="text-xs text-slate-600 px-2 leading-relaxed">
                  {checkoutBook.itemFormat === 'pdf'
                    ? 'Your payment was confirmed. You can now download your digital study materials below.'
                    : `₹${checkoutSuccessTx.price} is held securely in Campus Escrow. Meet ${checkoutBook.sellerName} on campus to inspect the textbook condition. You have 48 hours to release escrow or file a dispute.`
                  }
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span>Item:</span>
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
                  <div className="flex justify-between text-purple-700 font-bold border-t border-slate-200 pt-1">
                    <span>Escrow Status:</span>
                    <span>{checkoutBook.itemFormat === 'pdf' ? 'Completed' : '🔒 Active Escrow Hold (48h)'}</span>
                  </div>
                </div>

                {/* Simulated Download button for PDF */}
                {checkoutBook.itemFormat === 'pdf' && (
                  <button
                    onClick={() => {
                      alert('Simulated PDF Download: Successfully downloaded ' + checkoutBook.title + ' (' + (checkoutBook.pdfFileSize || '12 MB') + ') to your device!');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Notes Now ({checkoutBook.pdfFileSize || '12 MB'})</span>
                  </button>
                )}

                {/* Direct Action to Escrow Vault */}
                {checkoutBook.itemFormat !== 'pdf' && (
                  <button
                    onClick={() => {
                      setCheckoutBook(null);
                      setCheckoutSuccessTx(null);
                      setActiveMarketplaceTab('escrow');
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>View in Escrow Vault & Tracker</span>
                  </button>
                )}

                {/* +2 Credits Added Confirmation */}
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>
                    {checkoutBook.itemFormat === 'pdf'
                      ? '+2 Learning Credits added to your wallet!'
                      : '+2 Learning Credits will be unlocked upon escrow verification!'}
                  </span>
                </div>

                <button
                  onClick={() => { setCheckoutBook(null); setCheckoutSuccessTx(null); }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : isProcessingCheckout ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  {checkoutBook.itemFormat === 'pdf' ? 'Processing Digital Notes Delivery...' : 'Locking Funds into Campus Escrow...'}
                </p>
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">₹{checkoutBook.price}</p>
                      <span className="text-[9px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                        {checkoutBook.itemFormat === 'pdf' ? 'PDF Notes' : 'Physical Book'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3-Step Escrow Guarantee Note for Physical Books */}
                {checkoutBook.itemFormat !== 'pdf' && (
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                    <span className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Campus Escrow Guarantee</span>
                    </span>
                    <ol className="text-[11px] space-y-1 text-emerald-900/90 list-decimal pl-4">
                      <li>Your ₹{checkoutBook.price} payment is held safely in Campus Escrow.</li>
                      <li>Inspect the book on campus within 48 hours of meeting.</li>
                      <li>Tap "Release Escrow" to credit the seller and earn +2 credits!</li>
                    </ol>
                  </div>
                )}

                {/* Transparent Commission Breakdown */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
                    Transparent Price Breakdown
                  </span>
                  <div className="flex justify-between text-slate-700">
                    <span>Item Price:</span>
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
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
                  >
                    <option value="Simulated Campus UPI">Simulated Campus UPI (Instant Escrow Lock)</option>
                    <option value="Simulated RuPay Card">Simulated RuPay / Debit Card</option>
                    {checkoutBook.itemFormat !== 'pdf' && (
                      <option value="Cash on Campus Handover">Cash on Campus Handover</option>
                    )}
                  </select>
                </div>

                <button
                  onClick={handleExecuteCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {checkoutBook.itemFormat === 'pdf' 
                      ? `Confirm Digital Purchase (₹${checkoutBook.price})` 
                      : `Lock in Escrow & Purchase (₹${checkoutBook.price})`}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: CONFIRM RELEASE ESCROW MODAL */}
      {/* ============================================================ */}
      {confirmReleaseTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">Confirm Book & Release Escrow?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Confirm that you received <strong>"{confirmReleaseTx.listingTitle}"</strong> in acceptable condition. This will immediately release <strong>₹{confirmReleaseTx.sellerPayout}</strong> to <strong>{confirmReleaseTx.sellerName}</strong> and award +2 learning credits to both of you.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmReleaseTx(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isReleasingEscrow}
                onClick={handleConfirmReleaseEscrow}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                {isReleasingEscrow ? 'Releasing...' : 'Release Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: REPORT CONDITION ISSUE / DISPUTE MODAL */}
      {/* ============================================================ */}
      {disputeModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-base font-black text-slate-900">File Escrow Dispute</h3>
              </div>
              <button 
                onClick={() => setDisputeModalTx(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Filing a dispute freezes the escrow payout of ₹{disputeModalTx.sellerPayout} until resolved. Our campus student mediator team will review the issue.
            </p>

            <form onSubmit={handleSubmitDispute} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Issue Category *</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="Missing or torn pages">Missing or torn pages</option>
                  <option value="Heavily marked / highlighted beyond description">Heavily marked / highlighted beyond description</option>
                  <option value="Wrong edition / syllabus changed">Wrong edition / syllabus changed</option>
                  <option value="Seller did not meet on campus">Seller did not meet on campus</option>
                  <option value="Water damage / mold / structural defect">Water damage / structural defect</option>
                  <option value="Other condition mismatch">Other condition mismatch</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Describe the problem</label>
                <textarea
                  rows={3}
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  placeholder="Provide specific details (e.g. Chapter 4 is missing pages 65-80, or severe liquid stain)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalTx(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
