import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import App from './app';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';


// ----------------------------------------------------------------------
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    Component: () => (
      <QueryClientProvider client={queryClient}>
        <App>
          <Outlet />
        </App>
      </QueryClientProvider>

    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);


const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
