
import '@/app/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from '@/views/authentication/LoginView';
import { RegisterView } from '@/views/authentication/RegisterView';
import { Dashboard } from '@/views/main/Dashboard';
import { Calendar } from '@/views/main/Calendar';

import { TaskView } from '@/views/tasks/TaskView';
import { TaskEditView } from '@/views/tasks/TaskEditView';
import { MemberView } from '@/views/organization/MembersView';

import ProtectedRoute from '@/components/authentication/ProtectedRoute';
import { SidebarLayout } from '@/components/layouts/SidebarLayout';

import { AuthProvider } from '@/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/task/:projectId/:taskId" element={<TaskView />} />
            <Route path="/task/:projectId/:taskId/edit" element={<TaskEditView />} />
            <Route path="/:orgId/members" element={<MemberView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

