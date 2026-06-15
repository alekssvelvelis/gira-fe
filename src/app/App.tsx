
import '@/app/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from '@/views/authentication/LoginView';
import { RegisterView } from '@/views/authentication/RegisterView';
import { Dashboard } from '@/views/main/Dashboard';

import { TaskView } from '@/views/tasks/TaskView';
import { TaskEditView } from '@/views/tasks/TaskEditView';
import { TaskCreateView } from '@/views/tasks/TaskCreateView';

import { MemberView } from '@/views/management/MembersView';
import { SingleMemberView } from '@/views/user/SingleMemberView';
import { UserEditView } from '@/views/user/UserEditView';

import { OrganizationsView } from '@/views/management/organization/OrganizationsView';
import { SingleOrganizationView } from '@/views/management/organization/SingleOrganizationView';
import { SingleOrganizationEditView } from '@/views/management/organization/OrganizationEditView';
import { SingleOrganizationCreateView } from '@/views/management/organization/OrganizationCreateView';

import { ProjectCreateView } from '@/views/management/projects/ProjectCreateView';
import { ProjectEditView } from '@/views/management/projects/ProjectEditView';
import { SingleProjectView } from '@/views/management/projects/SingleProjectView';

import { AcceptInvitationView } from '@/views/AcceptInviationView';

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
          <Route path="/invitations/:token" element={<AcceptInvitationView />} />
          <Route element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/member/:userId" element={<SingleMemberView />} />
            <Route path="/member/:userId/edit" element={<UserEditView />} />

            <Route path="/organizations" element={<OrganizationsView />} />
            <Route path="/organization/:orgId" element={<SingleOrganizationView />} />
            <Route path="/organization/:orgId/members" element={<MemberView />} />
            <Route path="/organization/:orgId/edit" element={<SingleOrganizationEditView />} />
            <Route path="/organization/create" element={<SingleOrganizationCreateView />} />

            <Route path="/organization/:orgId/projects/create" element={<ProjectCreateView />} />
            <Route path="/organization/:orgId/project/:projId" element={<SingleProjectView />} />
            <Route path="/organization/:orgId/project/:projId/edit" element={<ProjectEditView />} />

            <Route path="/organization/:orgId/project/:projId/tasks/:taskId" element={<TaskView />} />
            <Route path="/organization/:orgId/project/:projId/tasks/:taskId/edit" element={<TaskEditView />} />
            <Route path="/organization/:orgId/project/:projId/tasks/create" element={<TaskCreateView />} />

           </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

