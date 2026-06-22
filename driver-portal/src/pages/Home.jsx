import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const pageTransition = {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.05 } }
  };

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-grow flex items-center justify-center relative overflow-hidden"
    >
      {/* Traffic Glow Effects (Amber & Cyan) */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center z-10 w-full py-20">
        
        {/* Text Content */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-semibold uppercase tracking-wider backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-amber-400" /> Smart Traffic Resolution
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]"
          >
            Settle Fines <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              Instantly.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-lg leading-relaxed"
          >
            Navigate the future of traffic law enforcement. Instant smart-city verification, real-time logging, and highly secure payment gateways.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link to="/lookup" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/50 to-blue-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-2">Launch Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            
            <div className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-400">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              256-bit Encryption
            </div>
          </motion.div>
        </div>

        {/* 3D Visual Element - The AI Generated Traffic Scene */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: 'brightness(0.5)' }}
          animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
          transition={{ delay: 0.4, duration: 1.5, type: "spring", bounce: 0.4 }}
          className="relative hidden lg:block rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.2)] border border-white/10"
        >
          {/* Subtle slow zoom effect for the highway image */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <img 
              src="/hero3d.png" 
              alt="Futuristic Smart Traffic Highway" 
              className="w-full h-auto object-cover"
            />
          </motion.div>
          
          {/* Overlay gradient to blend perfectly into the dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-50 pointer-events-none"></div>
        </motion.div>

      </div>
    </motion.div>
  );
}
