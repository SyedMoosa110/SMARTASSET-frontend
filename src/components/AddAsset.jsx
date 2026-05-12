import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Plus, Laptop, Cpu, Database, Monitor, Save, Loader2, ShieldCheck, Calendar, Info, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

const AddAsset = () => {
  const [formData, setFormData] = useState({
    name: '',
    asset_model: '',
    serial_number: '',
    ram: '16GB',
    os: 'Windows 11 Pro',
    cpu: 'Intel Core i7',
    purchase_date: '',
    condition: 'New',
    external_storage: 'None',
    external_storage_size: 'N/A',
    additional_notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/assets/', formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error("Failed to add asset", err);
      alert("Error: Serial number must be unique or server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden">
      {/* Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[40%] bg-emerald-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-all group font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Hub
        </button>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Initialize <span className="text-violet-500">New Asset</span></h1>
          <p className="text-slate-500 font-medium">Enter technical specifications to generate a new hardware entry and QR identity.</p>
        </header>

        <div className="glass p-8 md:p-12 border-white/5">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                <ShieldCheck size={40} className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 uppercase">Asset Registered</h2>
              <p className="text-slate-500">Synchronizing database and generating QR identity...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div> Core Identity
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Name</label>
                    <div className="relative">
                      <Laptop className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        type="text" name="name" required
                        value={formData.name} onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium"
                        placeholder="e.g. Laptop 021"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hardware Model</label>
                    <div className="relative">
                      <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        type="text" name="asset_model" required
                        value={formData.asset_model} onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium"
                        placeholder="e.g. Dell XPS 15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Unique Serial Number</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        type="text" name="serial_number" required
                        value={formData.serial_number} onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium"
                        placeholder="e.g. SN-998877"
                      />
                    </div>
                  </div>
                </div>

                {/* Tech Specs */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Technical Specs
                  </h3>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">OS Environment</label>
                    <div className="relative">
                      <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <select 
                        name="os" required
                        value={formData.os} onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium appearance-none"
                      >
                        <option value="Windows 11 Pro">Windows 11 Pro</option>
                        <option value="Windows 10 Pro">Windows 10 Pro</option>
                        <option value="macOS Sonoma">macOS Sonoma</option>
                        <option value="macOS Ventura">macOS Ventura</option>
                        <option value="Ubuntu 22.04">Ubuntu 22.04</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Processor Unit</label>
                    <div className="relative">
                      <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <select 
                        name="cpu" required
                        value={formData.cpu} onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium appearance-none"
                      >
                        <option value="Intel Core i5">Intel Core i5</option>
                        <option value="Intel Core i7">Intel Core i7</option>
                        <option value="Intel Core i9">Intel Core i9</option>
                        <option value="Apple M1">Apple M1</option>
                        <option value="Apple M2">Apple M2</option>
                        <option value="Apple M3">Apple M3</option>
                        <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                        <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RAM Capacity</label>
                    <div className="relative">
                      <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <select 
                        name="ram" required
                        value={formData.ram} onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium appearance-none"
                      >
                        <option value="8GB">8GB</option>
                        <option value="16GB">16GB</option>
                        <option value="32GB">32GB</option>
                        <option value="64GB">64GB</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acquisition & Extras */}
              <div className="pt-8 border-t border-white/5">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Acquisition & Extras
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Purchase Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input 
                          type="date" name="purchase_date"
                          value={formData.purchase_date} onChange={handleChange}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium"
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Device Condition</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <select 
                          name="condition"
                          value={formData.condition} onChange={handleChange}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium appearance-none"
                        >
                          <option value="New">Brand New</option>
                          <option value="Used">Pre-owned / Refurbished</option>
                        </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">External Hardware</label>
                      <div className="relative">
                        <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <select 
                          name="external_storage"
                          value={formData.external_storage} onChange={handleChange}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium appearance-none"
                        >
                          <option value="None">None</option>
                          <option value="SSD">SSD</option>
                          <option value="HDD">HDD</option>
                          <option value="M.2 NVMe">M.2 NVMe</option>
                          <option value="External Hub">External Hub</option>
                          <option value="Docking Station">Docking Station</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">External Storage Size</label>
                      <div className="relative">
                        <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <select 
                          name="external_storage_size"
                          value={formData.external_storage_size} onChange={handleChange}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium appearance-none"
                        >
                          <option value="N/A">N/A</option>
                          <option value="256GB">256GB</option>
                          <option value="512GB">512GB</option>
                          <option value="1TB">1TB</option>
                          <option value="2TB">2TB</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                   </div>

                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Additional Notes</label>
                      <div className="relative">
                        <Info className="absolute left-4 top-6 text-slate-600" size={18} />
                        <textarea 
                          name="additional_notes"
                          value={formData.additional_notes} onChange={handleChange}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium min-h-[56px]"
                          placeholder="Any extra details..."
                        />
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs shadow-2xl shadow-violet-500/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      Register Asset & Generate Identity <Save size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAsset;
