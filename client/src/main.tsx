import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProvider from './providers/user.tsx';
import { Dashboard, Login } from './pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<UserProvider />}>
        <Route element={<Dashboard />} path="/*" />
      </Route>
      <Route element={<Login />} path="/login" />
    </Route>
  )
);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
