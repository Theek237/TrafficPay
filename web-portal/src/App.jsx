import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, CreditCard, CheckCircle, AlertTriangle, ChevronRight, Lock, FileText, BadgeCheck } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/v1'; // API Gateway

function App() {
  const [refNo, setRefNo] = useState('');
  const [category, setCategory] = useState('');
  const [fine, setFine] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

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
      if (!res.ok) throw new Error(data.message || 'Fine not found. Please verify your reference number.');
      setFine(data.data);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Unable to connect to the server. Please try again later.');
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
      if (!res.ok) throw new Error(data.message || 'Payment transaction failed.');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Payment processing error.');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-900 selection:text-white flex flex-col">
      
      {/* Official Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-amber-500" /> Official Government Portal</span>
        </div>
        <div className="flex items-center gap-4 hidden md:flex">
          <a href="#" className="hover:text-white transition-colors">Help Desk</a>
          <a href="#" className="hover:text-white transition-colors">Language: EN</a>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center shadow-inner">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Sri Lanka Traffic Police</h1>
              <p className="text-sm text-slate-500 font-medium">Fine Settlement Portal</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm font-semibold">
            <Lock className="w-4 h-4" /> Secure 256-bit Encryption
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-grow flex items-center justify-center p-6 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Information Side (Only visible on Step 1) */}
          <div className={`hidden md:block transition-all duration-500 ${step !== 1 ? 'md:hidden' : ''}`}>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Settle your traffic offenses <span className="text-blue-700">instantly online.</span>
            </h2>
            <ul className="space-y-6 mt-8">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                  <Search className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Locate your fine</h3>
                  <p className="text-slate-600 mt-1">Enter your Reference Number and Category Code exactly as they appear on your ticket.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Pay securely</h3>
                  <p className="text-slate-600 mt-1">We accept all major credit and debit cards through our encrypted payment gateway.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Receive receipt</h3>
                  <p className="text-slate-600 mt-1">Get an instant digital receipt via SMS to retrieve your driving license.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Interactive Form Side */}
          <div className={`w-full max-w-md mx-auto ${step !== 1 ? 'md:col-span-2' : ''}`}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: LOOKUP */}
              {step === 1 && (
                <motion.div key="step1" variants={fadeUp} initial="initial" animate="animate" exit="exit" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Lookup Ticket</h2>
                    <BadgeCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="p-8">
                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200 text-sm">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <p>{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleLookup} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Reference Number</label>
                        <input
                          type="text"
                          value={refNo}
                          onChange={(e) => setRefNo(e.target.value.toUpperCase())}
                          placeholder="e.g. TF-20261122-872910"
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow bg-slate-50 focus:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category Code</label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value.toUpperCase())}
                          placeholder="e.g. SP-01"
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow bg-slate-50 focus:bg-white"
                          required
                        />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md disabled:opacity-70">
                        {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full" /> : <>Continue to Details <ChevronRight className="w-5 h-5" /></>}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && fine && (
                <motion.div key="step2" variants={fadeUp} initial="initial" animate="animate" exit="exit" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mx-auto max-w-xl">
                  <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Payment Details</h2>
                    <button onClick={() => setStep(1)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Cancel & Return</button>
                  </div>
                  
                  <div className="p-8">
                    {/* Invoice Summary */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Amount Due</p>
                          <p className="text-4xl font-black text-slate-900">LKR {fine.amount.$numberDecimal}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Reference</p>
                          <p className="font-mono font-bold text-slate-800">{fine.referenceNo}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-sm">
                        <div>
                          <span className="block text-slate-500 mb-1">Vehicle No.</span>
                          <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded">{fine.vehicleNo}</span>
                        </div>
                        <div>
                          <span className="block text-slate-500 mb-1">Offense Category</span>
                          <span className="font-bold text-slate-800">{fine.categoryId.name}</span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200 text-sm">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <p>{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handlePayment} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Cardholder Name</label>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 focus:bg-white" required />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number (SMS Receipt)</label>
                          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 focus:bg-white" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="w-full border border-slate-300 rounded-lg pl-12 pr-4 py-3 text-slate-900 font-mono focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 focus:bg-white" required />
                        </div>
                      </div>
                      
                      <button type="submit" disabled={loading} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md disabled:opacity-70 text-lg">
                        {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full" /> : <>Pay LKR {fine.amount.$numberDecimal} <Lock className="w-5 h-5" /></>}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS */}
              {step === 3 && (
                <motion.div key="step3" variants={fadeUp} initial="initial" animate="animate" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mx-auto max-w-md text-center p-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Payment Verified</h2>
                  <p className="text-slate-600 mb-8">
                    Your traffic fine has been successfully settled. An official receipt has been sent to your mobile number.
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-8 text-left">
                    <p className="text-sm text-slate-500 mb-1">Transaction Reference</p>
                    <p className="font-mono font-bold text-slate-800">TXN-{Math.floor(Math.random() * 100000000)}</p>
                  </div>
                  <button onClick={() => { setStep(1); setRefNo(''); setCategory(''); }} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                    Return to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-sm py-8 text-center border-t border-slate-800">
        <p className="font-semibold text-slate-300">© 2026 Sri Lanka Traffic Police. All Rights Reserved.</p>
        <p className="mt-2 text-xs">Developed by Theenuka & Team • Software Architecture Project</p>
      </footer>
    </div>
  );
}

export default App;
