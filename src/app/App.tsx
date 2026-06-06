
import '@/app/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from '@/views/authentication/LoginView';
import { RegisterView } from '@/views/authentication/RegisterView';
import { Dashboard } from '@/views/main/Dashboard';
import { Calendar } from '@/views/main/Calendar';

import { TaskView } from '@/views/tasks/TaskView';
import { TaskEditView } from '@/views/tasks/TaskEditView';
import { MemberView } from '@/views/management/MembersView';
import { OrganizationsView } from '@/views/management/OrganizationsView';
import { SingleOrganizationView } from '@/views/management/SingleOrganizationView';
import { SingleOrganizationEditView } from '@/views/management/SingleOrganizationEditView';
import { SingleMemberView } from '@/views/user/SingleMemberView';
import { UserEditView } from '@/views/user/UserEditView';

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
            <Route path="/member/:userId" element={<SingleMemberView />} />
            <Route path="/member/:userId/edit" element={<UserEditView />} />
            {/* <Route path="/organizations/:ordId/projects" element={<ProjectsView />} /> */}
            {/* <Route path="/organizations/:ordId/projects/create" element={<ProjectCreateView />} /> */}
            {/* <Route path="/organizations/:ordId/projects/:projId/edit" element={<ProjectEditView />} /> */}
            <Route path="/organizations" element={<OrganizationsView />} />
            <Route path="/organization/:orgId" element={<SingleOrganizationView />} />
            <Route path="/organization/:orgId/edit" element={<SingleOrganizationEditView />} />
            {/* <Route path="/organizations/create" element={<SingleOrganizationCreateView />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

