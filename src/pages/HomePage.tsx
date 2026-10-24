import React from 'react';
import { 
  BookOpen, 
  Coins, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Zap, 
  Repeat, 
  Lock, 
  Heart,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { listings, allUsers, setFakePaymentModalOpen, setPendingUnlockTeacherId } = useApp();

  const featuredBooks = listings.slice(0, 3);

  const skillsList = [
    { name: 'Figma', category: 'UI/UX Design', icon: '🎨' },
    { name: 'Django', category: 'Backend Web', icon: '🐍' },
    { name: 'Flutter', category: 'Mobile Dev', icon: '📱' },
    { name: 'Canva', category: 'Graphic Design', icon: '✨' },
    { name: 'Python', category: 'Programming', icon: '⚡' },
    { name: 'Java', category: 'Computer Science', icon: '☕' },
    { name: 'UI/UX Design', category: 'Product Design', icon: '📐' },
    { name: 'Video Editing', category: 'Creative Media', icon: '🎬' }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 rounded-3xl bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white p-6 sm:p-12 shadow-2xl border border-purple-800/40">
        
        {/* Glow ambient spots */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 shadow-sm hover:border-amber-400/50 transition-colors">
            <Sparkles className="w-4 h-4 fill-current animate-pulse text-amber-400" />
            <span className="font-heading">Student-Powered Circular Learning Platform</span>
            <span className="text-white/40 hidden sm:inline">&bull;</span>
            <span className="text-indigo-200 hidden sm:inline">Zero Course Tuition</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] sm:leading-[1.1]">
            Learn One Skill. <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">Teach Another.</span> <br className="hidden sm:inline" />Grow Together.
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 max-w-2xl mx-auto font-normal sm:font-medium leading-relaxed">
            Discover verified skills from fellow campus students, earn learning credits by sharing your know-how, and buy or sell second-hand textbooks in one trusted peer community.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('learn')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Explore Skills & Matches</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('marketplace')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-2xl border border-white/20 backdrop-blur-md hover:border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-indigo-300" />
              <span>Book Marketplace</span>
            </button>
          </div>

          {/* Micro-payment & Credit highlight tag */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-indigo-200/90 font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              100% Free Peer Learning
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-indigo-300 shrink-0" />
              Group Study (3-4 Peers)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
              Live Classroom Meets
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Coins className="w-4 h-4 text-amber-300 fill-current shrink-0" />
              Earn 5 Credits When You Teach
            </span>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3 CORE FEATURE CARDS */}
      {/* ============================================================ */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-purple-800">Everything In One Ecosystem</span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How Nexathon Empowers Students</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Learn Skills */}
          <div 
            onClick={() => onNavigate('learn')}
            className="glass-card rounded-3xl p-7 sm:p-8 border border-purple-100 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                  Tuition Free
                </span>
              </div>
              <h3 className="font-heading text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                1. Learn Skills
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover verified students who can teach the exact skills you want to learn — from Figma & UI design to Flutter, Django, and Java. Pay ₹0 in course tuition.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-purple-700 gap-1 group-hover:gap-2 transition-all">
              <span>Find Peer Teachers</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Earn Credits */}
          <div 
            onClick={() => onNavigate('credits')}
            className="glass-card rounded-3xl p-7 sm:p-8 border border-indigo-100 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <Coins className="w-7 h-7 fill-current" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  5c Per Session
                </span>
              </div>
              <h3 className="font-heading text-xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                2. Earn Credits
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teach others what you already know and earn <strong>5 learning credits</strong> per completed session. Spend credits to unlock other peer matches or top up 5 credits for just ₹10.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-700 gap-1 group-hover:gap-2 transition-all">
              <span>View Credit Wallet</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Buy & Sell Books */}
          <div 
            onClick={() => onNavigate('marketplace')}
            className="glass-card rounded-3xl p-7 sm:p-8 border border-amber-100 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <BookOpen className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                  2% Platform Fee
                </span>
              </div>
              <h3 className="font-heading text-xl font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                3. Buy & Sell Books
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find affordable textbooks or sell books you no longer need. Features a transparent <strong>2% platform commission</strong> (e.g. ₹10 on a ₹500 book) to support campus education.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-amber-800 gap-1 group-hover:gap-2 transition-all">
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS */}
      {/* ============================================================ */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl mb-8 space-y-1.5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Simple Exchange Workflow</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black">How Nexathon Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-purple-500/40 transition-colors">
            <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center">1</span>
            <h4 className="font-bold text-sm text-white">Find a Peer Mentor</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browse students verified in Figma, Python, Flutter, Django, and other campus subjects.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-indigo-500/40 transition-colors">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center">2</span>
            <h4 className="font-bold text-sm text-white">Apply for a Session</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use 2 credits to request a 1-on-1 session online or in-person on campus. Course tuition is ₹0.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-amber-500/40 transition-colors">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">3</span>
            <h4 className="font-bold text-sm text-white">Teach & Earn Credits</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Share what you know with juniors or peers and receive 5 learning credits when a session completes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-emerald-500/40 transition-colors">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">4</span>
            <h4 className="font-bold text-sm text-white">Exchange Textbooks</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Buy or sell course books easily. Both the buyer and seller get +2 bonus credits on every book trade!
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURED SKILLS PILLS */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Popular Skills on Campus</h2>
            <p className="text-xs text-slate-500">Discover skills student peers are actively sharing.</p>
          </div>
          <button
            onClick={() => onNavigate('learn')}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>View All Skills</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {skillsList.map((skill, i) => (
            <div
              key={i}
              onClick={() => onNavigate('learn')}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
            >
              <span className="text-2xl">{skill.icon}</span>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">{skill.name}</h4>
                <span className="text-[10px] text-slate-500">{skill.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* RECENTLY LISTED BOOKS */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Recently Listed Textbooks</h2>
            <p className="text-xs text-slate-500">Verified second-hand books with transparent 2% platform commission.</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
          >
            <span>Explore All Books</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featuredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onNavigate('marketplace')}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img 
                    src={book.images[0]} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[10px] font-bold backdrop-blur-sm">
                    {book.condition}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                    {book.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 mt-0.5">
                    {book.title}
                  </h4>
                  {book.author && (
                    <p className="text-[11px] text-slate-500">By {book.author}</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900">₹{book.price}</span>
                  <span className="text-[11px] text-slate-400 line-through ml-1.5">
                    ₹{book.originalReferencePrice}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700">View Book &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS (CLEARLY MARKED AS SAMPLE CONTENT) */}
      {/* ============================================================ */}
      <section className="bg-purple-50/60 rounded-3xl p-8 border border-purple-100 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200 inline-block">
            Sample Content &bull; Demo Testimonials
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">What Students Say About Nexathon</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-3 text-xs shadow-sm">
            <p className="text-slate-600 italic leading-relaxed">
              "I taught Figma to a junior and earned 5 credits. The next day, I used those credits to learn Flutter with Anju. Never paid a single rupee for costly bootcamps!"
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center text-xs">
                AH
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Adil Hassan</span>
                <span className="text-[10px] text-slate-400">CS 3rd Year &bull; Sample Student</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-3 text-xs shadow-sm">
            <p className="text-slate-600 italic leading-relaxed">
              "Buying my Core Java textbook for ₹500 saved me ₹750 compared to the bookstore. Knowing the 2% fee goes to keeping the app verified makes it super trustworthy."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 font-bold flex items-center justify-center text-xs">
                AS
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Anu Susan</span>
                <span className="text-[10px] text-slate-400">IT 3rd Year &bull; Sample Student</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-3 text-xs shadow-sm">
            <p className="text-slate-600 italic leading-relaxed">
              "The 3-way circular learning loop matched me automatically. I taught mobile UI and learned Django backend without scheduling friction."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs">
                AK
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Anju Kurian</span>
                <span className="text-[10px] text-slate-400">CS 4th Year &bull; Sample Student</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL GET STARTED CTA */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 border border-purple-700/50 relative overflow-hidden">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Ready to Learn, Teach, and Exchange?
        </h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto">
          Join your college peer community on Nexathon. Learn in-demand tech and design skills from fellow students with zero course fees.
        </p>
        <button
          onClick={() => onNavigate('learn')}
          className="px-8 py-3.5 bg-white text-slate-950 font-black text-xs rounded-2xl hover:bg-slate-100 shadow-xl transition-all inline-flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4 text-purple-700" />
          <span>Get Started Free — Explore Skills</span>
        </button>
      </section>

    </div>
  );
};
