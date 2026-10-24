import React, { useState } from 'react';
import { 
  Coins, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Trash2,
  ExternalLink,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    listings, 
    learningSessions, 
    allUsers, 
    creditTransactions, 
    notifications,
    setFakePaymentModalOpen,
    setPendingUnlockTeacherId,
    deleteListing
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'books' | 'credits'>('overview');

  // Associated records
  const myListings = listings.filter(b => b.sellerId === currentUser.id);
  const mySessions = learningSessions.filter(s => s.mentorId === currentUser.id || s.learnerId === currentUser.id);
  const pendingRequests = mySessions.filter(s => s.status === 'pending');
  const upcomingSessions = mySessions.filter(s => s.status === 'upcoming');
  const recommendedTeachers = allUsers.filter(u => u.id !== currentUser.id).slice(0, 3);
  const recentBooks = listings.slice(0, 3);
  const myRecentCredits = creditTransactions.filter(t => t.userId === currentUser.id).slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-white/20 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-slate-950 rounded-full ring-2 ring-white">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight">{currentUser.name}</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Student Member
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 capitalize">
                  {currentUser.role}
                </span>
              </div>

              <p className="text-xs text-indigo-200 font-medium">
                {currentUser.course} &bull; {currentUser.department} ({currentUser.academicYear})
              </p>
              <p className="text-[11px] text-indigo-300">
                {currentUser.institution}
              </p>
            </div>
          </div>

          {/* Wallet Balance Pill */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center sm:text-right flex items-center sm:flex-col justify-between w-full sm:w-auto gap-4 sm:gap-1">
            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
              Learning Credit Balance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-300">{currentUser.credits}</span>
              <span className="text-xs font-bold text-white">Credits</span>
            </div>
            <button
              onClick={() => {
                setPendingUnlockTeacherId(null);
                setFakePaymentModalOpen(true);
              }}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] rounded-lg shadow-sm transition-all"
            >
              Top Up (5 for ₹10)
            </button>
          </div>
        </div>

        {/* Quick Action Buttons (Prompt Section 7) */}
        <div className="pt-6 border-t border-white/10 mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
          <button
            onClick={() => onNavigate('learn')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add a Skill</span>
          </button>

          <button
            onClick={() => onNavigate('learn')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-indigo-300" />
            <span>Find a Teacher</span>
          </button>

          <button
            onClick={() => onNavigate('learn')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-300" />
            <span>Schedule Session</span>
          </button>

          <button
            onClick={() => onNavigate('marketplace')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Sell a Book</span>
          </button>

          <button
            onClick={() => onNavigate('credits')}
            className="p-2.5 rounded-xl bg-amber-400/90 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1"
          >
            <Coins className="w-3.5 h-3.5 fill-current" />
            <span>View My Credits</span>
          </button>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
        <span className="font-medium">
          <strong>Demo Mode Active:</strong> Sample student profile, simulated credits, and book exchange activity.
        </span>
        <span className="text-[10px] bg-purple-200 text-purple-950 font-bold px-2 py-0.5 rounded">
          Hackathon Preview
        </span>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Skills, Sessions, Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Skills I Can Teach */}
            <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-700" />
                  Skills I Can Teach
                </h3>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  +5 Credits/Session
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {currentUser.skillsCanTeach.map((s, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-bold text-xs border border-purple-200 flex items-center gap-1"
                  >
                    <span>{s.name}</span>
                    <span className="text-[9px] font-normal text-purple-600">({s.level})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills I Want to Learn */}
            <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-700" />
                  Skills I Want to Learn
                </h3>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  ₹0 Course Fee
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {currentUser.skillsWantToLearn.map((s, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-bold text-xs border border-indigo-200 flex items-center gap-1"
                  >
                    <span>{s.name}</span>
                    <span className="text-[9px] font-normal text-indigo-600">({s.level})</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Pending Session Requests */}
          {pendingRequests.length > 0 && (
            <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Pending Session Requests ({pendingRequests.length})
                </h3>
                <button
                  onClick={() => onNavigate('learn')}
                  className="text-[11px] font-bold text-amber-900 underline"
                >
                  Manage in My Sessions &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {pendingRequests.map(s => (
                  <div key={s.id} className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{s.topic}</span>
                      <p className="text-[11px] text-slate-500">
                        {s.mentorId === currentUser.id ? `Learner: ${s.learnerName}` : `Teacher: ${s.mentorName}`} • {s.scheduledDate}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Pending Action
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Learning Sessions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-700" />
                Upcoming Learning Sessions ({upcomingSessions.length})
              </h3>
              <button
                onClick={() => onNavigate('learn')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900"
              >
                View All &rarr;
              </button>
            </div>

            {upcomingSessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming sessions. Discover a teacher to schedule one!</p>
            ) : (
              <div className="space-y-3 text-xs">
                {upcomingSessions.map(s => (
                  <div key={s.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{s.topic}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        With {s.mentorId === currentUser.id ? s.learnerName : s.mentorName} &bull; {s.scheduledDate} ({s.timeSlot})
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                      100% Free Peer Learning
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Teachers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Recommended Teachers</h3>
                <p className="text-xs text-slate-500">Peers who teach what you want to learn.</p>
              </div>
              <button
                onClick={() => onNavigate('learn')}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900"
              >
                Explore All &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recommendedTeachers.map(teacher => (
                <div key={teacher.id} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-center space-y-2">
                  <img 
                    src={teacher.avatar} 
                    alt={teacher.name} 
                    className="w-12 h-12 rounded-full object-cover mx-auto ring-2 ring-purple-200"
                  />
                  <h4 className="font-extrabold text-xs text-slate-900">{teacher.name}</h4>
                  <span className="text-[10px] text-purple-700 font-bold block">
                    {teacher.skillsCanTeach.map(s => s.name).slice(0, 2).join(', ')}
                  </span>
                  <button
                    onClick={() => onNavigate('learn')}
                    className="w-full py-1.5 bg-purple-900 text-white font-bold text-[10px] rounded-lg"
                  >
                    View Match
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Notifications & Listed Books */}
        <div className="space-y-6">
          
          {/* Notifications & Recent Activity */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Recent Notifications
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Live</span>
            </div>

            <div className="space-y-3 text-xs">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* My Book Listings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-700" />
                My Listed Books ({myListings.length})
              </h3>
              <button
                onClick={() => onNavigate('marketplace')}
                className="text-xs font-bold text-purple-700"
              >
                + Sell Book
              </button>
            </div>

            {myListings.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">You haven't listed any books yet.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {myListings.map(b => (
                  <div key={b.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 line-clamp-1">{b.title}</span>
                      <span className="text-[11px] text-slate-500">₹{b.price} &bull; {b.condition}</span>
                    </div>
                    <button
                      onClick={() => deleteListing(b.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
