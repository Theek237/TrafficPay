import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Activity, DollarSign, FileText, CheckCircle, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5005/api/v1';

export default function Dashboard() {
  const [fines, setFines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [formData, setFormData] = useState({
    _id: '',
    vehicleNo: '',
    categoryId: '',
    amount: '',
    status: 'PENDING'
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchFines = async (token) => {
    try {
      const res = await fetch(`${API_URL}/fines`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch fines');
      setFines(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/system/fine-categories`);
      const data = await res.json();
      if (res.ok) setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('traffic_token');
    const user = JSON.parse(localStorage.getItem('traffic_user') || 'null');

    if (!token || user?.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    Promise.all([fetchFines(token), fetchCategories()]).finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('traffic_token');
    localStorage.removeItem('traffic_user');
    navigate('/login');
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ _id: '', vehicleNo: '', categoryId: categories[0]?._id || '', amount: '', status: 'PENDING' });
    setIsModalOpen(true);
  };

  const openEditModal = (fine) => {
    setModalMode('edit');
    setFormData({
      _id: fine._id,
      vehicleNo: fine.vehicleNo,
      categoryId: fine.categoryId?._id || '',
      amount: fine.amount?.$numberDecimal || fine.amount,
      status: fine.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to completely delete this fine?')) return;
    const token = localStorage.getItem('traffic_token');
    try {
      const res = await fetch(`${API_URL}/fines/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete fine');
      setFines(fines.filter(f => f._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('traffic_token');
    const url = modalMode === 'create' ? `${API_URL}/fines` : `${API_URL}/fines/${formData._id}`;
    const method = modalMode === 'create' ? 'POST' : 'PUT';

    // If creating, we need a districtId. Using a dummy or omitting if not strictly required
    const payload = { ...formData };
    if (modalMode === 'create') payload.districtId = "60d5ecb54d6bbb2b5c000000"; // Dummy

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      
      // Update Local State
      if (modalMode === 'create') {
        fetchFines(token); // Refresh completely to get full populated objects
      } else {
        setFines(fines.map(f => f._id === formData._id ? data.data : f));
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = fines.reduce((acc, fine) => acc + parseFloat(fine.amount?.$numberDecimal || fine.amount || 0), 0);
  const paidFines = fines.filter(f => f.status === 'PAID').length;
  const pendingFines = fines.filter(f => f.status === 'PENDING').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.05 } }}
      className="flex-grow flex flex-col py-10 px-6 max-w-7xl mx-auto w-full relative z-10"
    >
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Network overview and active violations.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" /> Issue Fine
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
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
                    <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm text-right">Actions</th>
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
                      <td className="py-4 px-6 font-bold text-cyan-400">{fine.amount?.$numberDecimal || fine.amount}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-widest ${
                          fine.status === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                          fine.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {fine.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(fine)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(fine._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {fines.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-gray-500 font-medium">No fines recorded in the system.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-black text-white mb-6">
                {modalMode === 'create' ? 'Issue New Fine' : 'Edit Fine'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Vehicle Number</label>
                  <input 
                    type="text" required
                    value={formData.vehicleNo}
                    onChange={e => setFormData({...formData, vehicleNo: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Offense Category</label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    <option value="" disabled>Select Offense</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name} ({cat.code})</option>
                    ))}
                  </select>
                </div>
                {modalMode === 'edit' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="OVERDUE">OVERDUE</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                  </div>
                )}
                
                <button 
                  type="submit" disabled={submitting}
                  className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Issue Ticket' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
