import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactSupport() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const pageTransition = {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(5px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.98, filter: 'blur(5px)', transition: { duration: 0.05 } }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormState({ name: '', email: '', message: '' });
      }, 5000);
    }
  };

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-grow flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold uppercase tracking-wider mb-6">
            <MessageSquare className="w-4 h-4 animate-pulse" /> Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Support</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Need assistance with a ticket or payment? Our smart city support network is here to help you 24/7.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Support Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Phone Card */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#050505]/50 backdrop-blur-md group hover:border-amber-500/30 transition-all duration-300 shadow-[0_0_50px_rgba(245,158,11,0.02)]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-widest font-medium">Hotline</h3>
              <a href="tel:0553342567" className="text-2xl font-black text-white hover:text-amber-400 transition-colors mt-2 block">
                0553342567
              </a>
              <p className="text-gray-400 text-sm mt-2">Call us for immediate escalation & payment verification issues.</p>
            </div>

            {/* Email Card */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#050505]/50 backdrop-blur-md group hover:border-amber-500/30 transition-all duration-300 shadow-[0_0_50px_rgba(245,158,11,0.02)]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-widest font-medium">Email Address</h3>
              <a href="mailto:ruhuna12345@gmail.com" className="text-lg font-bold text-white hover:text-amber-400 transition-colors mt-2 block break-all">
                ruhuna12345@gmail.com
              </a>
              <p className="text-gray-400 text-sm mt-2">Send official inquiries or documentation regarding fine discrepancies.</p>
            </div>

            {/* Response Time Card */}
            <div className="p-6 rounded-3xl border border-white/10 bg-[#050505]/30 flex items-center gap-4">
              <Clock className="w-10 h-10 text-gray-500 shrink-0" />
              <div>
                <h4 className="text-white font-semibold text-sm">Response Time</h4>
                <p className="text-gray-400 text-xs mt-1">Direct calls are processed immediately. Email tickets are resolved within 24 hours.</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 p-8 md:p-10 rounded-3xl border border-white/10 bg-[#050505]/50 backdrop-blur-md shadow-[0_0_50px_rgba(245,158,11,0.02)]"
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 space-y-4"
              >
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Transmitted</h3>
                <p className="text-gray-400 max-w-sm mx-auto text-sm">
                  Your communication has been securely routed. A support agent will contact you shortly at <b>{formState.email}</b>.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">Send a Message</h2>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Message / Ticket Details</label>
                  <textarea 
                    required
                    rows="4"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600 resize-none"
                    placeholder="Describe your issue or provide ticket ID..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                >
                  <Send className="w-5 h-5" /> Secure Transmit
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
