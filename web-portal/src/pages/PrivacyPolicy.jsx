import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Lock, Eye } from 'lucide-react';

export default function PrivacyPolicy() {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-6">
            <Lock className="w-4 h-4" /> Secure Protocol
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Policy</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Last Updated: June 2026. Learn how we safeguard your traffic and payment information.
          </p>
        </motion.div>

        {/* Policy Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#050505]/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md space-y-8 shadow-[0_0_50px_rgba(6,182,212,0.05)]"
        >
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We collect information necessary to verify traffic violations and process payments. This includes vehicle registration numbers, license plate numbers, ticket numbers, and payment details. We do not store full credit card details on our servers; all payments are processed securely through certified payment gateways.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">2. How We Use Data</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your data is solely used to verify fines issued by authorized smart-city traffic grids and facilitate secure settlement. Aggregated, non-personally identifiable traffic metrics may be analyzed to optimize traffic management systems across metropolitan areas.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">3. Data Security & Encryption</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              All communications and transfers of information between your browser and our platform are encrypted using industry-standard 256-bit Secure Socket Layer (SSL/TLS) technology. Strict access controls are maintained to prevent unauthorized database access.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">4. Third-Party Disclosures</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We do not sell, trade, or transfer your personally identifiable information to outside parties. This does not include trusted partners who assist us in operating our platform, conducting business, or processing transactions, provided those parties agree to keep this information confidential.
            </p>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
}
