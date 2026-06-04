
import '@/app/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from '@/views/authentication/LoginView';
import { RegisterView } from '@/views/authentication/RegisterView';
import { Dashboard } from '@/views/main/Dashboard';
import ProtectedRoute from '@/components/authentication/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AuthProvider } from '@/context/AuthContext';
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

