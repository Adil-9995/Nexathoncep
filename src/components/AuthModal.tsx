import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentUser, LearningFormat } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, switchUserById, setCurrentUser } = useApp();
  const [mode, setMode] = useState<'demo' | 'signup' | 'login'>('demo');

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('National Institute of Technology');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [department, setDepartment] = useState('School of Computing');
  const [academicYear, setAcademicYear] = useState('2nd Year');
  const [skillsTeach, setSkillsTeach] = useState('');
  const [skillsLearn, setSkillsLearn] = useState('');
  const [preferredFormat, setPreferredFormat] = useState<LearningFormat>('Hybrid');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full student name.');
      return;
    }
    if (!collegeEmail.trim() || !collegeEmail.includes('@')) {
      setErrorMsg('Please enter a valid student email address.');
      return;
    }

    const teachSkillsList = skillsTeach.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(name => ({ name, level: 'Intermediate' as const }));

    const learnSkillsList = skillsLearn.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(name => ({ name, level: 'Beginner' as const }));

    const newUser: StudentUser = {
      id: `user-${Date.now()}`,
      name: fullName.trim(),
      email: collegeEmail.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
      institution: institution.trim(),
      course: course.trim(),
      department: department.trim(),
      academicYear,
      isVerified: collegeEmail.endsWith('.edu') || collegeEmail.endsWith('.ac.in'),
      verificationStatus: collegeEmail.endsWith('.edu') || collegeEmail.endsWith('.ac.in') ? 'verified' : 'pending',
      skillsCanTeach: teachSkillsList.length > 0 ? teachSkillsList : [{ name: 'Figma', level: 'Intermediate' }],
      skillsWantToLearn: learnSkillsList.length > 0 ? learnSkillsList : [{ name: 'Flutter', level: 'Beginner' }],
      preferredFormat,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableTimeSlots: ['Evening (5 PM - 8 PM)'],
      bio: `Student at ${institution} enrolled in ${course}.`,
      credits: 5, // 5 Starter Credits!
      unlockedTeacherIds: [],
      completedSessionsCount: 0,
      itemsReusedCount: 0,
      moneySaved: 0,
      earnings: 0,
      rating: 5.0,
      role: 'student'
    };

    setCurrentUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">CampusLoop Student Portal</span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">
            {mode === 'demo' ? 'Quick Demo Persona Switcher' : mode === 'signup' ? 'Join CampusLoop' : 'Student Login'}
          </h3>
          <p className="text-xs text-indigo-100 mt-1">
            {mode === 'demo' 
              ? 'Switch between pre-configured hackathon demo profiles with 1 click.' 
              : 'Create your student account & receive 5 starter learning credits.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 mt-4 p-1 bg-black/20 rounded-xl text-xs font-bold">
            <button
              onClick={() => setMode('demo')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${mode === 'demo' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'}`}
            >
              Demo Personas
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${mode === 'signup' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'}`}
            >
              Student Sign Up
            </button>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${mode === 'login' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'}`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: DEMO PERSONAS */}
          {mode === 'demo' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Select a persona to test the platform:</span>
              <div className="space-y-2.5">
                {allUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => {
                      switchUserById(user.id);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-purple-600 hover:bg-purple-50/50 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-100" />
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 group-hover:text-purple-900">{user.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{user.course}</p>
                        <p className="text-[10px] text-purple-700 font-semibold">
                          Teaches: {user.skillsCanTeach.map(s => s.name).join(', ') || 'Faculty Moderator'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-amber-600 block">{user.credits}c</span>
                      <span className="text-[10px] text-indigo-700 font-bold group-hover:underline">Switch &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Adil Hassan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">College Email (.edu or .ac.in for verification) *</label>
                <input
                  type="email"
                  placeholder="e.g. adil@nit.edu"
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Course / Dept</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Skills You Can Teach (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Figma, Java, Python..."
                  value={skillsTeach}
                  onChange={(e) => setSkillsTeach(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Skills You Want to Learn (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Flutter, Django, UI/UX..."
                  value={skillsLearn}
                  onChange={(e) => setSkillsLearn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                <span className="font-bold text-purple-950">Starter Bonus:</span>
                <span className="text-xs font-black text-amber-600">+5 Learning Credits</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Create Account & Claim 5 Credits
              </button>
            </form>
          )}

          {/* TAB 3: LOGIN FORM */}
          {mode === 'login' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">College Email</label>
                <input
                  type="email"
                  defaultValue="adil.h@campusloop.edu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <button
                onClick={() => {
                  switchUserById('user-adil');
                  onClose();
                }}
                className="w-full py-3 bg-purple-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Sign In as Adil Hassan
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
