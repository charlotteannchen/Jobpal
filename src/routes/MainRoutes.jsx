import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoutes';


// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const ProfilePage = Loadable(lazy(() => import('views/profile-page')));
const JobPage = Loadable(lazy(() => import('views/job-page')));
const JobDetail = Loadable(lazy(() => import('views/job-page/job-detail')));
const SkillPage = Loadable(lazy(() => import('views/skill-page')));
const SkillDetail = Loadable(lazy(() => import('views/skill-page/skill-detail')));
const LMDetail = Loadable(lazy(() => import('views/skill-page/lm-detail')));
const Test = Loadable(lazy(() => import('views/skill-page/test')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'profile-page',
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      )
    },
    {
      path: 'job-page',
      element: (
        <ProtectedRoute>
          <JobPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'job-detail',
      element: (
        <ProtectedRoute>
          <JobDetail />
        </ProtectedRoute>
      )
    },
    {
      path: 'skill-page',
      element: (
        <ProtectedRoute>
          <SkillPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'skill-detail',
      element: (
        <ProtectedRoute>
          <SkillDetail />
        </ProtectedRoute>
      )
    },
    {
      path: 'learning-material',
      element: (
        <ProtectedRoute>
          <LMDetail />
        </ProtectedRoute>
      )
    },
    {
      path: 'test',
      element: (
        <Test />
      )
    },
  ]
};

export default MainRoutes;
