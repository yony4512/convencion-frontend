import { useState, useEffect } from 'react';
import { ChevronRight, Eye } from 'lucide-react';
import UserSidebar from '../../components/user/UserSidebar';
import UserOrderDetailModal from '../../components/user/UserOrderDetailModal';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import apiClient from '../../config/apiClient';

// Define the type for an order, consistent with the backend
interface Order {
  id: number;
  total_amount: number;
  status: string;
  createdAt: string;
  items_count: number;
}

interface OrderDetail extends Order {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  items: any[] | string;
}

const UserOrders = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // The browser automatically sends the session cookie for authentication
                        const response = await apiClient.get<Order[]>('/orders/my-orders');
        const data = response.data;
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      // If there's no user, we shouldn't be on this page, but as a fallback:
      setLoading(false);
    }
  }, [user]);

  // Refrescar la lista cada 30 s para mostrar cambios de estado realizados por el administrador
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        apiClient.get<Order[]>('/orders/my-orders')
          .then(response => {
            if (response.data) setOrders(response.data);
          })
          .catch(() => {});
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleViewOrder = async (orderId: number) => {
    setModalLoading(true);
    setModalOpen(true);
    try {
                  const response = await apiClient.get<OrderDetail>(`/orders/${orderId}`);
      const data = response.data;
      setSelectedOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <UserSidebar activePage="orders" className="hidden md:block" />

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
                <UserSidebar activePage="orders" className="block" />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-bold mb-2">Mis Pedidos</h1>
              <p className="text-gray-600">Historial de todos tus pedidos realizados</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <p className="p-6 text-center text-gray-500">Cargando tus pedidos...</p>
                ) : error ? (
                  <p className="p-6 text-center text-red-500">{error}</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pedido
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">ORD{String(order.id).padStart(4, '0')}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{format(new Date(order.createdAt), 'dd \'de\' MMMM, yyyy', { locale: es })}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">S/ {Number(order.total_amount).toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleViewOrder(order.id)} className="text-primary-600 hover:text-primary-700 flex items-center justify-end">
                                <Eye className="w-4 h-4 mr-1" />
                                Detalles
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-gray-500">
                            No has realizado ningún pedido todavía.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

            <UserOrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default UserOrders;