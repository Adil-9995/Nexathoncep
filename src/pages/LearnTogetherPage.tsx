import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Sparkles, 
  Repeat, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  X, 
  Check, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  Award,
  Video,
  MapPin,
  RefreshCw,
  Zap,
  Info,
  Lock,
  Unlock,
  Coins,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { computeSmartSkillMatches } from '../utils/matchingAlgorithm';
import { SkillEntry, LearningFormat, LearningSession, LearningMatch } from '../types';

export const LearnTogetherPage: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    addSkillToTeach, 
    addSkillToLearn, 
    removeSkill,
    learningSessions, 
    requestSession,
    acceptSession,
    rejectSession,
    confirmSessionCompletion,
    unlockMatch,
    isMatchUnlocked,
    setFakePaymentModalOpen,
    setPendingUnlockTeacherId
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'matches' | 'teachers' | 'my_skills' | 'sessions'>('matches');

  // Skill Search & Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isScanning, setIsScanning] = useState(false);

  // New Skill Inputs
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newTeachLevel, setNewTeachLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newTeachDesc, setNewTeachDesc] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [newLearnLevel, setNewLearnLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  // Schedule Session Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [targetTeacherId, setTargetTeacherId] = useState<string>('user-anu');
  const [targetSkillName, setTargetSkillName] = useState<string>('Django');
  const [sessionDate, setSessionDate] = useState('2026-10-28');
  const [sessionTime, setSessionTime] = useState('6:00 PM - 7:00 PM');
  const [sessionFormat, setSessionFormat] = useState<'Online Video' | 'Campus In-Person'>('Online Video');
  const [sessionNotes, setSessionNotes] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const categories = [
    'All',
    'Figma',
    'Django',
    'Canva',
    'Flutter',
    'Python',
    'Java',
    'Web Development',
    'UI/UX Design',
    'Graphic Design',
    'Video Editing'
  ];

  // Compute smart matches using real deterministic rule-based algorithm
  const matches = useMemo(() => {
    return computeSmartSkillMatches(currentUser, allUsers);
  }, [currentUser, allUsers]);

  // Teachers directory
  const availableTeachers = allUsers.filter(u => u.id !== currentUser.id && u.skillsCanTeach.length > 0);

  const filteredTeachers = availableTeachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.skillsCanTeach.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      teacher.institution.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || 
      teacher.skillsCanTeach.some(s => s.name.toLowerCase().includes(selectedCategory.toLowerCase()) || (s.category && s.category.toLowerCase().includes(selectedCategory.toLowerCase())));

    return matchesSearch && matchesCat;
  });

  const handleAddTeach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeachSkill.trim()) return;
    addSkillToTeach({
      name: newTeachSkill.trim(),
      level: newTeachLevel,
      category: 'Programming',
      description: newTeachDesc || undefined
    });
    setNewTeachSkill('');
    setNewTeachDesc('');
  };

  const handleAddLearn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnSkill.trim()) return;
    addSkillToLearn({
      name: newLearnSkill.trim(),
      level: newLearnLevel,
      category: 'Skill Discovery'
    });
    setNewLearnSkill('');
  };

  const triggerAlgorithmScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = requestSession(
      targetTeacherId,
      targetSkillName,
      sessionDate,
      sessionTime,
      sessionFormat,
      sessionNotes
    );
    if (result && !result.success) {
      setStatusNotification(result.message || 'Unable to book session.');
      return;
    }
    setBookingSuccessMsg(true);
    setTimeout(() => {
      setBookingSuccessMsg(false);
      setScheduleModalOpen(false);
      setActiveTab('sessions');
    }, 1200);
  };

  const handleUnlockTeacher = (teacherId: string) => {
    const result = unlockMatch(teacherId);
    if (!result.success) {
      setStatusNotification(result.message);
      setTimeout(() => setStatusNotification(null), 4000);
    }
  };

  // Sessions filtering
  const mySessions = learningSessions.filter(
    s => s.mentorId === currentUser.id || s.learnerId === currentUser.id
  );
  const pendingSessions = mySessions.filter(s => s.status === 'pending');
  const upcomingSessions = mySessions.filter(s => s.status === 'upcoming');
  const completedSessions = mySessions.filter(s => s.status === 'completed');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
              Peer Skill Exchange Engine
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Balance: <strong className="text-purple-700">{currentUser.credits} Credits</strong>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Learn Skills & Find Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Zero course fees. Unlock peer matches for <strong>2 credits</strong> (or top up 5 credits for ₹10) and learn directly from fellow students.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setPendingUnlockTeacherId(null);
              setFakePaymentModalOpen(true);
            }}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5 text-indigo-600 fill-current" />
            <span>Top Up 5 Credits (₹10)</span>
          </button>

          <button
            onClick={triggerAlgorithmScan}
            disabled={isScanning}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Network...' : 'Recalculate Matches'}</span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification */}
      {statusNotification && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{statusNotification}</span>
          </div>
          <button 
            onClick={() => setStatusNotification(null)}
            className="text-amber-700 hover:text-amber-900 font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Platform Guidelines */}
      <div className="p-4 rounded-3xl bg-purple-50/80 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900">Peer Learning Guidelines</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
              • 1-on-1 tutoring is <strong>₹0 Free</strong> • <strong>2 Credits</strong> to request a session • Earn <strong>5 Credits</strong> when you teach • Get <strong>+2 Credits</strong> on textbook trades.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-purple-900 bg-purple-200/60 px-3 py-1 rounded-full">
            Campus Peer Network
          </span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'matches'
              ? 'bg-purple-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Smart Matching Cycles ({matches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'teachers'
              ? 'bg-purple-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Discover Teachers & Unlock Matches ({availableTeachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_skills')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'my_skills'
              ? 'bg-purple-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
          <span>My Teach & Learn Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'sessions'
              ? 'bg-purple-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>My Sessions ({mySessions.length})</span>
          {pendingSessions.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: SMART MATCHES (CIRCULAR 3-WAY & DIRECT SWAPS) */}
      {/* ============================================================ */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Algorithm-Detected Skill Exchange Loops
              </h2>
              <p className="text-xs text-slate-500">
                Deterministic matching connects what you can teach with what you want to learn.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
              {matches.length} Exchange Pathways Found
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Skill Loops Detected Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Add more skills you can teach or want to learn in the <strong>My Teach & Learn Profile</strong> tab to generate circular matching loops!
              </p>
              <button
                onClick={() => setActiveTab('my_skills')}
                className="mt-2 px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold"
              >
                Configure My Skills
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {matches.map((match) => (
                <div 
                  key={match.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        match.type === '3-way-cycle' 
                          ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {match.type === '3-way-cycle' ? '3-Way Circular Learning Loop' : 'Direct 2-Way Skill Swap'}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {match.compatibilityScore}% Compatibility
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">
                      Zero Cost • Peer-to-Peer
                    </span>
                  </div>

                  {/* Flow Diagram of Nodes */}
                  <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {match.nodes.map((node, index) => {
                      const isMe = node.studentId === currentUser.id;
                      const unlocked = isMatchUnlocked(node.studentId);

                      return (
                        <div 
                          key={index}
                          className={`p-4 rounded-2xl border transition-all relative ${
                            isMe 
                              ? 'bg-purple-50/70 border-purple-200 ring-2 ring-purple-500/20' 
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img 
                              src={node.studentAvatar} 
                              alt={node.studentName} 
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                            />
                            <div className="text-xs">
                              <span className="font-bold text-slate-900 block">
                                {node.studentName} {isMe && '(You)'}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                                {node.college}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Teaches:</span>
                              <span className="font-extrabold text-purple-700">{node.teachesSkill}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Learns:</span>
                              <span className="font-extrabold text-indigo-700">{node.learnsSkill}</span>
                            </div>
                          </div>

                          {/* Individual Match Unlock Button if not me */}
                          {!isMe && (
                            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                              <span className="text-[10px] text-slate-500">
                                {unlocked ? 'Match Unlocked' : '2 Credits Needed'}
                              </span>
                              {unlocked ? (
                                <button
                                  onClick={() => {
                                    setTargetTeacherId(node.studentId);
                                    setTargetSkillName(node.teachesSkill);
                                    setScheduleModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white font-bold text-[10px] rounded-lg shadow-sm"
                                >
                                  Book Session
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUnlockTeacher(node.studentId)}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[10px] rounded-lg flex items-center gap-1 shadow-sm"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>Unlock Match</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Match Reasons */}
                  <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100/80 text-xs text-purple-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      Algorithmic Match Verification:
                    </p>
                    <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                      {match.matchReasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: DISCOVER TEACHERS & AREA TO CHOOSE A MATCH */}
      {/* ============================================================ */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          
          {/* Search & Category Filter Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by skill (Figma, Django, Flutter...), teacher name, or college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => {
              const unlocked = isMatchUnlocked(teacher.id);

              return (
                <div 
                  key={teacher.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Lock Watermark Badge if not unlocked */}
                  {!unlocked && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>2 Credits to Unlock</span>
                    </div>
                  )}

                  {unlocked && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <Unlock className="w-3 h-3" />
                      <span>Match Unlocked</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Teacher Header */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={teacher.avatar} 
                        alt={teacher.name} 
                        className={`w-14 h-14 rounded-2xl object-cover ring-2 shadow-sm ${
                          unlocked ? 'ring-purple-500/20' : 'ring-slate-200 filter blur-[0.5px]'
                        }`}
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-slate-900 text-sm">
                            {teacher.name}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
                        </div>
                        <p className="text-[11px] text-slate-500">{teacher.course}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{teacher.institution}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className={`text-xs leading-relaxed ${
                      unlocked ? 'text-slate-600' : 'text-slate-400 select-none filter blur-[1px]'
                    }`}>
                      {teacher.bio}
                    </p>

                    {/* Skills Can Teach */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Skills Offered (Free Tuition):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.skillsCanTeach.map((skill, i) => (
                          <span 
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 text-xs font-extrabold border border-purple-200 flex items-center gap-1"
                          >
                            <span>{skill.name}</span>
                            <span className="text-[9px] font-normal text-purple-600">({skill.level})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Availability / Formats */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Preferred Format:</span>
                        <span className="font-bold text-slate-700">{teacher.preferredFormat}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Available:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                          {teacher.availableDays.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    {unlocked ? (
                      <button
                        onClick={() => {
                          setTargetTeacherId(teacher.id);
                          setTargetSkillName(teacher.skillsCanTeach[0]?.name || 'Skill');
                          setScheduleModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 bg-purple-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Request 1-on-1 Session</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleUnlockTeacher(teacher.id)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-300" />
                          <span>Unlock Match (2 Credits)</span>
                        </button>
                        <p className="text-[10px] text-center text-slate-400">
                          Low balance? Instant ₹10 pack adds 5 credits!
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: MY TEACH & LEARN PROFILE */}
      {/* ============================================================ */}
      {activeTab === 'my_skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column A: Skills I Can Teach */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-700" />
                  Skills I Can Teach (+5 Credits / Session)
                </h3>
                <p className="text-xs text-slate-500">Share your knowledge with fellow students.</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                {currentUser.skillsCanTeach.length}
              </span>
            </div>

            {/* List of current teaching skills */}
            <div className="space-y-2.5">
              {currentUser.skillsCanTeach.map((skill, index) => (
                <div key={index} className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-purple-950">{skill.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-purple-700 border border-purple-200">
                        {skill.level}
                      </span>
                    </div>
                    {skill.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{skill.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeSkill('teach', skill.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Teaching Skill Form */}
            <form onSubmit={handleAddTeach} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Register a New Skill to Teach</span>
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="e.g. Canva, Python, Video Editing..."
                  value={newTeachSkill}
                  onChange={(e) => setNewTeachSkill(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <select
                  value={newTeachLevel}
                  onChange={(e) => setNewTeachLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
                >
                  <option value="Beginner">Proficiency: Beginner</option>
                  <option value="Intermediate">Proficiency: Intermediate</option>
                  <option value="Advanced">Proficiency: Advanced</option>
                </select>
                <input
                  type="text"
                  placeholder="Brief note on what you can help with..."
                  value={newTeachDesc}
                  onChange={(e) => setNewTeachDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teaching Skill</span>
              </button>
            </form>
          </div>

          {/* Column B: Skills I Want to Learn */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-700" />
                  Skills I Want to Learn
                </h3>
                <p className="text-xs text-slate-500">Matches will be generated based on these goals.</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                {currentUser.skillsWantToLearn.length}
              </span>
            </div>

            {/* List of current learning interests */}
            <div className="space-y-2.5">
              {currentUser.skillsWantToLearn.map((skill, index) => (
                <div key={index} className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-indigo-950">{skill.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200">
                        {skill.level} Target
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSkill('learn', skill.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Learning Skill Form */}
            <form onSubmit={handleAddLearn} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Add a Skill You Want to Learn</span>
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="e.g. Flutter, Django, UI/UX..."
                  value={newLearnSkill}
                  onChange={(e) => setNewLearnSkill(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <select
                  value={newLearnLevel}
                  onChange={(e) => setNewLearnLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
                >
                  <option value="Beginner">Target Level: Beginner</option>
                  <option value="Intermediate">Target Level: Intermediate</option>
                  <option value="Advanced">Target Level: Advanced</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Learning Interest</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: MY SESSIONS & MUTUAL COMPLETION FLOW */}
      {/* ============================================================ */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          
          {/* Section: Pending Session Requests */}
          {pendingSessions.length > 0 && (
            <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Pending Session Requests ({pendingSessions.length})
                </h3>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>

              <div className="space-y-3">
                {pendingSessions.map((session) => {
                  const isMentor = session.mentorId === currentUser.id;

                  return (
                    <div key={session.id} className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{session.topic}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                            {session.skillName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {isMentor ? `Learner: ${session.learnerName}` : `Teacher: ${session.mentorName}`} • Date: {session.scheduledDate} ({session.timeSlot}) • {session.format}
                        </p>
                        {session.notes && (
                          <p className="text-[11px] text-slate-600 italic">"{session.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isMentor ? (
                          <>
                            <button
                              onClick={() => acceptSession(session.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm text-xs flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept & Earn 5 Credits</span>
                            </button>
                            <button
                              onClick={() => rejectSession(session.id)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-3 py-1 rounded-xl">
                            Awaiting Teacher Confirmation
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Upcoming Sessions with Mutual Confirm */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-700" />
              Upcoming Learning Sessions ({upcomingSessions.length})
            </h3>

            {upcomingSessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No upcoming sessions scheduled right now. Discover teachers to book a session!
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((session) => {
                  const isMentor = session.mentorId === currentUser.id;
                  const myRole = isMentor ? 'mentor' : 'learner';
                  const confirmedByMe = isMentor ? session.confirmedByMentor : session.confirmedByLearner;

                  return (
                    <div key={session.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{session.topic}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                            Upcoming
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Partner: <strong className="text-slate-800">{isMentor ? session.learnerName : session.mentorName}</strong> • Date: {session.scheduledDate} ({session.timeSlot}) • {session.format}
                        </p>
                      </div>

                      {/* Mutual Confirmation Mechanism */}
                      <div className="flex items-center gap-2 shrink-0">
                        {confirmedByMe ? (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200 text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>You Confirmed Completion</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => confirmSessionCompletion(session.id, myRole)}
                            className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-sm text-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Session Completed</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Completed Sessions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Completed Session History ({completedSessions.length})
            </h3>

            {completedSessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No completed sessions yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {completedSessions.map((s) => (
                  <div key={s.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{s.topic}</span>
                      <p className="text-[11px] text-slate-500">
                        {s.mentorId === currentUser.id ? `Taught to ${s.learnerName} (+5 Credits Awarded)` : `Learned from ${s.mentorName} (₹0 Free)`} • {s.scheduledDate}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      100% Free Peer Learning
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SCHEDULE 1-ON-1 SESSION MODAL */}
      {/* ============================================================ */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Request 1-on-1 Learning Session</h3>
                <p className="text-xs text-slate-500">Peer course fees are ₹0. 5 credits transferred upon mutual completion.</p>
              </div>
              <button 
                onClick={() => setScheduleModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccessMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Session Request Sent!</h4>
                <p className="text-xs text-slate-500">
                  Notification delivered to teacher. Check "My Sessions" tab for confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Skill</label>
                  <input
                    type="text"
                    value={targetSkillName}
                    onChange={(e) => setTargetSkillName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Date</label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Time Slot</label>
                    <input
                      type="text"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      placeholder="e.g. 6:00 PM - 7:00 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Delivery Format</label>
                  <select
                    value={sessionFormat}
                    onChange={(e) => setSessionFormat(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Online Video">Online Video Call (Google Meet / Zoom)</option>
                    <option value="Campus In-Person">Campus In-Person (Library / Tech Hub)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Session Goals / Notes</label>
                  <textarea
                    rows={2}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Specific questions or topics you'd like to cover..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900">Course Tuition:</span>
                    <span className="font-black text-emerald-700">₹0 Free (Peer Mentorship)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-200/60">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span>Session Application Cost:</span>
                    </span>
                    <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      -2 Credits
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>Your Current Balance:</span>
                    <span className="font-bold text-slate-900">{currentUser.credits} Credits</span>
                  </div>
                </div>

                {currentUser.credits < 2 && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    You have insufficient credits ({currentUser.credits}c). You need at least 2 credits to apply.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={currentUser.credits < 2}
                  className="w-full py-3 bg-purple-900 hover:bg-slate-950 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirm & Apply (-2 Credits)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
