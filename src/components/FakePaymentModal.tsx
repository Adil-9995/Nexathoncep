import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Smartphone,
  Lock,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FakePaymentModal: React.FC = () => {
  const { 
    fakePaymentModalOpen, 
    setFakePaymentModalOpen, 
    purchaseCreditPack, 
    pendingUnlockTeacherId, 
    allUsers 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [upiId, setUpiId] = useState('student@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successScreen, setSuccessScreen] = useState(false);

  if (!fakePaymentModalOpen) return null;

  const targetTeacher = allUsers.find(u => u.id === pendingUnlockTeacherId);

  const handleExecutePayment = (methodLabel: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessScreen(true);
      setTimeout(() => {
        purchaseCreditPack(methodLabel);
        setSuccessScreen(false);
      }, 1400);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-indigo-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-indigo-800 text-white p-6 relative">
          <button 
            onClick={() => setFakePaymentModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              Interactive Simulated Checkout
            </span>
            <span className="text-indigo-200 text-xs font-medium">Spam-Free Match Pass</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            Unlock 5 Learning Credits
          </h3>
          <p className="text-xs text-indigo-100 mt-1">
            Learning is 100% free between students! The ₹10 match pass keeps our student community verified and unlocks peer matches.
          </p>

          <div className="mt-4 flex items-baseline justify-between bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div>
              <span className="text-xs text-indigo-200 block">Offer Bundle</span>
              <span className="text-lg font-extrabold text-white">5 Credits Pack</span>
              <span className="text-[11px] text-amber-300 block">Requires 2 credits per peer match</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-400">₹10</span>
              <span className="text-[10px] text-indigo-200 block">One-time demo micro-pay</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {successScreen ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Payment Simulated Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                ₹10 simulated fee processed. <strong>5 Learning Credits</strong> have been added to your CampusLoop wallet.
              </p>
              {targetTeacher && (
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 font-semibold">
                  Unlocking direct peer match with <strong>{targetTeacher.name}</strong>...
                </div>
              )}
            </div>
          ) : isProcessing ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Processing Simulated ₹10 Micro-Payment</h4>
                <p className="text-xs text-slate-400 mt-1">Connecting to simulated UPI sandbox...</p>
              </div>
            </div>
          ) : (
            <>
              {/* If target teacher was clicked */}
              {targetTeacher && (
                <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <img 
                    src={targetTeacher.avatar} 
                    alt={targetTeacher.name} 
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-300"
                  />
                  <div className="text-xs flex-1">
                    <span className="font-bold text-slate-900">Target Match: {targetTeacher.name}</span>
                    <p className="text-[11px] text-slate-500">
                      Teaches: {targetTeacher.skillsCanTeach.map(s => s.name).join(', ')}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-indigo-200/60 text-indigo-900 font-bold text-[10px]">
                    2 Credits Needed
                  </span>
                </div>
              )}

              {/* Payment Method Selector Tabs */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Choose Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 text-xs'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                    <span className="text-xs block">UPI Apps</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'qr'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 text-xs'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                    <span className="text-xs block">Scan QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 text-xs'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                    <span className="text-xs block">Debit / RuPay</span>
                  </button>
                </div>
              </div>

              {/* Method Specific UI */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Popular Apps Supported:</span>
                    <span className="font-bold text-slate-700">GPay • PhonePe • Paytm</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Enter Demo UPI ID</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={upiId} 
                        onChange={(e) => setUpiId(e.target.value)} 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        Simulated
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'qr' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=campusloop@sandbox&pn=CampusLoopMatch&am=10&cu=INR" 
                      alt="UPI QR Code for ₹10" 
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Scan with any demo camera app or click button below to simulate scan.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Test Card Number</label>
                    <input 
                      type="text" 
                      disabled 
                      value="4111 •••• •••• 9821" 
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-100 font-mono text-xs text-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Valid Thru</label>
                      <input 
                        type="text" 
                        disabled 
                        value="12/28" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-100 font-mono text-xs text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">CVV</label>
                      <input 
                        type="password" 
                        disabled 
                        value="888" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-100 font-mono text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleExecutePayment(paymentMethod.toUpperCase())}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-4 h-4 text-indigo-200" />
                  <span>Simulate Pay ₹10 & Unlock 5 Credits</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% simulated sandbox for hackathon evaluation • No real card charged</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
