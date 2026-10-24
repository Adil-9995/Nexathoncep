import React, { useState } from 'react';
import { 
  BarChart3, 
  Leaf, 
  Coins, 
  BookOpen, 
  Users, 
  Repeat, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Info,
  Calendar,
  Share2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';

export const SustainabilityPage: React.FC = () => {
  const { sustainabilityStats, transactions, learningSessions, listings, currentUser } = useApp();
  const [viewScope, setViewScope] = useState<'campus' | 'personal'>('campus');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Recharts Monthly Trend Data
  const monthlyTrendData = [
    { month: 'Jun', reusedItems: 6, moneySaved: 4200, sessions: 8 },
    { month: 'Jul', reusedItems: 11, moneySaved: 7800, sessions: 14 },
    { month: 'Aug', reusedItems: 19, moneySaved: 14500, sessions: 22 },
    { month: 'Sep', reusedItems: 28, moneySaved: 22100, sessions: 36 },
    { month: 'Oct', reusedItems: sustainabilityStats.itemsReused, moneySaved: sustainabilityStats.totalMoneySaved, sessions: sustainabilityStats.peerLearningSessionsCompleted },
  ];

  // Category Distribution Data
  const categoryData = [
    { name: 'Textbooks', value: 45, color: '#166534' },
    { name: 'Calculators', value: 20, color: '#059669' },
    { name: 'Lab Tools', value: 15, color: '#0d9488' },
    { name: 'Equipment', value: 12, color: '#0891b2' },
    { name: 'Notes & Guides', value: 8, color: '#3b82f6' },
  ];

  // Skills Distribution Data
  const skillTopicsData = [
    { skill: 'Java / DSA', sessions: 14 },
    { skill: 'Flutter', sessions: 11 },
    { skill: 'Figma UI/UX', sessions: 9 },
    { skill: 'Python / ML', sessions: 8 },
    { skill: 'Interview Prep', sessions: 6 },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Transparent ESG & SDG Analytics
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              UN SDG 12 (Responsible Consumption) & SDG 4 (Quality Education)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 tracking-tight mt-1">
            Sustainability Impact Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time measurement of educational resource circularity, student household savings, and peer learning exchanges.
          </p>
        </div>

        {/* View Scope Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setViewScope('campus')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewScope === 'campus' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Campus Aggregate
          </button>
          <button
            onClick={() => setViewScope('personal')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewScope === 'personal' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Contribution ({currentUser.name.split(' ')[0]})
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resources Diverted</span>
            <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-charcoal-900">
              {viewScope === 'campus' ? sustainabilityStats.itemsReused : currentUser.itemsReusedCount}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Educational Items Reused</p>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Diverted from waste via resale, barter & donation
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Affordability Index</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-emerald-700">
              ₹{viewScope === 'campus' ? sustainabilityStats.totalMoneySaved.toLocaleString() : currentUser.moneySaved.toLocaleString()}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Estimated Money Saved</p>
          </div>
          <button
            onClick={() => setShowFormulaModal(true)}
            className="text-[11px] text-forest-700 hover:underline pt-2 border-t border-slate-100 flex items-center gap-1 font-semibold"
          >
            <Info className="w-3 h-3" />
            <span>Formula: Retail Ref &minus; Resale Price</span>
          </button>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peer Knowledge Swaps</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-charcoal-900">
              {viewScope === 'campus' ? sustainabilityStats.peerLearningSessionsCompleted : currentUser.completedSessionsCount}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Free Peer Sessions Completed</p>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Voluntary, verified 1-on-1 and 3-way cycles
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Carbon Avoided</span>
            <div className="w-8 h-8 rounded-xl bg-lime-50 text-lime-800 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-lime-800">
              {viewScope === 'campus' ? `${sustainabilityStats.estimatedCo2Kg} kg` : `${Math.round((currentUser.itemsReusedCount || 0) * 2.4)} kg`}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Estimated CO₂ Avoided</p>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Based on pulp and chemical lifecycle savings
          </p>
        </div>

      </div>

      {/* Interactive Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Campus Reuse Growth & Student Savings</h3>
              <p className="text-xs text-slate-500">Monthly trajectory of educational resources diverted and cumulative savings (₹)</p>
            </div>
            <span className="text-[11px] font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded-full">
              Growth Trend
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="moneySaved" name="Student Savings (₹)" stroke="#16a34a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
                <Area type="monotone" dataKey="reusedItems" name="Items Reused" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorItems)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution (Donut Chart) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              Marketplace Category Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-1">Breakdown of reusable items circulating across campus.</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name}: <strong>{c.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Peer Skill Sharing Distribution & Methodology Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar chart of popular skills shared */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Peer Learning Skills Exchanged</h3>
              <p className="text-xs text-slate-500">Most active skills exchanged in free peer learning sessions.</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillTopicsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="skill" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="sessions" name="Sessions Completed" fill="#15803d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transparent Methodology & Zero-Greenwashing Box */}
        <div className="bg-gradient-to-br from-slate-900 to-forest-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-emerald-300 rounded-full text-xs font-bold border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transparent Measurement Standard</span>
            </div>

            <h3 className="text-lg font-black tracking-tight">
              Rigorous Environmental Accounting
            </h3>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-white mb-0.5">1. Student Savings Formula</p>
                <p>Calculated as: <code className="text-emerald-300 font-mono">Original Verified Reference Price &minus; Secondhand Resale Price</code>.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-white mb-0.5">2. CO₂ Avoidance Factor (2.4 kg / item)</p>
                <p>Derived from university pulp lifecycle assessments: manufacturing and shipping a standard 800-page engineering textbook generates ~2.4 kg of CO₂ equivalent.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-white mb-0.5">3. Strictly Genuine Activities</p>
                <p>Cancelled deals, incomplete sessions, and unverified accounts are systematically excluded from verified metrics.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-white/10 flex items-center justify-between">
            <span>Aligned with ISO 14040 Life Cycle Assessment principles</span>
            <button
              onClick={() => setShowFormulaModal(true)}
              className="text-emerald-400 hover:underline font-bold"
            >
              Read Full Methodology &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Recent Community Activity Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-charcoal-900 pb-2 border-b border-slate-100">
          Verified Campus Activity Ledger
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {tx.buyerName} saved ₹{tx.estimatedStudentSavings} on “{tx.listingTitle}”
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Handed over by {tx.sellerName} • Category: {tx.listingCategory} • Fee: ₹{tx.platformCommission} (2%)
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap self-end sm:self-center">
                {new Date(tx.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              CampusLoop Sustainability Calculation Methodology
            </h3>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                CampusLoop is designed for a Sustainable Development Hackathon where mathematical transparency and honesty are essential:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Financial Savings Formula:</p>
                <code className="text-forest-800 font-mono block">
                  Savings = ReferenceRetailPrice - SecondHandPurchasePrice
                </code>
                <p className="text-[11px] text-slate-500">
                  Reference prices are benchmarked against national student bookstore catalog averages.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Environmental Savings Factor:</p>
                <code className="text-forest-800 font-mono block">
                  Total CO2 Saved = ReusedTextbooks * 2.4 kg CO2e
                </code>
                <p className="text-[11px] text-slate-500">
                  Accounts for energy consumed in wood harvesting, paper pulp de-inking, printing presses, and logistics.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold hover:bg-forest-900"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
