import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import AdminLayout from 'src/layouts/AdminLayout'
import AuthLayout from 'src/layouts/AuthLayout'
import { ADMIN_PATHS } from './paths'

const SignInPage = lazy(() => import('src/pages/sign-in'))
const DashboardPage = lazy(() => import('src/pages/dashboard'))
const UsersPage = lazy(() => import('src/pages/users/index'))
const UserDetailPage = lazy(() => import('src/pages/users/[id]'))
const BaseEnvsPage = lazy(() => import('src/pages/base-envelopes/index'))
const NotFoundPage = lazy(() => import('src/pages/page-not-found'))

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
    <CircularProgress />
  </Box>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrap = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ADMIN_PATHS.signIn, element: wrap(SignInPage) },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: ADMIN_PATHS.dashboard, element: wrap(DashboardPage) },
      { path: ADMIN_PATHS.users, element: wrap(UsersPage) },
      { path: `${ADMIN_PATHS.users}/:id`, element: wrap(UserDetailPage) },
      { path: ADMIN_PATHS.baseEnvelopes, element: wrap(BaseEnvsPage) },
    ],
  },
  {
    path: '*',
    element: wrap(NotFoundPage),
  },
])
