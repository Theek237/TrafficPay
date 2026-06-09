import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Activity, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5005/api/v1';

export default function Dashboard() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('traffic_token');
    const user = JSON.parse(localStorage.getItem('traffic_user') || 'null');

    if (!token || user?.role !== 'ADMIN') {
      navigate('/admin/login');
      return;
    }

    const fetchFines = async () => {
      try {
        const res = await fetch(`${API_URL}/fines`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch fines');
        setFines(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('traffic_token');
    localStorage.removeItem('traffic_user');
    navigate('/admin/login');
  };

  const totalRevenue = fines.reduce((acc, fine) => acc + parseFloat(fine.amount?.$numberDecimal || 0), 0);
  const paidFines = fines.filter(f => f.status === 'PAID').length;
  const pendingFines = fines.filter(f => f.status === 'PENDING').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.3 } }}
      exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
      className="flex-grow flex flex-col py-10 px-6 max-w-7xl mx-auto w-full relative z-10"
    >
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Network overview and active violations.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center flex-grow">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full" />
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Total Fines Issued</p>
              <h3 className="text-4xl font-black text-white">{fines.length}</h3>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Total Revenue Logged</p>
              <h3 className="text-4xl font-black text-white">LKR {totalRevenue.toLocaleString()}</h3>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Status Overview</p>
              <div className="flex gap-4 mt-2">
                <div className="text-green-400 font-bold"><span className="text-2xl">{paidFines}</span> Paid</div>
                <div className="text-amber-400 font-bold"><span className="text-2xl">{pendingFines}</span> Pending</div>
              </div>
            </motion.div>
          </div>

          {/* Data Table */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Ref. Number</th>
                    <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Vehicle</th>
                    <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Offense</th>
                    <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Amount (LKR)</th>
                    <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fines.map((fine, index) => (
                    <motion.tr 
                      key={fine._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 px-6 font-mono text-white/90">{fine.referenceNo}</td>
                      <td className="py-4 px-6 font-bold text-white">{fine.vehicleNo}</td>
                      <td className="py-4 px-6 text-gray-300">{fine.categoryId?.name || 'Unknown'}</td>
                      <td className="py-4 px-6 font-bold text-cyan-400">{fine.amount?.$numberDecimal}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-widest ${
                          fine.status === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                          fine.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {fine.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {fines.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">No fines recorded in the system.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
