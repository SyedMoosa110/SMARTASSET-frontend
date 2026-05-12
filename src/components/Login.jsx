import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Lock, User, Loader2, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/token/', {
        username,
        password,
      });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please verify your identity and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-violet-500/30 transform rotate-3">
            <Activity size={36} className="text-white -rotate-3" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">Core <span className="text-violet-500">Access</span></h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Hardware Intelligence System</p>
        </div>

        <div className="glass p-8 md:p-10 border-white/5">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity UID</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 focus:bg-slate-800 transition-all text-sm font-medium"
                    placeholder="Enter Username"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Passkey</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 focus:bg-slate-800 transition-all text-sm font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[10px] font-black uppercase tracking-wider text-center bg-red-500/5 py-3 rounded-xl border border-red-500/10"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Authenticate Access <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Unregistered entity? <Link to="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">Initialize Account</Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <ShieldCheck size={20} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Enterprise Grade Protocol</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
