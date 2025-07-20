import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// --- Lazy Loading Components ---
// Public Pages
const Homepage = lazy(() => import('../pages/public/Homepage'));
const Menu = lazy(() => import('../pages/public/Menu'));
const Checkout = lazy(() => import('../pages/public/Checkout'));
const Success = lazy(() => import('../pages/public/Success'));
const Reservation = lazy(() => import('../pages/public/Reservation'));
const LibroDeReclamaciones = lazy(() => import('../pages/public/LibroDeReclamaciones'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const GoogleAuthCallback = lazy(() => import('../pages/auth/GoogleAuthCallback'));

// User Pages
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const UserOrders = lazy(() => import('../pages/user/UserOrders'));
const UserReservations = lazy(() => import('../pages/user/UserReservations'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminReservations = lazy(() => import('../pages/admin/AdminReservations'));


// A simple loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen w-full">
    <p className="text-lg">Cargando...</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/checkout/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/libro-de-reclamaciones" element={<LibroDeReclamaciones />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

        {/* User Protected Routes */}
        <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        <Route path="/user/reservations" element={<ProtectedRoute><UserReservations /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/reservations" element={<AdminRoute><AdminReservations /></AdminRoute>} />

        {/* Fallback Route */}
        <Route path="*" element={<Homepage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;