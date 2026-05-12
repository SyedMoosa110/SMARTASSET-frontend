import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Cpu, ShieldCheck, LogOut, ArrowRight, Activity, Box, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="w-full px-6 md:px-12 py-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Activity className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-white hidden sm:block">SMART<span className="text-violet-500">ASSET</span></span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-sm font-medium border border-white/5"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 z-10 text-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} /> AI-Powered Asset Intelligence
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-black mb-6 gradient-text leading-[1.1] tracking-tight">
            The Future of <br/>Hardware Tracking
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-slate-400 text-base md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience a seamless ecosystem for office asset management. 
            Automated QR indexing combined with Gemini AI troubleshooting.
          </motion.p>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 text-left">
            <Link to="/scan" className="glass-card p-8 group">
              <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-500 transition-colors">
                <QrCode size={24} className="text-violet-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Smart QR Scanner</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Instant hardware recognition with automatic assignment history retrieval.</p>
              <div className="flex items-center text-violet-400 text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                OPEN SCANNER <ArrowRight size={14} />
              </div>
            </Link>

            <Link to="/dashboard" className="glass-card p-8 group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                <Box size={24} className="text-emerald-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Asset Inventory</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">A complete digital twin of your office hardware with AI support built-in.</p>
              <div className="flex items-center text-emerald-400 text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                VIEW DASHBOARD <ArrowRight size={14} />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link 
              to="/scan"
              className="btn-primary text-white px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-3 mx-auto w-fit"
            >
              Start Intelligent Scan <Activity size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Navigation */}
      <footer className="w-full px-6 py-12 flex flex-col items-center justify-center gap-8 border-t border-white/5 bg-slate-950/50">
        <div className="flex gap-12 opacity-40">
          <Link to="/dashboard" className="flex flex-col items-center hover:opacity-100 hover:text-violet-400 transition-all">
            <Cpu size={20} /> 
            <span className="text-[10px] mt-2 font-black uppercase tracking-widest">Hardware</span>
          </Link>
          <div onClick={() => alert("Security: 256-bit JWT Encryption Active")} className="flex flex-col items-center hover:opacity-100 hover:text-emerald-400 transition-all cursor-pointer">
            <ShieldCheck size={20} /> 
            <span className="text-[10px] mt-2 font-black uppercase tracking-widest">Security</span>
          </div>
          <Link to="/scan" className="flex flex-col items-center hover:opacity-100 hover:text-amber-400 transition-all">
            <QrCode size={20} /> 
            <span className="text-[10px] mt-2 font-black uppercase tracking-widest">QR Scan</span>
          </Link>
        </div>
        <div className="text-slate-600 text-[10px] font-medium tracking-[0.2em] uppercase">
          &copy; 2026 Smart Asset Intelligence • Enterprise Grade
        </div>
      </footer>
    </div>
  );
};

export default Home;
