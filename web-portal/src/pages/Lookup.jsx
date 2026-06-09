import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CreditCard, CheckCircle, AlertCircle, ChevronRight, Lock } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/v1';

export default function Lookup() {
  const [refNo, setRefNo] = useState('');
  const [category, setCategory] = useState('');
  const [fine, setFine] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Payment State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/fines/lookup?referenceNo=${refNo}&categoryCode=${category}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Fine not found. Please verify details.');
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
        body: JSON.stringify({ fineId: fine._id, payerName: name, payerPhone: phone, paymentMethod: 'CARD', cardNumber })
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

  const pageTransition = {
    initial: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.98, filter: 'blur(10px)', transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-grow flex items-center justify-center py-20 px-6 relative"
    >
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: LOOKUP */}
        {step === 1 && (
          <motion.div key="step1" variants={pageTransition} initial="initial" animate="animate" exit="exit" className="w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
              <Search className="text-cyan-400 w-8 h-8" /> Find Ticket
            </h2>
            
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLookup} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reference Number</label>
                <input type="text" value={refNo} onChange={(e) => setRefNo(e.target.value)} placeholder="TF-20261122-872910" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category Code</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="SP-01" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all" required />
              </div>
              <button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100">
                {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <>Scan Traffic Network <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && fine && (
          <motion.div key="step2" variants={pageTransition} initial="initial" animate="animate" exit="exit" className="w-full max-w-xl p-8 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white transition-colors mb-6 text-sm font-bold flex items-center gap-1">← Back</button>
            
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 relative overflow-hidden">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Due Amount</p>
              <p className="text-5xl font-black text-white tracking-tight">LKR {fine.amount.$numberDecimal}</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between text-sm">
                <span className="text-gray-400">Vehicle: <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-md ml-2">{fine.vehicleNo}</span></span>
                <span className="text-gray-400">Offense: <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-md ml-2">{fine.categoryId.name}</span></span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Cardholder Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-cyan-500/50" required />
                <input type="text" placeholder="Mobile (for SMS)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-cyan-500/50" required />
              </div>
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl pl-14 pr-5 py-4 text-white font-mono placeholder-gray-600 focus:ring-2 focus:ring-cyan-500/50" required />
              </div>
              
              <button type="submit" disabled={loading} className="w-full mt-8 bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full" /> : <>Authorize Payment <Lock className="w-5 h-5" /></>}
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <motion.div key="step3" variants={pageTransition} initial="initial" animate="animate" className="w-full max-w-md p-12 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }} className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 border border-green-500/30">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>
            
            <h2 className="text-3xl font-black mb-3 text-white">Payment Verified</h2>
            <p className="text-gray-400 mb-10 leading-relaxed font-medium">Transaction complete. Secure receipt dispatched via SMS. Network logs updated successfully.</p>
            
            <button onClick={() => { setStep(1); setRefNo(''); setCategory(''); }} className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-4 rounded-xl transition-all">
              Initialize New Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
