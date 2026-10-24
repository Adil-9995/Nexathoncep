import React from 'react';
import { Sparkles, Coins, ArrowRight, X, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EarnedCreditModalProps {
  onNavigateToLearn: () => void;
}

export const EarnedCreditModal: React.FC<EarnedCreditModalProps> = ({ onNavigateToLearn }) => {
  const { earnedCreditPopupOpen, setEarnedCreditPopupOpen, currentUser } = useApp();

  if (!earnedCreditPopupOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-purple-100 flex flex-col relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Graphic */}
        <div className="bg-gradient-to-br from-purple-800 via-indigo-700 to-indigo-900 text-white p-8 relative overflow-hidden">
          <button 
            onClick={() => setEarnedCreditPopupOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 rounded-full bg-amber-400 text-purple-950 flex items-center justify-center mx-auto ring-8 ring-white/20 shadow-xl mb-4 animate-bounce">
            <Coins className="w-10 h-10 fill-current" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Teaching Milestones Unlocked</span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">
            You have earned 5 learning credits!
          </h3>
          <p className="text-sm font-semibold text-amber-200 mt-1">
            Ready to learn something new?
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Congratulations <strong>{currentUser.name}</strong>! Your student peer verified that you successfully taught them. <strong>+5 Learning Credits</strong> have been added to your Nexathon wallet (Current balance: <strong>{currentUser.credits} Credits</strong>).
          </p>

          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-around text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Earned</span>
              <span className="text-lg font-black text-purple-700">+5 Credits</span>
            </div>
            <div className="w-px h-8 bg-purple-200" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Match Cost</span>
              <span className="text-lg font-black text-indigo-700">2 Credits</span>
            </div>
            <div className="w-px h-8 bg-purple-200" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Course Fee</span>
              <span className="text-lg font-black text-emerald-700">₹0 Free</span>
            </div>
          </div>

          {/* Prompt Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                setEarnedCreditPopupOpen(false);
                onNavigateToLearn();
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Find a Teacher</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setEarnedCreditPopupOpen(false)}
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
