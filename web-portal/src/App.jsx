import React, { useState } from 'react';
import axios from 'axios';
import { Search, CreditCard, CheckCircle, ShieldAlert, Car, MapPin, ReceiptText } from 'lucide-react';

function App() {
  const [referenceNo, setReferenceNo] = useState('');
  const [categoryCode, setCategoryCode] = useState('');
  const [fine, setFine] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Form states
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const lookupFine = async (e) => {
    e.preventDefault();
    setError('');
    setFine(null);
    setPaymentSuccess(null);
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:5000/api/v1/fines/lookup?referenceNo=${referenceNo}&categoryCode=${categoryCode}`);
      setFine(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Fine not found. Please check your reference number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const payFine = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/payments/mock-confirm`, {
        fineId: fine._id,
        payerName,
        payerPhone,
        paymentMethod: 'CARD',
        cardNumber
      });
      setPaymentSuccess(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-indigo-700 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <ShieldAlert size={28} />
            <span className="text-xl font-bold tracking-tight">Sri Lanka Traffic Fines</span>
          </div>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium text-indigo-100">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Pay Your Traffic Fine <span className="text-indigo-600">Online</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A fast, secure, and convenient way to settle your traffic fines without visiting a police station. Enter your details below to get started.
          </p>
        </div>

        {/* Success State */}
        {paymentSuccess && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transform transition-all mb-8">
            <div className="bg-emerald-500 p-6 text-center">
              <CheckCircle size={64} className="text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Payment Successful</h2>
            </div>
            <div className="p-8">
              <p className="text-slate-600 text-center mb-6">Your payment has been processed and an SMS receipt has been sent to the officer. You may now collect your license.</p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center mb-4">
                  <ReceiptText className="text-indigo-600 mr-2" />
                  <h3 className="font-semibold text-slate-800">Receipt Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-slate-500">Receipt No:</div>
                  <div className="font-medium text-slate-900">{paymentSuccess.receiptNo}</div>
                  <div className="text-slate-500">Amount Paid:</div>
                  <div className="font-medium text-emerald-600">LKR {paymentSuccess.amount.$numberDecimal}</div>
                  <div className="text-slate-500">Status:</div>
                  <div className="font-medium text-slate-900">{paymentSuccess.status}</div>
                </div>
              </div>
              
              <button 
                onClick={() => { setPaymentSuccess(null); setFine(null); setReferenceNo(''); }}
                className="mt-8 w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition"
              >
                Pay Another Fine
              </button>
            </div>
          </div>
        )}

        {/* Lookup & Payment flow */}
        {!paymentSuccess && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            
            <div className="flex border-b border-slate-100">
              <div className={`flex-1 text-center py-4 font-semibold text-sm transition-colors ${!fine ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 bg-slate-50'}`}>
                1. Search Fine
              </div>
              <div className={`flex-1 text-center py-4 font-semibold text-sm transition-colors ${fine ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-400 bg-slate-50'}`}>
                2. Secure Payment
              </div>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start">
                  <ShieldAlert className="shrink-0 mr-3 mt-0.5" size={20} />
                  <span>{error}</span>
                </div>
              )}

              {!fine ? (
                /* Search Form */
                <form onSubmit={lookupFine}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Fine Reference Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={18} className="text-slate-400" />
                        </div>
                        <input 
                          type="text" 
                          required
                          value={referenceNo}
                          onChange={(e) => setReferenceNo(e.target.value)}
                          placeholder="e.g. TF-20260513-000123"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Violation Category Code</label>
                      <input 
                        type="text" 
                        required
                        value={categoryCode}
                        onChange={(e) => setCategoryCode(e.target.value)}
                        placeholder="e.g. SP-01"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-200 flex justify-center items-center"
                    >
                      {loading ? 'Searching...' : 'Look Up Fine'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Payment Form */
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Fine Details Card */}
                  <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Fine Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Car className="text-slate-400 mt-0.5 mr-3" size={20} />
                        <div>
                          <div className="text-sm text-slate-500">Vehicle No</div>
                          <div className="font-semibold text-slate-800">{fine.vehicleNo}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <ShieldAlert className="text-slate-400 mt-0.5 mr-3" size={20} />
                        <div>
                          <div className="text-sm text-slate-500">Violation</div>
                          <div className="font-semibold text-slate-800">{fine.categoryId.name}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="text-slate-400 mt-0.5 mr-3" size={20} />
                        <div>
                          <div className="text-sm text-slate-500">District</div>
                          <div className="font-semibold text-slate-800">{fine.districtId.name}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-end">
                      <div className="text-sm text-slate-500">Total Amount</div>
                      <div className="text-3xl font-extrabold text-indigo-600">
                        <span className="text-lg mr-1">LKR</span>
                        {fine.amount.$numberDecimal}
                      </div>
                    </div>
                  </div>

                  {/* Payment Input */}
                  <div className="flex-1">
                    <form onSubmit={payFine} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payer Name</label>
                        <input 
                          type="text" required
                          value={payerName} onChange={(e) => setPayerName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number (For Receipt)</label>
                        <input 
                          type="text" required placeholder="07XXXXXXXX"
                          value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Card Number (Mock)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCard size={18} className="text-slate-400" />
                          </div>
                          <input 
                            type="text" required placeholder="4000 1234 5678 9010"
                            value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 flex space-x-3">
                        <button 
                          type="button"
                          onClick={() => setFine(null)}
                          className="flex-1 bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-emerald-200"
                        >
                          {loading ? 'Processing...' : 'Pay Securely'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
