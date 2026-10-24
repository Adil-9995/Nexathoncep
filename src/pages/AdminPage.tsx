import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Coins, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Download, 
  Sliders, 
  BookOpen, 
  Users, 
  Lock,
  Building2,
  Trash2,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPage: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    listings, 
    transactions, 
    commissionRate, 
    setCommissionRate, 
    reports, 
    resolveReport, 
    switchUserById
  } = useApp();

  const [simulatedRate, setSimulatedRate] = useState<number>(commissionRate * 100);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Non-admins check
  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto my-12">
        <Lock className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">Restricted Admin Portal</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This section is reserved for campus faculty moderators and university administrators. To review moderation tools and revenue settings, please switch to <strong>Prof. Suresh Kumar (Admin)</strong>.
        </p>
        <button
          onClick={() => switchUserById('user-admin')}
          className="px-5 py-2.5 bg-purple-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-all"
        >
          Switch to Admin Persona
        </button>
      </div>
    );
  }

  const handleUpdateCommission = () => {
    setCommissionRate(simulatedRate / 100);
  };

  const handleExportCSV = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const totalVolume = transactions.reduce((acc, t) => acc + (t.price || 0), 0);
  const totalCommissionEarned = transactions.reduce((acc, t) => acc + (t.platformCommission || 0), 20);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
              University Affairs & Moderation
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Role: Faculty Administrator ({currentUser.name})
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Admin & Revenue Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage book marketplace commission rates, platform micro-passes, and academic integrity safety.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{downloadSuccess ? 'Report Generated!' : 'Export Platform Report (CSV)'}</span>
        </button>
      </div>

      {/* Admin Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Book Sales Volume</span>
          <h3 className="text-3xl font-black text-slate-900">₹{totalVolume.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">Across verified second-hand textbooks</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Commission (2%)</span>
          <h3 className="text-3xl font-black text-purple-700">₹{totalCommissionEarned.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">Automated campus escrow deduction</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Students</span>
          <h3 className="text-3xl font-black text-indigo-700">{allUsers.length} Members</h3>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">National Institute of Technology</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Moderation</span>
          <h3 className="text-3xl font-black text-amber-600">{pendingReports.length} Flagged</h3>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">Academic honesty reviews</p>
        </div>

      </div>

      {/* Commission Configuration Slider (Prompt Section 12) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-700" />
              Configure Marketplace Platform Commission Rate
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust the micro-commission charged on second-hand book transactions.
            </p>
          </div>
          <span className="text-sm font-black px-3 py-1 bg-purple-100 text-purple-900 rounded-xl">
            Active: {simulatedRate}%
          </span>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">1%</span>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="0.5"
              value={simulatedRate}
              onChange={(e) => setSimulatedRate(parseFloat(e.target.value))}
              className="flex-1 accent-purple-700 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-500">10%</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <span className="font-bold text-slate-800 block">Commission Impact Example on ₹500 Textbook:</span>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Buyer Pays:</span>
              <span className="font-bold">₹500</span>
            </div>
            <div className="flex justify-between text-purple-700 text-[11px] font-semibold">
              <span>Platform Receives ({simulatedRate}%):</span>
              <span>₹{Math.round(500 * (simulatedRate / 100))}</span>
            </div>
            <div className="flex justify-between text-emerald-700 text-[11px] font-bold border-t border-slate-200 pt-1">
              <span>Student Seller Payout:</span>
              <span>₹{500 - Math.round(500 * (simulatedRate / 100))}</span>
            </div>
          </div>

          <button
            onClick={handleUpdateCommission}
            className="px-5 py-2.5 bg-purple-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
          >
            Apply Rate Changes to Marketplace
          </button>
        </div>
      </div>

      {/* Moderation Reports Queue */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Flagged Academic Content & Moderation Queue ({reports.length})
        </h3>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No reported items.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{rep.targetTitle}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      {rep.targetType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{rep.reason}</p>
                  <p className="text-[10px] text-slate-400">Reported by: {rep.reporterName}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rep.status === 'resolved' ? (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolved</span>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => resolveReport(rep.id, 'remove_listing')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
                      >
                        Remove Content
                      </button>
                      <button
                        onClick={() => resolveReport(rep.id, 'dismiss')}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
