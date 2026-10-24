import React, { useState } from 'react';
import { 
  Sparkles, 
  Repeat, 
  BookOpen, 
  Users, 
  ArrowRight, 
  X, 
  CheckCircle2,
  HeartHandshake,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PostTransactionModalProps {
  onNavigateToLearn: () => void;
  onNavigateToDashboard: () => void;
}

export const PostTransactionModal: React.FC<PostTransactionModalProps> = ({ 
  onNavigateToLearn,
  onNavigateToDashboard 
}) => {
  const { 
    postTransactionModalOpen, 
    setPostTransactionModalOpen, 
    lastCompletedTransaction,
    currentUser,
    addSkillToTeach,
    addSkillToLearn
  } = useApp();

  const [step, setStep] = useState<'invite' | 'add_skills'>('invite');
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');

  if (!postTransactionModalOpen || !lastCompletedTransaction) return null;

  const isBuyer = currentUser.id === lastCompletedTransaction.buyerId;

  const handleAddSkillsAndSearch = () => {
    if (newTeachSkill.trim()) {
      addSkillToTeach({ name: newTeachSkill.trim(), level: 'Intermediate' });
    }
    if (newLearnSkill.trim()) {
      addSkillToLearn({ name: newLearnSkill.trim(), level: 'Beginner' });
    }
    setPostTransactionModalOpen(false);
    onNavigateToLearn();
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
        
        {/* Decorative Top Accent Banner */}
        <div className="bg-gradient-to-r from-forest-800 via-emerald-700 to-teal-700 p-6 text-white relative">
          <button
            onClick={() => setPostTransactionModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3 shadow-inner">
            <HeartHandshake className="w-6 h-6 text-emerald-200" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 bg-white/10 px-2.5 py-1 rounded-full">
            Circular Loop Completed
          </span>

          <h3 className="text-xl font-extrabold mt-2 tracking-tight">
            Resource Reused Successfully!
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
            {isBuyer 
              ? `You saved ₹${lastCompletedTransaction.estimatedStudentSavings} on "${lastCompletedTransaction.listingTitle}".`
              : `You passed on "${lastCompletedTransaction.listingTitle}" to a fellow student.`}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'invite' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-forest-50/80 border border-forest-100 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold">
                  <Repeat className="w-3.5 h-3.5 text-emerald-700" />
                  <span>The CampusLoop Philosophy</span>
                </div>
                <h4 className="text-base font-extrabold text-forest-950">
                  “Your exchange helped a resource find a new home. Want to grow your skills next?”
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Every transaction creates an opportunity to learn. Connect with compatible peers across campus who can teach what you want to learn — 100% free.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setPostTransactionModalOpen(false);
                    onNavigateToLearn();
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-forest-700 to-emerald-600 hover:from-forest-800 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-forest-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Users className="w-4 h-4" />
                  <span>Discover Learning Partners (Smart Cycle)</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => setStep('add_skills')}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4 text-slate-500" />
                  <span>Add or Update My Skills First</span>
                </button>

                <button
                  onClick={() => {
                    setPostTransactionModalOpen(false);
                    onNavigateToDashboard();
                  }}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 text-center transition-colors"
                >
                  Maybe Later (View My Transaction Receipt)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Configure Your Learning Interests</h4>
                <p className="text-xs text-slate-500">Tell CampusLoop what you can share and what you want to learn.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    A Skill You Can Share or Teach
                  </label>
                  <input
                    type="text"
                    value={newTeachSkill}
                    onChange={(e) => setNewTeachSkill(e.target.value)}
                    placeholder="e.g. Python, Figma, Video Editing, Calculus"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Currently offering: {currentUser.skillsCanTeach.map(s => s.name).join(', ') || 'None yet'}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    A Skill You Want to Learn For Free
                  </label>
                  <input
                    type="text"
                    value={newLearnSkill}
                    onChange={(e) => setNewLearnSkill(e.target.value)}
                    placeholder="e.g. Flutter, React, Public Speaking, Data Science"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Currently seeking: {currentUser.skillsWantToLearn.map(s => s.name).join(', ') || 'None yet'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setStep('invite')}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={handleAddSkillsAndSearch}
                  className="flex-1 py-2.5 px-4 bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Save & Run Skill Matcher</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Voluntary Disclaimer */}
          <p className="text-[10px] text-slate-400 text-center mt-4 border-t border-slate-100 pt-3">
            Note: Peer learning is completely free and 100% voluntary. Purchasing an item does not obligate you to teach or schedule sessions.
          </p>
        </div>
      </div>
    </div>
  );
};
