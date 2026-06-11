import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Activity, Menu, X } from 'lucide-react';

const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));

function App() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-cyan-500/30">
      
      {/* Global Animated Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      {/* Top Navigation */}
      <nav className="fixed w-full z-50 bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all overflow-hidden">
              <img src="/logo.png" alt="TrafficPay Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">Traffic<span className="text-cyan-400">Pay</span></h1>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link to="/dashboard" className="hover:text-white transition-colors">Admin Portal</Link>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>System Operational</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-3xl pt-24 px-6 md:hidden">
            <div className="flex flex-col gap-6 text-xl font-medium">
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Admin Portal</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Routing with Page Transitions */}
      <main className="relative z-10 pt-20 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          <Suspense fallback={
            <div className="flex-grow flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          }>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Universal Footer - Generic & Professional */}
      <footer className="relative z-10 border-t border-white/5 bg-[#050505] py-8 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Smart Traffic Network Solutions. Encrypted & Secure.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
