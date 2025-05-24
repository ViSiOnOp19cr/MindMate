
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';

// Import pages directly
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NotePage from './pages/NotePage';
import AIChat from './pages/AIChat';
import NotFound from './pages/NotFound';

// Layouts
const RootLayout = () => <Outlet />;
const AuthLayout = () => <Outlet />;

// Authentication guard component
const RequireAuth = ({ children }: { children: ReactNode }) => {
  // Use localStorage safely with client-side check
  const isAuthenticated = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            {/* Public routes */}
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            
            {/* Protected routes */}
            <Route element={
              <RequireAuth>
                <ProtectedLayout />
              </RequireAuth>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<NotePage />} />
              <Route path="/ai-chat" element={<AIChat />} />
            </Route>
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}
