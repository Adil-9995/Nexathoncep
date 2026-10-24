import React, { useState } from 'react';
import { 
  PenTool, 
  FileText, 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Star, 
  Plus, 
  CheckCircle2, 
  X, 
  Send, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  Upload, 
  BookOpen, 
  Check, 
  UserCheck, 
  MessageSquare,
  HelpCircle,
  Layers,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WritingGigListing, WritingJobAnnouncement, WritingOrder, WritingServiceType } from '../types';

interface WritingGigsPageProps {
  onNavigateToCredits?: () => void;
}

export const WritingGigsPage: React.FC<WritingGigsPageProps> = ({ onNavigateToCredits }) => {
  const { 
    currentUser, 
    writingGigs, 
    writingAnnouncements, 
    writingOrders, 
    addWritingGig, 
    postWritingAnnouncement, 
    createWritingOrderFromGig, 
    acceptWritingAnnouncement, 
    submitOrderWork, 
    approveAndCompleteWritingOrder,
    triggerCreditAlert
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'writers' | 'announcements' | 'orders'>('writers');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isPostGigModalOpen, setIsPostGigModalOpen] = useState(false);
  const [isPostAnnouncementModalOpen, setIsPostAnnouncementModalOpen] = useState(false);
  const [selectedGigForHire, setSelectedGigForHire] = useState<WritingGigListing | null>(null);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<WritingOrder | null>(null);
  const [selectedOrderForSubmit, setSelectedOrderForSubmit] = useState<WritingOrder | null>(null);

  // Hire Form
  const [hirePagesCount, setHirePagesCount] = useState<number>(20);
  const [hireInstructions, setHireInstructions] = useState('');
  const [isPayingAdvance, setIsPayingAdvance] = useState(false);

  // Post Gig Form (Writer)
  const [gigTitle, setGigTitle] = useState('');
  const [gigServiceType, setGigServiceType] = useState<WritingServiceType>('Lab Record Writing');
  const [gigPricingModel, setGigPricingModel] = useState<'per_record' | 'per_page' | 'fixed'>('per_record');
  const [gigRate, setGigRate] = useState<string>('120');
  const [gigTurnaroundDays, setGigTurnaroundDays] = useState<string>('2');
  const [gigHandwritingSample, setGigHandwritingSample] = useState('');
  const [gigLanguages, setGigLanguages] = useState('English');
  const [gigDescription, setGigDescription] = useState('');
  const [gigFormError, setGigFormError] = useState('');

  // Post Announcement Form (Requester)
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<WritingServiceType>('Lab Record Writing');
  const [annSubject, setAnnSubject] = useState('Digital Signal Processing');
  const [annPagesCount, setAnnPagesCount] = useState<string>('25');
  const [annDeadline, setAnnDeadline] = useState('Friday Evening (5 PM)');
  const [annBudget, setAnnBudget] = useState<string>('180');
  const [annInstructions, setAnnInstructions] = useState('');
  const [annFormError, setAnnFormError] = useState('');

  // Work Submit Form
  const [submitNotes, setSubmitNotes] = useState('');
  const [submitSampleImage, setSubmitSampleImage] = useState('');

  const serviceCategories: WritingServiceType[] = [
    'Lab Record Writing',
    'Assignment Writing',
    'Observation Notebook',
    'Project Report / Paper',
    'Diagrams & Engineering Graphs'
  ];

  // Filtering
  const filteredGigs = writingGigs.filter(gig => {
    const matchesCategory = filterCategory === 'All' || gig.serviceType === filterCategory;
    const matchesSearch = 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.writerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAnnouncements = writingAnnouncements.filter(ann => ann.status === 'open');

  const myOrders = writingOrders.filter(o => 
    o.requesterId === currentUser.id || o.writerId === currentUser.id
  );

  // Submit Handler: Post Gig
  const handlePostGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle.trim() || !gigRate.trim() || !gigDescription.trim()) {
      setGigFormError('Please fill in title, asking rate, and description.');
      return;
    }

    const rateNum = parseFloat(gigRate);
    const daysNum = parseInt(gigTurnaroundDays, 10);

    if (isNaN(rateNum) || rateNum <= 0) {
      setGigFormError('Please enter a valid rate in ₹.');
      return;
    }

    addWritingGig({
      title: gigTitle.trim(),
      serviceType: gigServiceType,
      pricingModel: gigPricingModel,
      rate: rateNum,
      turnaroundDays: isNaN(daysNum) || daysNum < 1 ? 2 : daysNum,
      handwritingSample: gigHandwritingSample.trim() || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      languages: gigLanguages.split(',').map(l => l.trim()).filter(Boolean),
      description: gigDescription.trim()
    });

    // Reset Form
    setGigTitle('');
    setGigRate('120');
    setGigDescription('');
    setGigHandwritingSample('');
    setGigFormError('');
    setIsPostGigModalOpen(false);
  };

  // Submit Handler: Post Announcement
  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annBudget.trim() || !annInstructions.trim()) {
      setAnnFormError('Please fill in title, budget, and work instructions.');
      return;
    }

    const budgetNum = parseFloat(annBudget);
    const pagesNum = parseInt(annPagesCount, 10);

    if (isNaN(budgetNum) || budgetNum < 10) {
      setAnnFormError('Budget must be at least ₹10.');
      return;
    }

    postWritingAnnouncement({
      title: annTitle.trim(),
      category: annCategory,
      subject: annSubject.trim() || 'Core Subject',
      pagesCount: isNaN(pagesNum) || pagesNum < 1 ? 10 : pagesNum,
      deadline: annDeadline.trim() || '3 Days',
      budget: budgetNum,
      instructions: annInstructions.trim()
    });

    // Reset Form
    setAnnTitle('');
    setAnnBudget('180');
    setAnnInstructions('');
    setAnnFormError('');
    setIsPostAnnouncementModalOpen(false);
    setActiveTab('announcements');
  };

  // Handle Hire with ₹10 Advance
  const handleConfirmHire = () => {
    if (!selectedGigForHire) return;
    setIsPayingAdvance(true);

    setTimeout(() => {
      const res = createWritingOrderFromGig(
        selectedGigForHire.id, 
        hirePagesCount, 
        hireInstructions || 'Standard blue/black pen with clear margins and neat headings.'
      );
      setIsPayingAdvance(false);
      setSelectedGigForHire(null);
      setHireInstructions('');
      if (res.success) {
        setActiveTab('orders');
      }
    }, 900);
  };

  // Handle Submit Completed Work
  const handleConfirmSubmitWork = () => {
    if (!selectedOrderForSubmit) return;
    submitOrderWork(
      selectedOrderForSubmit.id, 
      submitNotes || 'Completed all pages with neat cursive handwriting and attached diagrams.',
      submitSampleImage ? [submitSampleImage] : undefined
    );
    setSelectedOrderForSubmit(null);
    setSubmitNotes('');
    setSubmitSampleImage('');
  };

  // Handle Approve & Final Payment
  const handleConfirmFinalPayment = () => {
    if (!selectedOrderForReview) return;
    approveAndCompleteWritingOrder(selectedOrderForReview.id);
    setSelectedOrderForReview(null);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* ============================================================ */}
      {/* PAGE HEADER */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <PenTool className="w-3 h-3 text-indigo-700" />
              <span>Campus Writing Gig Hub</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ₹10 Advance Escrow • 2% App Fee
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Assignment & Record Writing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Students who write can earn money. Students who need records or assignments written pay ₹10 advance to start!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => { setIsPostAnnouncementModalOpen(true); setAnnFormError(''); }}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-2xl border border-slate-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-700" />
            <span>Announce Request</span>
          </button>

          <button
            onClick={() => { setIsPostGigModalOpen(true); setGigFormError(''); }}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer group"
          >
            <PenTool className="w-4 h-4" />
            <span>Earn as Writer</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TRANSPARENT ESCROW WORKFLOW BANNER */}
      {/* ============================================================ */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-400/20 text-indigo-200 border border-indigo-400/30 text-[10px] font-black uppercase tracking-wider">
                Fair Escrow Rules
              </span>
              <span className="text-xs text-indigo-200 font-bold">
                How Student Assignment Writing Works
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              +2 Bonus Credits for Both Students
            </span>
          </div>

          {/* 4 Step Workflow Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <div className="flex items-center gap-2 font-black text-amber-300">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[11px]">1</span>
                <span>Pay ₹10 Advance</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Requester deposits strictly <strong>₹10 advance</strong> to lock the student writer and book their slot.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <div className="flex items-center gap-2 font-black text-indigo-300">
                <span className="w-5 h-5 rounded-full bg-indigo-400 text-slate-900 flex items-center justify-center text-[11px]">2</span>
                <span>Send Materials</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Upload syllabus questions, lab manual PDFs, diagram instructions, and target ink color.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <div className="flex items-center gap-2 font-black text-emerald-300">
                <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center text-[11px]">3</span>
                <span>Review Written Draft</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Writer completes the pages and uploads proof images for your inspection before payment.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <div className="flex items-center gap-2 font-black text-rose-300">
                <span className="w-5 h-5 rounded-full bg-rose-400 text-slate-900 flex items-center justify-center text-[11px]">4</span>
                <span>2% App Fee • 98% Writer</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Release remaining balance. <strong>2% to app</strong> and <strong>98% to writer</strong>, plus +2 credits each!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* NAVIGATION TABS */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('writers')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'writers'
                ? 'bg-purple-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-indigo-400" />
            <span>Available Student Writers ({writingGigs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-purple-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Open Writing Requests ({openAnnouncements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            <span>My Writing Orders & Escrow ({myOrders.length})</span>
          </button>
        </div>

        {/* Search Input for Gigs / Requests */}
        {activeTab !== 'orders' && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by topic, writer or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800"
            />
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: BROWSE STUDENT WRITERS */}
      {/* ============================================================ */}
      {activeTab === 'writers' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === 'All'
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              All Writing Services ({writingGigs.length})
            </button>
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Writers Grid */}
          {filteredGigs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <PenTool className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No student writers in this category</h3>
              <p className="text-xs text-slate-500">Be the first student to offer writing services!</p>
              <button
                onClick={() => { setIsPostGigModalOpen(true); }}
                className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Post Writing Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGigs.map((gig) => {
                const isMine = gig.writerId === currentUser.id;

                return (
                  <div
                    key={gig.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Handwriting Sample Preview */}
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-100">
                        <img 
                          src={gig.handwritingSample} 
                          alt={gig.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                          {gig.serviceType}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-extrabold shadow-sm">
                          Handwriting Sample
                        </span>
                      </div>

                      {/* Writer Info */}
                      <div className="flex items-center gap-3">
                        <img 
                          src={gig.writerAvatar} 
                          alt={gig.writerName} 
                          className="w-10 h-10 rounded-full object-cover border border-purple-200" 
                        />
                        <div className="leading-tight">
                          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                            <span>{gig.writerName}</span>
                            <span className="text-[10px] text-amber-600 font-bold flex items-center">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                              {gig.writerRating.toFixed(2)}
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500">{gig.writerCollege}</p>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h3 className="font-black text-sm text-slate-900 line-clamp-1">{gig.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{gig.description}</p>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{gig.turnaroundDays} Days Turnaround</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">
                          {gig.completedJobsCount} Records Written
                        </span>
                      </div>
                    </div>

                    {/* Bottom Pricing & Hire Button */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Asking Rate</span>
                        <span className="text-base font-black text-slate-900">
                          ₹{gig.rate}
                          <span className="text-xs text-slate-500 font-normal">
                            {gig.pricingModel === 'per_page' ? ' / page' : ' / record'}
                          </span>
                        </span>
                      </div>

                      {isMine ? (
                        <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 font-black text-xs">
                          Your Gig
                        </span>
                      ) : (
                        <button
                          onClick={() => { setSelectedGigForHire(gig); }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Hire (Pay ₹10)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: OPEN ASSIGNMENT REQUESTS / ANNOUNCEMENTS */}
      {/* ============================================================ */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Open Writing Announcements</h2>
              <p className="text-xs text-slate-500">Students needing assignments or lab records written by peers.</p>
            </div>
            <button
              onClick={() => { setIsPostAnnouncementModalOpen(true); }}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Announce Your Work</span>
            </button>
          </div>

          {openAnnouncements.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No open writing requests right now</h3>
              <p className="text-xs text-slate-500">Need something written? Announce your assignment!</p>
              <button
                onClick={() => { setIsPostAnnouncementModalOpen(true); }}
                className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Announce Assignment Request
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {openAnnouncements.map((ann) => {
                const isMine = ann.requesterId === currentUser.id;

                return (
                  <div
                    key={ann.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase">
                          {ann.category}
                        </span>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {ann.subject}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          • {ann.pagesCount} Pages • Deadline: {ann.deadline}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900">{ann.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{ann.instructions}</p>

                      <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                        <img 
                          src={ann.requesterAvatar} 
                          alt={ann.requesterName} 
                          className="w-5 h-5 rounded-full object-cover" 
                        />
                        <span>Posted by <strong>{ann.requesterName}</strong> ({ann.requesterCollege})</span>
                      </div>
                    </div>

                    {/* Budget & Claim Button */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Budget</span>
                        <span className="text-xl font-black text-emerald-700">₹{ann.budget}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          (Writer receives ₹{(ann.budget * 0.98).toFixed(2)})
                        </span>
                      </div>

                      {isMine ? (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                          Your Request
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const res = acceptWritingAnnouncement(ann.id);
                            if (res.success) {
                              setActiveTab('orders');
                            }
                          }}
                          className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept & Write</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: ACTIVE ORDERS & ESCROW TRACKER */}
      {/* ============================================================ */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Your Writing Orders & Escrow Tracker</h2>
            <p className="text-xs text-slate-500">
              Track work in progress, review written pages, and release final payment (2% platform fee deducted).
            </p>
          </div>

          {myOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active writing orders</h3>
              <p className="text-xs text-slate-500">Hire a student writer or announce an assignment to see orders here.</p>
              <button
                onClick={() => setActiveTab('writers')}
                className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Browse Writers
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const isRequester = order.requesterId === currentUser.id;
                const isWriter = order.writerId === currentUser.id;

                return (
                  <div
                    key={order.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {order.category} • {order.pagesCount} Pages
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 mt-1">{order.title}</h3>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {order.status === 'in_progress' && (
                          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Writing In Progress
                          </span>
                        )}
                        {order.status === 'submitted_for_review' && (
                          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-extrabold text-xs flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            Work Submitted for Review
                          </span>
                        )}
                        {order.status === 'completed' && (
                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Completed & Paid
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Escrow Progress Bar */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                        <div className={`p-2 rounded-xl border ${order.advancePaid ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-400'}`}>
                          <span>1. ₹10 Advance Paid</span>
                        </div>
                        <div className={`p-2 rounded-xl border ${order.materialsSubmitted ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-400'}`}>
                          <span>2. Instructions Given</span>
                        </div>
                        <div className={`p-2 rounded-xl border ${order.workSubmitted ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-400'}`}>
                          <span>3. Draft Submitted</span>
                        </div>
                        <div className={`p-2 rounded-xl border ${order.finalPaid ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-400'}`}>
                          <span>4. Rest Paid (2% App / 98% Writer)</span>
                        </div>
                      </div>

                      {/* Transparent Financial Ledger */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Amount</span>
                          <span className="font-black text-slate-900 text-sm">₹{order.totalAmount}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Advance Paid</span>
                          <span className="font-black text-emerald-700 text-sm">₹{order.advanceAmount}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">App Commission (2%)</span>
                          <span className="font-bold text-indigo-700 text-sm">₹{order.platformFee.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Writer Payout (98%)</span>
                          <span className="font-black text-slate-900 text-sm">₹{order.writerPayout.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Parties and Instructions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-white rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold uppercase">Requester (Student):</span>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="font-bold text-slate-900">{order.requesterName}</span>
                          <span className="text-[11px] text-slate-500">({order.requesterCollege})</span>
                        </div>
                        <p className="text-slate-600 text-[11px] pt-1">
                          <strong>Instructions:</strong> {order.workInstructions || 'Standard blue record pen with margins.'}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold uppercase">Assigned Writer:</span>
                        <div className="flex items-center gap-2 pt-0.5">
                          <img src={order.writerAvatar} alt={order.writerName} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-bold text-slate-900">{order.writerName}</span>
                          <span className="text-[11px] text-slate-500">({order.writerCollege})</span>
                        </div>
                        {order.workSubmissionNotes && (
                          <p className="text-indigo-900 text-[11px] pt-1 bg-indigo-50 p-2 rounded-xl border border-indigo-100">
                            <strong>Writer Note:</strong> {order.workSubmissionNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions based on role and status */}
                    <div className="pt-2 flex items-center justify-end gap-3 flex-wrap">
                      {isWriter && order.status === 'in_progress' && (
                        <button
                          onClick={() => { setSelectedOrderForSubmit(order); }}
                          className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Submit Completed Work</span>
                        </button>
                      )}

                      {isRequester && order.status === 'submitted_for_review' && (
                        <button
                          onClick={() => { setSelectedOrderForReview(order); }}
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Review & Release ₹{order.remainingAmount}</span>
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <Sparkles className="w-4 h-4" />
                          <span>Order settled. +2 Learning Credits earned by both!</span>
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

      {/* ============================================================ */}
      {/* MODAL 1: HIRE WRITER (PAY ₹10 ADVANCE ESCROW) */}
      {/* ============================================================ */}
      {selectedGigForHire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  ₹10 Advance Escrow
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Hire Student Writer</h3>
              </div>
              <button 
                onClick={() => setSelectedGigForHire(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Writer Summary */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img 
                src={selectedGigForHire.writerAvatar} 
                alt={selectedGigForHire.writerName} 
                className="w-12 h-12 rounded-xl object-cover" 
              />
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-xs">{selectedGigForHire.title}</h4>
                <p className="text-[11px] text-slate-500">Writer: {selectedGigForHire.writerName}</p>
                <p className="text-xs font-black text-indigo-700">
                  Rate: ₹{selectedGigForHire.rate} {selectedGigForHire.pricingModel === 'per_page' ? '/ page' : '/ full record'}
                </p>
              </div>
            </div>

            {/* Page Count (if per_page) */}
            {selectedGigForHire.pricingModel === 'per_page' && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Estimated Pages to Write:
                </label>
                <input
                  type="number"
                  min={1}
                  value={hirePagesCount}
                  onChange={(e) => setHirePagesCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
            )}

            {/* Work Instructions */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Your Assignment / Record Instructions:
              </label>
              <textarea
                rows={2}
                value={hireInstructions}
                onChange={(e) => setHireInstructions(e.target.value)}
                placeholder="Mention experiment titles, preferred pen color (blue/black), graph sheets..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            {/* Escrow Calculation Card */}
            {(() => {
              const total = selectedGigForHire.pricingModel === 'per_page'
                ? Math.max(selectedGigForHire.rate * hirePagesCount, 50)
                : selectedGigForHire.rate;
              const advance = 10;
              const rest = Math.max(total - advance, 0);
              const fee = Math.round(total * 0.02 * 100) / 100;
              const writerPay = Math.round((total - fee) * 100) / 100;

              return (
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Total Service Amount:</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                    <span>Advance Payable Now:</span>
                    <span>₹10 (Deposit)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Payable after Review:</span>
                    <span className="font-bold text-slate-900">₹{rest}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px] border-t border-indigo-200 pt-1">
                    <span>Platform Fee (2% to App):</span>
                    <span>₹{fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Net to Writer:</span>
                    <span>₹{writerPay.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={handleConfirmHire}
              disabled={isPayingAdvance}
              className="w-full py-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPayingAdvance ? (
                <span>Locking Escrow & Paying ₹10...</span>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span>Pay ₹10 Advance & Start Work</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: POST A WRITING SERVICE (BECOME A WRITER) */}
      {/* ============================================================ */}
      {isPostGigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  Student Writer Gig
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Offer Writing Service</h3>
                <p className="text-xs text-slate-500">Earn money writing assignments, records & graphs for students.</p>
              </div>
              <button 
                onClick={() => setIsPostGigModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {gigFormError && (
              <p className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200">
                {gigFormError}
              </p>
            )}

            <form onSubmit={handlePostGig} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Service Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Neat Cursive Lab Records & Observation Writing"
                  value={gigTitle}
                  onChange={(e) => setGigTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Service Category</label>
                  <select
                    value={gigServiceType}
                    onChange={(e) => setGigServiceType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {serviceCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Pricing Model</label>
                  <select
                    value={gigPricingModel}
                    onChange={(e) => setGigPricingModel(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="per_record">Per Full Record (e.g. ₹120)</option>
                    <option value="per_page">Per Page (e.g. ₹8 / page)</option>
                    <option value="fixed">Fixed Assignment Price</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Asking Rate (₹) *</label>
                  <input
                    type="number"
                    value={gigRate}
                    onChange={(e) => setGigRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Turnaround Days</label>
                  <input
                    type="number"
                    min={1}
                    value={gigTurnaroundDays}
                    onChange={(e) => setGigTurnaroundDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Handwriting Sample Image URL</label>
                <input
                  type="text"
                  placeholder="https://... (image showing your handwriting)"
                  value={gigHandwritingSample}
                  onChange={(e) => setGigHandwritingSample(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Languages (comma separated)</label>
                <input
                  type="text"
                  value={gigLanguages}
                  onChange={(e) => setGigLanguages(e.target.value)}
                  placeholder="e.g. English, Malayalam, Hindi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">About Your Handwriting & Style *</label>
                <textarea
                  rows={3}
                  value={gigDescription}
                  onChange={(e) => setGigDescription(e.target.value)}
                  placeholder="Describe your penmanship (cursive, print), pens used, subject experience..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Escrow Fee Note */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1 text-[11px] text-purple-900">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Transparent 2% Platform Fee & ₹10 Advance Escrow</span>
                </p>
                <p className="text-slate-600 text-[10px]">
                  Students pay ₹10 advance to book you. On completed delivery, 2% goes to platform maintenance and 98% is credited straight to you!
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Publish Writing Service
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: ANNOUNCE AN ASSIGNMENT / RECORD REQUEST */}
      {/* ============================================================ */}
      {isPostAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  Post Announcement
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Need Work Written?</h3>
                <p className="text-xs text-slate-500">Announce your assignment or lab record so student writers can claim it.</p>
              </div>
              <button 
                onClick={() => setIsPostAnnouncementModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {annFormError && (
              <p className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200">
                {annFormError}
              </p>
            )}

            <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Request Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Need 25-Page Digital Signal Processing Lab Record Written"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {serviceCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={annSubject}
                    onChange={(e) => setAnnSubject(e.target.value)}
                    placeholder="e.g. Fluid Mechanics"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Total Pages</label>
                  <input
                    type="number"
                    min={1}
                    value={annPagesCount}
                    onChange={(e) => setAnnPagesCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Deadline</label>
                  <input
                    type="text"
                    value={annDeadline}
                    onChange={(e) => setAnnDeadline(e.target.value)}
                    placeholder="e.g. Friday 5 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Budget (₹) *</label>
                  <input
                    type="number"
                    value={annBudget}
                    onChange={(e) => setAnnBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Instructions for Writer *</label>
                <textarea
                  rows={3}
                  value={annInstructions}
                  onChange={(e) => setAnnInstructions(e.target.value)}
                  placeholder="Detail the experiments, number of graphs, pen colors, formatting guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Your Total Budget:</span>
                  <span className="font-bold text-slate-900">₹{parseFloat(annBudget) || 0}</span>
                </div>
                <div className="flex justify-between text-indigo-700">
                  <span>Platform Fee (2% to App):</span>
                  <span>₹{((parseFloat(annBudget) || 0) * 0.02).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold border-t border-slate-200 pt-1">
                  <span>Writer Net Payout (98%):</span>
                  <span>₹{((parseFloat(annBudget) || 0) * 0.98).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Post Writing Announcement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: SUBMIT WORK (WRITER DELIVERS PROOF) */}
      {/* ============================================================ */}
      {selectedOrderForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Submit Work
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Submit Written Pages</h3>
              </div>
              <button 
                onClick={() => setSelectedOrderForSubmit(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Submission Notes for {selectedOrderForSubmit.requesterName}:
                </label>
                <textarea
                  rows={3}
                  value={submitNotes}
                  onChange={(e) => setSubmitNotes(e.target.value)}
                  placeholder="e.g. Finished all 25 pages with neat cursive script and plotted all 4 required graphs on semi-log sheets."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Draft Photo Proof URL (Optional):
                </label>
                <input
                  type="text"
                  value={submitSampleImage}
                  onChange={(e) => setSubmitSampleImage(e.target.value)}
                  placeholder="https://... (photo of completed written record)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-[11px] text-indigo-950 space-y-1">
                <p className="font-bold">Next Steps:</p>
                <p className="text-slate-600 text-[10px]">
                  Once you submit, {selectedOrderForSubmit.requesterName} will inspect your work and release the remaining <strong>₹{selectedOrderForSubmit.remainingAmount}</strong>. You will receive <strong>₹{selectedOrderForSubmit.writerPayout.toFixed(2)}</strong> (98%) directly into your wallet.
                </p>
              </div>

              <button
                onClick={handleConfirmSubmitWork}
                className="w-full py-3 bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Deliver Work for Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: REVIEW WORK & PAY REMAINING AMOUNT */}
      {/* ============================================================ */}
      {selectedOrderForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Final Payment Release
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Review & Complete Order</h3>
              </div>
              <button 
                onClick={() => setSelectedOrderForReview(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Order summary */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Order Details:</span>
                <h4 className="font-black text-slate-900 text-sm">{selectedOrderForReview.title}</h4>
                <p className="text-[11px] text-slate-500">Written by: <strong>{selectedOrderForReview.writerName}</strong></p>
                {selectedOrderForReview.workSubmissionNotes && (
                  <p className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 text-[11px] mt-1">
                    <strong>Writer Note:</strong> "{selectedOrderForReview.workSubmissionNotes}"
                  </p>
                )}
              </div>

              {/* Sample Images preview */}
              {selectedOrderForReview.workSampleImages && selectedOrderForReview.workSampleImages.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Submitted Draft Proof:</span>
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img 
                      src={selectedOrderForReview.workSampleImages[0]} 
                      alt="Work sample" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              )}

              {/* Final Breakdown */}
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Total Order Budget:</span>
                  <span>₹{selectedOrderForReview.totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Advance Already Paid:</span>
                  <span>-₹{selectedOrderForReview.advanceAmount}</span>
                </div>
                <div className="flex justify-between font-black text-emerald-800 bg-white p-2 rounded-xl border border-emerald-200">
                  <span>Remaining Amount to Pay Now:</span>
                  <span>₹{selectedOrderForReview.remainingAmount}</span>
                </div>

                <div className="pt-1 border-t border-purple-200 text-[10px] space-y-1 text-slate-500">
                  <div className="flex justify-between">
                    <span>Platform Fee (2% to App):</span>
                    <span>₹{selectedOrderForReview.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Net Credited to {selectedOrderForReview.writerName} (98%):</span>
                    <span>₹{selectedOrderForReview.writerPayout.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Credit Bonus */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Completion Bonus:</span>
                </span>
                <span className="font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                  +2 Credits for Both Students
                </span>
              </div>

              <button
                onClick={handleConfirmFinalPayment}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Work & Release ₹{selectedOrderForReview.remainingAmount}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
