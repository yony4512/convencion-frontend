import { Routes, Route } from 'react-router-dom';
import Homepage from '../pages/public/Homepage';
import Menu from '../pages/public/Menu';
import Checkout from '../pages/public/Checkout';
import Success from '../pages/public/Success';
import Reservation from '../pages/public/Reservation';
import LibroDeReclamaciones from '../pages/public/LibroDeReclamaciones';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import GoogleAuthCallback from '../pages/auth/GoogleAuthCallback';
import UserDashboard from '../pages/user/UserDashboard';
import UserOrders from '../pages/user/UserOrders';
import UserReservations from '../pages/user/UserReservations';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminReservations from '../pages/admin/AdminReservations';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;