import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Scanner from './components/Scanner';
import AssetDetail from './components/AssetDetail';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddAsset from './components/AddAsset';
import EditAsset from './components/EditAsset';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/add-asset" element={
            <ProtectedRoute>
              <AddAsset />
            </ProtectedRoute>
          } />
          <Route path="/edit-asset/:id" element={
            <ProtectedRoute>
              <EditAsset />
            </ProtectedRoute>
          } />
          <Route path="/scan" element={
            <ProtectedRoute>
              <Scanner />
            </ProtectedRoute>
          } />
          <Route path="/asset/:id" element={
            <ProtectedRoute>
              <AssetDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
