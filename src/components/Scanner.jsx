import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Shield, Zap, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

const Scanner = () => {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [manualId, setManualId] = useState('');
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data && scanning) {
      setScanning(false);
      const scannedText = data.text;
      
      try {
        // Extract ID from URL like http://.../asset/48 or just the ID itself
        const urlParts = scannedText.split('/');
        const id = urlParts[urlParts.length - 1];
        
        if (id && !isNaN(id)) {
          navigate(`/asset/${id}`);
        } else {
          setScanning(true);
        }
      } catch (e) {
        setScanning(true);
      }
    }
  };

  const handleError = (err) => {
    console.error("Scanner Error:", err);
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      setError("No camera detected. Please check your hardware.");
    } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      setError("Camera permission denied. Use HTTPS or localhost for camera access.");
    } else {
      setError("Camera initialization failed. Browser might be blocking non-HTTPS camera access.");
    }
  };

  const previewStyle = {
    height: 480,
    width: '100%',
    objectFit: 'cover',
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]"></div>
      </div>

      <div className="max-w-md mx-auto w-full relative z-10 flex-grow flex flex-col">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-all group font-black text-[10px] uppercase tracking-[0.3em]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Abort Mission
        </button>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-violet-500" />
             </div>
             <h2 className="text-2xl font-black uppercase tracking-tight">Smart <span className="text-violet-500">Scanner</span></h2>
          </div>
          <p className="text-slate-500 text-sm font-medium">Align the QR code within the target frame to authenticate hardware identity.</p>
        </header>

        <div className="relative flex-grow max-h-[500px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-black shadow-2xl shadow-violet-500/10">
          {scanning && (
            <QrScanner
              delay={200}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
              constraints={{ video: { facingMode: 'environment' } }}
            />
          )}

          {/* Scanner Overlay UI */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark mask with cutout */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* The Target Frame */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/10 rounded-3xl">
               {/* Corner brackets */}
               <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-violet-500 rounded-tl-xl"></div>
               <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-violet-500 rounded-tr-xl"></div>
               <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-violet-500 rounded-bl-xl"></div>
               <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-violet-500 rounded-br-xl"></div>
               
               {/* Scanning Line Animation */}
               <motion.div 
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent shadow-[0_0_15px_rgba(139,92,246,0.8)]"
               ></motion.div>
            </div>

            <div className="absolute bottom-10 left-0 w-full text-center">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">Scanning for Identity...</span>
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Manual Fallback */}
        <div className="mt-8 space-y-4">
           {!scanning && (
             <button 
               onClick={() => { setScanning(true); setError(null); }}
               className="w-full py-4 bg-violet-600 rounded-2xl font-black uppercase tracking-widest text-xs"
             >
               Reset Scanner
             </button>
           )}
           <div className="text-center">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">OR ENTER ID MANUALLY</span>
           </div>
           <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Asset ID (e.g. 48)"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
              />
              <button 
                onClick={() => manualId && navigate(`/asset/${manualId}`)}
                className="bg-slate-800 px-6 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-violet-600 transition-colors"
              >
                GO
              </button>
           </div>
        </div>

        <div className="mt-auto py-10 flex justify-between items-center opacity-40">
           <div className="flex items-center gap-2">
              <Shield size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
           </div>
           <div className="flex items-center gap-2">
              <Maximize size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">Auto-Focus</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
