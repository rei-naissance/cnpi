import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '@/layouts/app-layout'
import LandingPage from '@/pages/landing'
import Dashboard from '@/pages/dashboard'
import Auth from '@/pages/auth'
import LinkPage from '@/pages/link'
import Redirect from '@/pages/redirect'
import NotFound from '@/pages/not-found'
import UrlProvider from '@/context'
import RequireAuth from '@/features/auth/components/require-auth'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      { path: '/auth', element: <Auth /> },
      {
        path: '/link/:id',
        element: (
          <RequireAuth>
            <LinkPage />
          </RequireAuth>
        ),
      },
      { path: '/:id', element: <Redirect /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App
