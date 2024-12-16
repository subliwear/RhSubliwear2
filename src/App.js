import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Accueil from './pages/Accueil';
import Absences from './pages/Absences';
import Conge from './pages/Conge';
import Dashboard from './pages/Dashboard';
import Employes from './pages/Employes';
import Rapports from './pages/Rapports';
import './styles/main.css';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Accueil />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/absences" element={
          <ProtectedRoute>
            <MainLayout>
              <Absences />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/conges" element={
          <ProtectedRoute>
            <MainLayout>
              <Conge />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/employes" element={
          <ProtectedRoute>
            <MainLayout>
              <Employes />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/rapports" element={
          <ProtectedRoute>
            <MainLayout>
              <Rapports />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 