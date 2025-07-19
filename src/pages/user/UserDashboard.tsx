import { useState, useEffect } from 'react';
import { User, ShoppingBag, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import UserSidebar from '../../components/user/UserSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import UserOrderDetailModal from '../../components/user/UserOrderDetailModal';
import UserReservationDetailModal, { ReservationDetail } from '../../components/user/UserReservationDetailModal';
import ReviewForm from './ReviewForm';
import apiClient from '../../config/apiClient';

// Tipos de datos
interface OrderSummary {
  id: number;
  total_amount: number;
  status: string;
  createdAt: string;
  items_count: number;
}

interface ReservationSummary {
  id: number;
  date: string;
  time: string;
  people: number;
  status: string;
}

interface OrderDetail extends OrderSummary {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  items: any[] | string;
}

const UserDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para los modales
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isReservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
                const response = await apiClient.get<OrderSummary[]>('/orders/my-orders');
        const data = response.data;
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReservations = async () => {
      try {
                const response = await apiClient.get<ReservationSummary[]>('/reservations');
        const data = response.data;
        setReservations(data || []);
      } catch (err) {
        // Puedes agregar manejo de error aquí si quieres
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
      fetchReservations();
    }
  }, [user]);

  // Handlers para abrir modales
  const handleViewOrder = async (orderId: number) => {
    setModalLoading(true);
    setOrderModalOpen(true);
    try {
            const response = await apiClient.get<OrderDetail>(`/orders/${orderId}`);
      const data = response.data;
      setSelectedOrder(data);
    } catch (err) {
      console.error(err);
      // Opcional: mostrar error en el modal
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewReservation = async (reservationId: number) => {
    setModalLoading(true);
    setReservationModalOpen(true);
    try {
            const response = await apiClient.get<ReservationDetail>(`/reservations/${reservationId}`);
      const data = response.data;
      setSelectedReservation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const totalOrders = orders.length;
  const lastOrderDate = totalOrders > 0 ? format(new Date(orders[0].createdAt), 'dd \'de\' MMMM, yyyy', { locale: es }) : 'N/A';

  const lastReservation =
    reservations.length > 0
      ? [...reservations]
          .map(r => ({
            ...r,
            fullDate: new Date(`${r.date.substring(0, 10)}T${r.time}`),
          }))
          .sort((a, b) => b.fullDate.getTime() - a.fullDate.getTime())[0]
      : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <UserSidebar activePage="dashboard" className="hidden md:block" />

          {/* Mobile menu */}
          <div className="md:hidden w-full">
            <button
              type="button"
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="font-medium">Menú de Usuario</span>
              <ChevronRight className={`transform transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
            </button>
            
            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-lg shadow-sm overflow-hidden">
                <UserSidebar activePage="dashboard" className="block" />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <User size={32} />
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold">Bienvenido, {user?.name || 'Usuario'}</h1>
                  <p className="text-gray-600">¿Qué deseas ordenar hoy?</p>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Último pedido</p>
                    <p className="text-lg font-semibold">{lastOrderDate}</p>
                  </div>
                  <ShoppingBag className="text-yellow-500" size={24} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total de pedidos</p>
                    <p className="text-lg font-semibold">{totalOrders}</p>
                  </div>
                  <ShoppingBag className="text-green-500" size={24} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Última reserva</p>
                    <p className="text-lg font-semibold">
                      {loading ? 'Cargando...' : lastReservation ? format(lastReservation.fullDate, "dd 'de' MMMM, yyyy HH:mm", { locale: es }) : 'No hay reservas'}
                    </p>
                  </div>
                  <Calendar className="text-red-500" size={24} />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 flex justify-between items-center border-b">
                <h2 className="text-xl font-bold">Pedidos Recientes</h2>
                <Link to="/user/orders" className="text-sm font-medium text-primary-600 hover:underline">
                  Ver todos
                </Link>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <p className="p-6 text-center">Cargando pedidos...</p>
                ) : error ? (
                  <p className="p-6 text-center text-red-500">{error}</p>
                ) : orders.length === 0 ? (
                  <p className="p-6 text-center text-gray-500">No has realizado ningún pedido todavía.</p>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-4 font-medium">PEDIDO</th>
                        <th className="p-4 font-medium">FECHA</th>
                        <th className="p-4 font-medium">TOTAL</th>
                        <th className="p-4 font-medium">ESTADO</th>
                        <th className="p-4 font-medium">ITEMS</th>
                        <th className="p-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-4 font-medium text-gray-800">ORD{String(order.id).padStart(4, '0')}</td>
                          <td className="p-4">{format(new Date(order.createdAt), 'dd \'de\' MMMM, yyyy', { locale: es })}</td>
                          <td className="p-4">S/ {Number(order.total_amount).toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">{order.items_count}</td>
                          <td className="p-4">
                            <button onClick={() => handleViewOrder(order.id)} className="font-medium text-primary-600 hover:underline">
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Recent Reservations */}
            <div className="bg-white rounded-lg shadow-sm mt-8">
              <div className="p-6 flex justify-between items-center border-b">
                <h2 className="text-xl font-bold">Reservas Recientes</h2>
                <Link to="/user/reservations" className="text-sm font-medium text-primary-600 hover:underline">
                  Ver todas
                </Link>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <p className="p-6 text-center">Cargando reservas...</p>
                ) : reservations.length === 0 ? (
                  <p className="p-6 text-center text-gray-500">No tienes ninguna reserva.</p>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-4 font-medium">RESERVA</th>
                        <th className="p-4 font-medium">FECHA</th>
                        <th className="p-4 font-medium">HORA</th>
                        <th className="p-4 font-medium">PERSONAS</th>
                        <th className="p-4 font-medium">ESTADO</th>
                        <th className="p-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.slice(0, 5).map((reservation) => (
                        <tr key={reservation.id} className="border-b">
                          <td className="p-4 font-medium text-gray-800">RSV{String(reservation.id).padStart(4, '0')}</td>
                          <td className="p-4">{format(new Date(reservation.date), 'dd/MM/yyyy')}</td>
                          <td className="p-4">{reservation.time}</td>
                          <td className="p-4 text-center">{reservation.people}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              reservation.status === 'confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <button onClick={() => handleViewReservation(reservation.id)} className="font-medium text-primary-600 hover:underline">
                              Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Sección para dejar reseña */}
            <div id="review" className="bg-white rounded-lg shadow-sm mt-8 p-6">
              <h2 className="text-xl font-bold mb-4">Dejar Reseña</h2>
              <ReviewForm user={user} />
            </div>

          </div>
        </div>
      </div>

      {/* Modales */}
      {selectedOrder && (
        <UserOrderDetailModal 
          isOpen={isOrderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          order={selectedOrder}
          isLoading={modalLoading}
        />
      )}

      {selectedReservation && (
        <UserReservationDetailModal 
          isOpen={isReservationModalOpen}
          onClose={() => setReservationModalOpen(false)}
          reservation={selectedReservation}
          isLoading={modalLoading}
        />
      )}

    </div>
  );
};

export default UserDashboard;