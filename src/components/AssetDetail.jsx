import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../api';
import { ArrowLeft, Plus, Cpu, Database, Monitor, Send, Sparkles, Loader2, Calendar, User, Shield, Info, Download, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [response, setResponse] = useState('');

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const [showEditAssignModal, setShowEditAssignModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editEmployeeName, setEditEmployeeName] = useState('');
  const [editShift, setEditShift] = useState('Full-time');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await api.get(`/api/assets/${id}/`);
        setAsset(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAsset();
  }, [id]);

  const handleDownload = () => {
    if (!asset?.qr_code) return;
    const link = document.createElement('a');
    link.href = asset.qr_code.startsWith('http') ? asset.qr_code : `${API_BASE_URL}${asset.qr_code}`;
    link.download = `QR-${asset.serial_number}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [shift, setShift] = useState('Full-time');

  const handleAssign = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    try {
      await api.post('/api/assignments/', {
        asset: asset.id,
        employee_name: employeeName,
        shift: shift
      });
      
      // Re-fetch asset to get updated assignments
      const res = await api.get(`/api/assets/${id}/`);
      setAsset(res.data);
      
      setShowAssignModal(false);
      setEmployeeName('');
      alert(`Asset successfully assigned to ${employeeName} (${shift})`);
    } catch (err) {
      console.error(err);
      alert("Failed to assign asset. Please check server connection.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleSupportRequest = async (e) => {
    e.preventDefault();
    if (!query) return;

    setChatLoading(true);
    setResponse('');
    try {
      const res = await api.post(`/api/assets/${id}/support/`, { query });
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setResponse("Network bottleneck: Failed to communicate with AI core. Please check your encryption protocols.");
    } finally {
      setChatLoading(false);
    }
  };

  // UI helpers
  const getAssignmentForShift = (s) => asset.assignments?.find(a => a.shift === s);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-4">
      <Loader2 className="animate-spin text-violet-500" size={64} />
      <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Deciphering Asset Data</p>
    </div>
  );

  if (!asset) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-6 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
        <Info size={40} className="text-red-500" />
      </div>
      <h2 className="text-3xl font-black text-white mb-2">Entity Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-sm">The requested asset identifier does not exist in our secure ledger.</p>
      <button onClick={() => navigate('/')} className="btn-primary px-8 py-3 rounded-xl font-bold text-white">Return to Secure Zone</button>
    </div>
  );

  const handleDelete = async () => {
    if (window.confirm(`Are you certain you wish to PERMANENTLY DE-INITIALIZE ${asset.name}? This action is irreversible.`)) {
      try {
        await api.delete(`/api/assets/${id}/`);
        alert("Asset identity purged from secure ledger.");
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        alert("De-initialization failed. Target might be locked or network unstable.");
      }
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    console.log(`Triggering delete for assignment: ${assignmentId}`);
    if (window.confirm('Remove this asset assignment?')) {
      try {
        await api.delete(`/api/assignments/${assignmentId}/`);
        // Re-fetch asset to get updated assignments
        const res = await api.get(`/api/assets/${id}/`);
        setAsset(res.data);
        console.log("Assignment delete successful");
        alert('Assignment removed successfully.');
      } catch (err) {
        console.error("Assignment delete failed", err);
        alert('Failed to delete assignment.');
      }
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setEditEmployeeName(assignment.employee_name);
    setEditShift(assignment.shift);
    setShowEditAssignModal(true);
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put(`/api/assignments/${editingAssignment.id}/`, {
        asset: asset.id,
        employee_name: editEmployeeName,
        shift: editShift,
        assignment_date: editingAssignment.assignment_date,
        return_date: editingAssignment.return_date
      });
      
      // Re-fetch asset to get updated assignments
      const res = await api.get(`/api/assets/${id}/`);
      setAsset(res.data);
      
      setShowEditAssignModal(false);
      alert('Assignment updated successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to update assignment.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[30%] h-[40%] bg-emerald-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-all group font-bold text-sm uppercase tracking-wider"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Fleet
            </button>
            <div className="flex items-center gap-4 mb-2">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${asset.assignments?.length === 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-violet-500/10 text-violet-500 border-violet-500/20'}`}>
                {asset.assignments?.length === 0 ? 'Available' : 'Active Duty'}
              </span>
              <span className="text-slate-600 text-xs font-bold font-mono tracking-tighter">UID: {asset.serial_number}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">{asset.name}</h1>
            <p className="text-slate-500 text-xl md:text-2xl mt-2 font-medium">{asset.asset_model}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 relative z-50">
             <button 
                onClick={handleDownload}
                title="Download QR Code"
                className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-xl"
             >
                <Download size={20} />
             </button>
             <button 
                onClick={() => navigate(`/edit-asset/${id}`)}
                className="px-6 py-4 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
             >
                <Plus size={20} className="rotate-45" /> Edit Parameters
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-xl"
             >
                <Info size={20} /> Purge Record
             </button>
             <button 
                onClick={() => setShowAssignModal(true)}
                disabled={asset.assignments?.some(a => a.shift === 'Full-time') || (asset.assignments?.some(a => a.shift === 'Morning') && asset.assignments?.some(a => a.shift === 'Evening'))}
                className="px-8 py-4 rounded-2xl btn-primary text-white font-bold flex items-center gap-3 transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <Shield size={20} /> Assign Shift
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Hardware Specs & Assignment Status */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 relative group"
            >
              <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]"></div>
              <div className="relative z-10">
                {asset?.qr_code && (
                  <img 
                    src={asset.qr_code.startsWith('http') ? asset.qr_code : `${API_BASE_URL}${asset.qr_code}`} 
                    alt="Asset QR" 
                    className="w-full aspect-square rounded-2xl mb-8 border border-white/10 shadow-2xl invert opacity-90 p-4 bg-white/5"
                  />
                )}
                
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <div className="w-1 h-1 bg-violet-500 rounded-full"></div> Deployment Record
                </h3>
                
                <div className="space-y-4">
                   {/* Shift Info Cards */}
                   {['Morning', 'Evening', 'Full-time'].map((s) => {
                     const assignment = asset.assignments?.find(a => a.shift === s);
                     if (s === 'Full-time' && !assignment && asset.assignments?.length > 0) return null;
                     if ((s === 'Morning' || s === 'Evening') && asset.assignments?.some(a => a.shift === 'Full-time')) return null;

                     return (
                       <div key={s} className={`p-4 rounded-2xl border transition-all ${assignment ? 'bg-violet-600/10 border-violet-500/30' : 'bg-slate-900/50 border-white/5 opacity-50'}`}>
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s} Shift</span>
                             {assignment ? <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> : <div className="w-2 h-2 bg-slate-700 rounded-full"></div>}
                          </div>
                          {assignment ? (
                            <div>
                               <p className="text-sm font-bold text-white mb-1">{assignment.employee_name}</p>
                               <p className="text-[10px] text-slate-500 font-medium mb-3">Duty assigned on {new Date(assignment.assignment_date).toLocaleDateString()}</p>
                               <div className="flex gap-2 relative z-50 mt-4">
                                 <button 
                                   onClick={() => handleEditAssignment(assignment)}
                                   className="flex-1 text-[10px] font-black bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg py-2 flex items-center justify-center gap-1 transition-all"
                                 >
                                   <Edit size={12} /> Edit
                                 </button>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); handleDeleteAssignment(assignment.id); }}
                                   className="flex-1 text-[10px] font-black bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-500/30 rounded-lg py-2 flex items-center justify-center gap-1 transition-all"
                                 >
                                   <Trash2 size={12} /> Delete
                                 </button>
                               </div>
                            </div>
                          ) : (
                            <p className="text-xs font-bold text-slate-600">Unassigned</p>
                          )}
                       </div>
                     );
                   })}
                </div>
              </div>
            </motion.div>

            <div className="glass p-8">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">System Health Analysis</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Performance', score: asset.cpu?.includes('i9') || asset.cpu?.includes('M2') ? 95 : asset.cpu?.includes('i7') ? 85 : 70, color: 'bg-violet-500' },
                    { label: 'Portability', score: asset.asset_model?.includes('MacBook') || asset.asset_model?.includes('XPS') ? 90 : 60, color: 'bg-emerald-500' },
                    { label: 'Reliability', score: 98, color: 'bg-blue-500' }
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{stat.label}</span>
                          <span className="text-white">{stat.score}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.score}%` }}
                            transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                            className={`h-full ${stat.color} rounded-full`}
                          ></motion.div>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <Shield size={18} className="text-emerald-500" />
                  <p className="text-xs font-bold text-emerald-500/80">Active Protection Enabled</p>
               </div>
            </div>

            <div className="glass p-8">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Inventory Metadata</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acquired</span>
                     <span className="text-xs font-bold text-slate-300">{asset.purchase_date || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Initial State</span>
                     <span className={`text-xs font-black uppercase tracking-widest ${asset.condition === 'New' ? 'text-emerald-400' : 'text-amber-400'}`}>{asset.condition}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OS Environment</span>
                     <span className="text-xs font-bold text-slate-300">{asset.os || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processor Unit</span>
                     <span className="text-xs font-bold text-slate-300">{asset.cpu || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RAM Capacity</span>
                     <span className="text-xs font-bold text-slate-300">{asset.ram || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">External Hardware</span>
                     <span className="text-xs font-bold text-slate-300">{asset.external_storage || 'None'}</span>
                  </div>
                  {asset.external_storage_size && (
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ext. Capacity</span>
                       <span className="text-xs font-bold text-slate-300">{asset.external_storage_size}</span>
                    </div>
                  )}
               </div>
               {asset.additional_notes && (
                 <div className="mt-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Technician Notes</span>
                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-white/5">{asset.additional_notes}</p>
                 </div>
               )}
            </div>
          </div>

          {/* AI Intelligence Panel */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass overflow-hidden flex flex-col min-h-[700px]"
            >
              <div className="bg-slate-900/50 p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center border border-violet-500/30">
                    <Sparkles className="text-violet-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Gemini Intelligence Core</h3>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Secure Connection Active
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500"><Info size={16} /></div>
                </div>
              </div>

              <div className="flex-grow p-8 overflow-y-auto space-y-6">
                <div className="flex gap-4 items-start max-w-[85%]">
                  <div className="w-8 h-8 bg-violet-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="bg-slate-900/80 p-5 rounded-2xl rounded-tl-none border border-white/5 shadow-xl">
                    <p className="text-sm leading-relaxed text-slate-300">
                      Welcome, User. I am the Gemini Intelligence Unit assigned to Fleet Management. 
                      I have full telemetry for the <span className="text-violet-400 font-bold">{asset.asset_model}</span>. 
                      Please state your technical inquiry or troubleshoot requirement.
                    </p>
                  </div>
                </div>
                
                <AnimatePresence>
                  {response && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 items-start flex-row-reverse"
                    >
                      <div className="w-8 h-8 bg-emerald-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      <div className="bg-violet-600/10 p-6 rounded-2xl rounded-tr-none border border-violet-500/20 text-slate-100 shadow-2xl max-w-[85%]">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">{response}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {chatLoading && (
                  <div className="flex items-center gap-3 text-violet-400 text-xs font-black uppercase tracking-widest py-4">
                    <Loader2 size={16} className="animate-spin" /> Synthesizing Solution...
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-900/30 border-t border-white/5">
                <form onSubmit={handleSupportRequest} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                  <div className="relative flex items-center bg-slate-900 rounded-xl border border-white/10 px-4">
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Input diagnostic query..."
                      className="flex-grow bg-transparent py-5 pl-2 pr-12 focus:outline-none text-sm font-medium"
                      disabled={chatLoading}
                    />
                    <button 
                      type="submit"
                      disabled={chatLoading || !query}
                      className="p-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all disabled:opacity-30 shadow-lg shadow-violet-500/20"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Simple Assignment Modal for Troubleshooting */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            onClick={() => setShowAssignModal(false)}
            className="absolute inset-0 bg-black/90"
          ></div>
          
          <div className="w-full max-w-md bg-slate-900 border-2 border-violet-500 p-8 rounded-3xl relative z-[10000] shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-4">ASSIGN ASSET</h2>
            
            <form onSubmit={handleAssign} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee Name</label>
                <input 
                  type="text" 
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl py-4 px-4 focus:outline-none focus:border-violet-500 text-white"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Shift</label>
                <select 
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl py-4 px-4 focus:outline-none focus:border-violet-500 text-white appearance-none cursor-pointer"
                >
                  <option value="Morning">Morning (9 AM - 1 PM)</option>
                  <option value="Evening">Evening (2 PM - 6 PM)</option>
                  <option value="Full-time">Full-time (All Day)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-grow py-4 rounded-xl bg-slate-800 text-white font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={assignLoading}
                  className="flex-[2] bg-violet-600 text-white font-black py-4 rounded-xl"
                >
                  {assignLoading ? "Processing..." : "CONFIRM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditAssignModal && editingAssignment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            onClick={() => setShowEditAssignModal(false)}
            className="absolute inset-0 bg-black/90"
          ></div>
          
          <div className="w-full max-w-md bg-slate-900 border-2 border-blue-500 p-8 rounded-3xl relative z-[10000] shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-4">EDIT ASSIGNMENT</h2>
            
            <form onSubmit={handleUpdateAssignment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee Name</label>
                <input 
                  type="text" 
                  value={editEmployeeName}
                  onChange={(e) => setEditEmployeeName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl py-4 px-4 focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Shift</label>
                <select 
                  value={editShift}
                  onChange={(e) => setEditShift(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl py-4 px-4 focus:outline-none focus:border-blue-500 text-white appearance-none cursor-pointer"
                >
                  <option value="Morning">Morning (9 AM - 1 PM)</option>
                  <option value="Evening">Evening (2 PM - 6 PM)</option>
                  <option value="Full-time">Full-time (All Day)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowEditAssignModal(false)}
                  className="flex-grow py-4 rounded-xl bg-slate-800 text-white font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={editLoading}
                  className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-xl"
                >
                  {editLoading ? "Updating..." : "UPDATE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetail;
