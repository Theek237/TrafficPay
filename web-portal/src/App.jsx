import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, CreditCard, CheckCircle, AlertCircle, ChevronRight, Activity } from 'lucide-react';

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
      if (!res.ok) throw new Error(data.message || 'Fine not found');
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
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -50, scale: 0.95, transition: { duration: 0.4 } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 filter blur-sm"
        >
          {/* A high quality abstract traffic/city video placeholder */}
          <source src="https://cdn.pixabay.com/video/2020/05/24/40061-424888122_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
      </div>

      <nav className="relative z-10 flex items-center justify-between p-6 md:px-12 backdrop-blur-md border-b border-white/10 bg-black/20">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            TrafficPay<span className="text-indigo-500">.</span>
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300"
        >
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Activity className="w-4 h-4"/> Live Status</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </motion.div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] p-6">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-12 max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            Settle Fines <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Instantly.
            </span>
          </h1>
          <p className="text-lg text-gray-400 font-light">
            Experience the next generation of seamless, secure, and instant traffic fine resolutions powered by our intelligent payment network.
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
              className="w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Search className="text-indigo-400" /> Fine Lookup
              </h2>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLookup} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Reference Number</label>
                  <input
                    type="text"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    placeholder="e.g. TF-20261122-872910"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Category Code</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. SP-01"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-4 bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 focus:ring-4 focus:ring-white/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full" />
                  ) : (
                    <>Proceed <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
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
              className="w-full max-w-lg p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setStep(1)} 
                className="text-gray-400 hover:text-white transition-colors mb-6 text-sm font-medium flex items-center gap-1"
              >
                ← Back
              </button>
              
              <div className="mb-8 p-6 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-sm text-gray-400 mb-1">Total Amount Due</p>
                <p className="text-5xl font-black text-white">LKR {fine.amount.$numberDecimal}</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                  <span className="text-gray-400">Vehicle: <span className="text-white font-medium">{fine.vehicleNo}</span></span>
                  <span className="text-gray-400 text-right">Violation: <span className="text-white font-medium">{fine.categoryId.name}</span></span>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
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
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Card Number (Mock)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                  ) : (
                    <>Authorize Payment <Shield className="w-4 h-4" /></>
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
              className="w-full max-w-md p-10 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center flex flex-col items-center"
            >
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">Payment Verified</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Your transaction was successful. An official receipt has been dispatched to your mobile via SMS. You may now retrieve your driving license.
              </p>
              <button 
                onClick={() => { setStep(1); setRefNo(''); setCategory(''); }}
                className="w-full border border-white/20 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Return to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      
      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center text-xs text-gray-500 z-10 font-mono tracking-widest">
        SRI LANKA TRAFFIC POLICE • SECURED BY TRAFFICPAY
      </div>
    </div>
  );
}

export default App;
