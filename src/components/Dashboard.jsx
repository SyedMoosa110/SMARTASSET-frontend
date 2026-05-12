import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../api';
import { ArrowLeft, Search, Laptop, Monitor, Tablet, HardDrive, Cpu, Loader2, Filter, LayoutGrid, Plus, Shield, Activity, Sparkles, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ramFilter, setRamFilter] = useState('All');
  const [cpuFilter, setCpuFilter] = useState('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get('/api/assets/');
        setAssets(res.data);
      } catch (err) {
        console.error("Failed to fetch assets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleDeleteAsset = async (e, assetId, assetName) => {
    e.stopPropagation();
    console.log(`Triggering delete for asset: ${assetName} (${assetId})`);
    if (window.confirm(`Delete ${assetName}? This action cannot be undone.`)) {
      setDeleting(assetId);
      try {
        await api.delete(`/api/assets/${assetId}/`);
        // Remove from local state
        setAssets(assets.filter(a => a.id !== assetId));
        console.log("Delete successful");
      } catch (err) {
        console.error("Delete failed", err);
        alert('Failed to delete asset.');
      } finally {
        setDeleting(null);
      }
    }
  };

  const filteredAssets = assets.filter(asset => {
    const name = asset.name || '';
    const model = asset.asset_model || '';
    const serial = asset.serial_number || '';
    const ram = asset.ram || '';
    const cpu = asset.cpu || '';

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serial.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    const matchesRAM = ramFilter === 'All' || ram.toLowerCase().includes(ramFilter.toLowerCase());
    const matchesCPU = cpuFilter === 'All' || cpu.toLowerCase().includes(cpuFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesRAM && matchesCPU;
  });

  const getIcon = (model) => {
    if (!model) return <HardDrive size={20} />;
    const m = model.toLowerCase();
    if (m.includes('macbook') || m.includes('laptop') || m.includes('dell') || m.includes('thinkpad')) return <Laptop size={20} />;
    if (m.includes('monitor') || m.includes('screen')) return <Monitor size={20} />;
    if (m.includes('tablet') || m.includes('ipad')) return <Tablet size={20} />;
    return <HardDrive size={20} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header Section */}
      <div className="bg-slate-900/50 border-b border-white/5 pt-12 pb-8 px-6 md:px-12 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-500 hover:text-white mb-4 transition-all text-sm group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Portal
              </button>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <LayoutGrid className="text-violet-500" /> Inventory <span className="text-violet-500">Hub</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search assets, models, serials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 bg-slate-800/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 focus:bg-slate-800 transition-all text-sm"
                />
              </div>
              <button 
                onClick={() => navigate('/add-asset')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl btn-primary text-white text-sm font-black shadow-xl shadow-violet-500/20 whitespace-nowrap"
              >
                <Plus size={18} /> Add New Asset
              </button>
              
              <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/5">
                {['All', 'Available', 'Assigned'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${statusFilter === f ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border transition-all text-sm font-bold ${showAdvancedFilters ? 'bg-violet-600/20 border-violet-500/50 text-violet-400' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:text-white'}`}
              >
                <Filter size={18} /> Specs
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-6 pt-6 border-t border-white/5"
              >
                <div className="flex flex-wrap gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RAM Capacity</label>
                    <select 
                      value={ramFilter}
                      onChange={(e) => setRamFilter(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-violet-500 outline-none"
                    >
                      <option value="All">All RAM</option>
                      <option value="8GB">8GB</option>
                      <option value="16GB">16GB</option>
                      <option value="32GB">32GB</option>
                      <option value="64GB">64GB</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Processor Type</label>
                    <select 
                      value={cpuFilter}
                      onChange={(e) => setCpuFilter(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-violet-500 outline-none"
                    >
                      <option value="All">All CPUs</option>
                      <option value="i5">Core i5</option>
                      <option value="i7">Core i7</option>
                      <option value="i9">Core i9</option>
                      <option value="M1">Apple M1</option>
                      <option value="M2">Apple M2</option>
                      <option value="M3">Apple M3</option>
                      <option value="Ryzen">AMD Ryzen</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => { setRamFilter('All'); setCpuFilter('All'); setStatusFilter('All'); setSearchTerm(''); }}
                    className="text-[10px] font-black text-violet-500 uppercase tracking-widest hover:text-violet-400 transition-colors mb-2 ml-auto"
                  >
                    Reset All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Inventory', value: assets.length, icon: LayoutGrid, color: 'text-white' },
            { label: 'Available Units', value: assets.filter(a => a.status === 'Available').length, icon: Shield, color: 'text-emerald-400' },
            { label: 'Active Duty', value: assets.filter(a => a.status === 'Assigned').length, icon: Activity, color: 'text-violet-400' },
            { label: 'System Health', value: '98.2%', icon: Sparkles, color: 'text-blue-400' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-1 hover:border-violet-500/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={18} className={stat.color} />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global</span>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-violet-500" size={48} />
            <p className="text-slate-500 font-medium animate-pulse">Syncing with Central Database...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="glass-card p-6 cursor-pointer group relative overflow-hidden"
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div 
                      onClick={() => navigate(`/asset/${asset.id}`)}
                      className="p-3 bg-slate-800/50 rounded-2xl text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 shadow-inner cursor-pointer"
                    >
                      {getIcon(asset.asset_model)}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${asset.status === 'Available' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-violet-500/5 text-violet-500 border-violet-500/20'}`}>
                      {asset.status}
                    </span>
                  </div>

                  {/* QR Mini Preview */}
                  <div className="absolute top-20 right-6 w-16 h-16 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
                    {asset?.qr_code && (
                      <img 
                        src={asset.qr_code.startsWith('http') ? asset.qr_code : `${API_BASE_URL}${asset.qr_code}`} 
                        alt="QR" 
                        className="w-full h-full object-cover rounded-xl invert brightness-200"
                      />
                    )}
                  </div>
                  
                  <div 
                    onClick={() => navigate(`/asset/${asset.id}`)}
                    className="mb-6 relative z-10 cursor-pointer"
                  >
                    <h3 className="font-bold text-xl text-white mb-1 leading-tight group-hover:text-violet-400 transition-colors">{asset.name}</h3>
                    <p className="text-slate-500 text-sm font-medium tracking-tight">{asset.asset_model}</p>
                  </div>
                  
                  <div 
                    onClick={() => navigate(`/asset/${asset.id}`)}
                    className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10 mb-4 cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-wider">Processor</span>
                      <div className="flex items-center text-xs text-slate-300 font-bold"><Cpu size={12} className="mr-1.5 text-violet-500/50" /> {asset.cpu?.split(' ')?.[0] || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-wider">Memory</span>
                      <div className="flex items-center text-xs text-slate-300 font-bold"><HardDrive size={12} className="mr-1.5 text-violet-500/50" /> {asset.ram || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 relative z-50 mt-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-asset/${asset.id}`);
                      }}
                      className="flex-1 text-[10px] font-black bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg py-2 flex items-center justify-center gap-1 transition-all"
                      title="Edit Asset"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button 
                      onClick={(e) => handleDeleteAsset(e, asset.id, asset.name)}
                      disabled={deleting === asset.id}
                      className="flex-1 text-[10px] font-black bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-500/30 rounded-lg py-2 flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                      title="Delete Asset"
                    >
                      <Trash2 size={12} /> {deleting === asset.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {filteredAssets.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5"
          >
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">Zero Matches Found</h3>
            <p className="text-slate-600 text-sm">We couldn't find any assets matching "{searchTerm}"</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
