import React, { useState } from 'react';
import { 
  Coins, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Info,
  Clock,
  Zap,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyCreditsPage: React.FC<{ onNavigateToLearn: () => void }> = ({ onNavigateToLearn }) => {
  const { 
    currentUser, 
    creditTransactions, 
    setFakePaymentModalOpen, 
    setPendingUnlockTeacherId 
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  const myTransactions = creditTransactions.filter(t => t.userId === currentUser.id);
  const filteredTxs = myTransactions.filter(t => {
    if (filterType === 'earned') return t.amount > 0;
    if (filterType === 'spent') return t.amount < 0;
    return true;
  });

  const handleOpenTopUp = () => {
    setPendingUnlockTeacherId(null);
    setFakePaymentModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-full">
              Student Learning Wallet
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Account: {currentUser.name}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Learning Credits
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Earn credits by teaching skills you know. Spend credits to unlock peer matches and learn new skills.
          </p>
        </div>

        {/* Top-up Button */}
        <button
          onClick={handleOpenTopUp}
          className="px-5 py-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start md:self-auto group"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-current" />
          <span>Top Up 5 Credits for ₹10</span>
        </button>
      </div>

      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-7 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="space-y-1 relative">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400 fill-current" />
              Available Balance
            </span>
            <div className="flex items-baseline gap-2 pt-2">
              <h2 className="text-5xl font-black tracking-tight text-white">{currentUser.credits}</h2>
              <span className="text-sm font-bold text-amber-300">Credits</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs text-indigo-200 relative">
            <span>2 Credits needed per match</span>
            <span className="font-semibold text-white">
              {Math.floor(currentUser.credits / 2)} match{Math.floor(currentUser.credits / 2) === 1 ? '' : 'es'} ready
            </span>
          </div>
        </div>

        {/* Micro-Payment ₹10 Offer Card */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                App Match Pass
              </span>
              <span className="text-xs font-bold text-indigo-600">₹2 / credit</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">5 Credits for ₹10</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              For learning, students pay <strong>₹0 course fee</strong>. The tiny ₹10 fee sustains our verified platform infrastructure and unlocks peer matching.
            </p>
          </div>

          <button
            onClick={handleOpenTopUp}
            className="mt-4 w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-xl border border-indigo-200 transition-all flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulate ₹10 Payment</span>
          </button>
        </div>

        {/* Teaching & Book Rewards Rule Card */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
              Earn Free Credits
            </span>
            <h3 className="text-lg font-black text-slate-900">Teaching & Book Rewards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Earn <strong>5 credits</strong> when you teach a peer session, and earn <strong>+2 credits</strong> every time you buy or sell a textbook on the marketplace!
            </p>
          </div>

          <button
            onClick={onNavigateToLearn}
            className="mt-4 w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs rounded-xl border border-purple-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Explore Skills & Books</span>
          </button>
        </div>

      </div>

      {/* Credit Rules & Integrity Alert */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">100% Free Peer Learning</p>
            <p className="text-[11px] text-slate-500">Students exchange skills with ₹0 course tuition.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Coins className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">2 Credits per Session Application</p>
            <p className="text-[11px] text-slate-500">Deducts 2 credits when requesting a peer mentor.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">+2 Credits on Book Trades</p>
            <p className="text-[11px] text-slate-500">Both buyer and seller earn +2 bonus credits per transaction.</p>
          </div>
        </div>
      </div>

      {/* Credit Transaction History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Wallet Transaction History</h3>
            <p className="text-xs text-slate-500">Track all learning credits earned, spent on matches, and purchased packs.</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-all ${filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilterType('earned')}
              className={`px-3 py-1 rounded-lg transition-all ${filterType === 'earned' ? 'bg-white text-purple-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Earned (+)
            </button>
            <button
              onClick={() => setFilterType('spent')}
              className={`px-3 py-1 rounded-lg transition-all ${filterType === 'spent' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Spent (-)
            </button>
          </div>
        </div>

        {filteredTxs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No credit transactions found in this category.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTxs.map((tx) => (
              <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.amount > 0 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{tx.description}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {tx.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(tx.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-black ${
                    tx.amount > 0 ? 'text-purple-700' : 'text-slate-700'
                  }`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-semibold">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
