import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LiveUplinkActivities() {
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.12 } }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-grow flex flex-col items-start justify-start py-20 px-8"
    >
      <div className="max-w-4xl w-full">
        <Link to="/network" className="inline-flex items-center gap-2 text-cyan-400 hover:underline mb-6">
          <ArrowLeft className="w-5 h-5" /> Back to Network
        </Link>

        <h2 className="text-3xl font-extrabold mb-3">Live Uplink Activities</h2>
        <p className="text-gray-400 mb-8">Real-time events and activity stream for the active uplink. Filter, inspect, and replay uplink events here.</p>

        <div className="rounded-lg border border-white/6 bg-[#050505]/60 p-6">
          <p className="text-sm text-gray-400">No events to display yet. The live uplink activity stream will appear here when available.</p>
        </div>
      </div>
    </motion.div>
  );
}
