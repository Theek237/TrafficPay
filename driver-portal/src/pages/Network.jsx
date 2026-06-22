import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Radio, Wifi, Zap, Server, ShieldCheck } from 'lucide-react';

export default function Network() {
  const pageTransition = {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(5px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.98, filter: 'blur(5px)', transition: { duration: 0.05 } }
  };

  const nodes = Array.from({ length: 12 });

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-grow flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-6"
        >
          <Radio className="w-4 h-4 animate-pulse" /> Live Uplink Active
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white"
        >
          Smart City <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Grid</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-16"
        >
          Real-time visualization of the TrafficPay node network. Monitoring intersections, API gateways, and financial ledgers across the metropolitan area.
        </motion.p>

        {/* Network Visualization Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative w-full max-w-4xl mx-auto aspect-[2/1] rounded-3xl border border-white/10 bg-[#050505]/50 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)]"
        >
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Central Hub */}
          <div className="absolute z-20 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-cyan-500/50 flex items-center justify-center animate-[spin_10s_linear_infinite] absolute"></div>
            <div className="w-24 h-24 rounded-full border border-blue-500/30 flex items-center justify-center animate-[spin_7s_linear_infinite_reverse] absolute"></div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] z-30">
              <Server className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Surrounding Nodes */}
          {nodes.map((_, i) => {
            const angle = (i * 360) / nodes.length;
            const radius = 150 + Math.random() * 50;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const delay = Math.random() * 2;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.2, 1, 0.2], scale: 1 }}
                transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, delay }}
                className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              />
            );
          })}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Activity className="w-6 h-6 text-cyan-400 mb-3" />
            <div className="text-3xl font-black text-white">99.9%</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Uptime</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Zap className="w-6 h-6 text-amber-400 mb-3" />
            <div className="text-3xl font-black text-white">&lt;12ms</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Latency</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Wifi className="w-6 h-6 text-blue-400 mb-3" />
            <div className="text-3xl font-black text-white">1,204</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Active Nodes</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-6 h-6 text-green-400 mb-3" />
            <div className="text-3xl font-black text-white">Zero</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Breaches</div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
