import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpen, AlertCircle, FileText } from 'lucide-react';

export default function TermsOfService() {
  const pageTransition = {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(5px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.98, filter: 'blur(5px)', transition: { duration: 0.05 } }
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold uppercase tracking-wider mb-6">
            <BookOpen className="w-4 h-4" /> Legal Framework
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Service</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Please review the legal guidelines and agreement for using TrafficPay.
          </p>
        </motion.div>

        {/* Terms Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#050505]/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md space-y-8 shadow-[0_0_50px_rgba(59,130,246,0.05)]"
        >
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              By accessing and using TrafficPay, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using the platform and must discontinue use immediately.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">2. Fine Settlements</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              TrafficPay provides a gateway to process fines issued by local traffic authorities. Settling a fine through this portal constitutes a final settlement and is subject to the terms and rules set by the issuing jurisdiction. Payment processing errors must be reported immediately.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">3. System Limitations & Liability</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              While we strive to ensure 100% data accuracy and service uptime, TrafficPay is provided on an "as-is" basis. We are not liable for delayed updates from the traffic grid database, transaction delays by banking partners, or temporary system outages.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">4. Modifications to Terms</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We reserve the right to revise or modify these terms at any time. Any changes will become effective immediately upon posting. Your continued use of the platform after changes are published signifies your agreement to the updated terms.
            </p>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
}
