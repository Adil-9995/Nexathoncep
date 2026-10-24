import React from 'react';
import { Coins, CheckCircle2, AlertCircle, X, Sparkles, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CreditToast: React.FC = () => {
  const { creditAlert, dismissCreditAlert } = useApp();

  if (!creditAlert) return null;

  const isAdded = creditAlert.type === 'added';
  const isDeducted = creditAlert.type === 'deducted';

  return (
    <aside 
      aria-label="Credit balance notification"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-3 fade-in duration-300"
    >
      <div 
        className={`p-4 rounded-2xl shadow-xl border backdrop-blur-xl flex items-start gap-3.5 ${
          isAdded 
            ? 'bg-emerald-950/90 text-white border-emerald-500/50 shadow-emerald-950/20 ring-1 ring-emerald-400/30' 
            : isDeducted
              ? 'bg-slate-900/95 text-white border-purple-500/50 shadow-purple-950/20 ring-1 ring-purple-400/30'
              : 'bg-rose-950/90 text-white border-rose-500/50'
        }`}
      >
        {/* Icon Pill */}
        <div 
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isAdded 
              ? 'bg-emerald-500/20 text-emerald-300' 
              : isDeducted
                ? 'bg-purple-500/20 text-amber-300'
                : 'bg-rose-500/20 text-rose-300'
          }`}
        >
          {isAdded ? (
            <Coins className="w-5 h-5 fill-current animate-bounce" />
          ) : isDeducted ? (
            <ArrowDownRight className="w-5 h-5 text-amber-300" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span 
              className={`font-black text-xs uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isAdded 
                  ? 'bg-emerald-400/20 text-emerald-300 font-extrabold' 
                  : isDeducted
                    ? 'bg-amber-400/20 text-amber-300 font-extrabold'
                    : 'bg-rose-400/20 text-rose-300'
              }`}
            >
              {isAdded ? '+2 Credits Added' : isDeducted ? '-2 Credits Deducted' : 'Wallet Alert'}
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium leading-snug pt-0.5">
            {creditAlert.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={dismissCreditAlert}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
