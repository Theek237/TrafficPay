import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Users, FileText, Settings, TrendingUp, Search } from 'lucide-react';

// For demo purposes, we'll hardcode an admin token. In a real app, you'd have a login screen.
// We'll mock the login to use a dummy admin or bypass if auth is disabled, 
// but since the backend requires it, let's create a login screen first.

function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('admin@police.lk');
  const [password, setPassword] = useState('Admin123');
  const [error, setError] = useState('');
  
  const [summary, setSummary] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    try {
      // First try to login
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
      setToken(res.data.data.token);
    } catch (err) {
      // If admin doesn't exist, register it automatically for demo purposes
      try {
        const regRes = await axios.post('http://localhost:5000/api/v1/auth/register', {
          fullName: 'Super Admin',
          email: 'admin@police.lk',
          phone: '0711111111',
          password: 'Admin123',
          role: 'ADMIN'
        });
        setToken(regRes.data.data.token);
      } catch (regErr) {
        setError('Failed to login or register admin.');
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [summaryRes, distRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/analytics/summary', config),
        axios.get('http://localhost:5000/api/v1/analytics/by-district', config)
      ]);
      setSummary(summaryRes.data.data);
      setDistrictData(distRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans px-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          <div className="p-8 text-center border-b border-slate-700">
            <LayoutDashboard size={48} className="text-indigo-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
            <p className="text-slate-400 mt-2">Traffic Fine Management System</p>
          </div>
          <form onSubmit={login} className="p-8 space-y-6">
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-indigo-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-900">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
            <LayoutDashboard className="mr-3 text-indigo-400" size={24} />
            Traffic<span className="text-indigo-400">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center px-4 py-3 bg-indigo-600 text-white rounded-xl">
            <TrendingUp className="mr-3" size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition">
            <FileText className="mr-3" size={20} /> Fine Records
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition">
            <Users className="mr-3" size={20} /> Personnel
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition">
            <Settings className="mr-3" size={20} /> Settings
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setToken(null)} className="w-full py-2 text-sm text-slate-400 hover:text-white transition">Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-slate-800">National Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search fines, users..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all focus:w-72" />
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              SA
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* KPI Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="text-sm font-medium text-slate-500 mb-2">Total Fines Issued</div>
                <div className="text-3xl font-extrabold text-slate-900">{summary.totalFinesIssued.toLocaleString()}</div>
                <div className="mt-4 text-xs font-medium text-emerald-600 bg-emerald-50 self-start px-2 py-1 rounded-md">+12% this month</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="text-sm font-medium text-slate-500 mb-2">Total Revenue Collected</div>
                <div className="text-3xl font-extrabold text-indigo-600">
                  <span className="text-xl mr-1">LKR</span>{summary.totalRevenueLKR.toLocaleString()}
                </div>
                <div className="mt-4 text-xs font-medium text-emerald-600 bg-emerald-50 self-start px-2 py-1 rounded-md">+8% this month</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="text-sm font-medium text-slate-500 mb-2">Collection Rate</div>
                <div className="text-3xl font-extrabold text-slate-900">{summary.collectionRate}%</div>
                <div className="mt-4 text-xs font-medium text-amber-600 bg-amber-50 self-start px-2 py-1 rounded-md">Needs attention</div>
              </div>
            </div>
          )}

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue by District (LKR)</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-400">Loading data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="districtName" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          {/* Recent Fines Data Table Placeholder */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-800">Recent Traffic Fines</h3>
               <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">View All</button>
             </div>
             <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Detailed table will be displayed here (Pagination to be implemented).
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
