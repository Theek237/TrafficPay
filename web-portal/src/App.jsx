import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, CreditCard, CheckCircle, AlertCircle, ChevronRight, Activity, Info } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/v1'; // Will be updated to gateway later

function App() {
  const [refNo, setRefNo] = useState('');
  const [category, setCategory] = useState('');
  const [fine, setFine] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Lookup, 2: Pay, 3: Success

  // Payment Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/fines/lookup?referenceNo=${refNo}&categoryCode=${category}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Fine not found. Please check your details.');
      setFine(data.data);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/payments/mock-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fineId: fine._id,
          payerName: name,
          payerPhone: phone,
          paymentMethod: 'CARD',
          cardNumber: cardNumber
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment Failed');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -30, filter: 'blur(10px)', transition: { duration: 0.4 } }
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-800 selection:bg-blue-200 selection:text-blue-900 overflow-hidden">
      
      {/* Stunning AI Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: 'url("/bg.png")' }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:px-12 bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800">
            TrafficPay<span className="text-blue-500">.</span>
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white/60 shadow-sm">
             <Info className="w-4 h-4 text-blue-500"/>
             <span>No Login Required - Public Portal</span>
          </div>
          <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2"><Activity className="w-4 h-4"/> System Status</a>
        </motion.div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] p-6">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-10 max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-slate-900 drop-shadow-sm">
            Fast, Secure, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Resolved.
            </span>
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Enter your fine details directly below to settle your traffic violations instantly. No account or registration is required.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md p-8 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                <Search className="text-blue-500" /> Fine Lookup
              </h2>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 text-sm font-medium shadow-sm"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLookup} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Reference Number</label>
                  <input
                    type="text"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    placeholder="e.g. TF-20261122-872910"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category Code</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. SP-01"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>Find My Fine <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && fine && (
            <motion.div 
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-lg p-8 rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              <button 
                onClick={() => setStep(1)} 
                className="text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-bold flex items-center gap-1 bg-white/50 px-4 py-2 rounded-full border border-slate-200"
              >
                ← Return to Search
              </button>
              
              <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 relative overflow-hidden group shadow-inner">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Amount Due</p>
                <p className="text-6xl font-black text-slate-800 tracking-tight">LKR {fine.amount.$numberDecimal}</p>
                <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Vehicle: <span className="text-slate-900 font-bold bg-white px-3 py-1 rounded-md border border-slate-200 ml-2">{fine.vehicleNo}</span></span>
                  <span className="text-slate-500 font-medium">Violation: <span className="text-slate-900 font-bold bg-white px-3 py-1 rounded-md border border-slate-200 ml-2">{fine.categoryId.name}</span></span>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handlePayment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Mobile Number (for SMS)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Card Number (Mock Data)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono shadow-sm"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>Confirm Payment <Shield className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              className="w-full max-w-md p-12 rounded-[2.5rem] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.1)] text-center flex flex-col items-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 to-transparent opacity-50"></div>
              
              <motion.div 
                initial={{ scale: 0, rotate: -180 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/30 z-10"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-black mb-3 text-slate-800 z-10">Payment Successful!</h2>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium z-10">
                Your transaction is complete. An official receipt has been dispatched to your mobile via SMS. You may now retrieve your driving license from the officer.
              </p>
              
              <button 
                onClick={() => { setStep(1); setRefNo(''); setCategory(''); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-2xl transition-all shadow-sm z-10"
              >
                Start New Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      
      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center text-xs font-bold text-slate-400/80 z-10 uppercase tracking-[0.2em]">
        SRI LANKA TRAFFIC POLICE • SECURED BY TRAFFICPAY
      </div>
    </div>
  );
}

export default App;
