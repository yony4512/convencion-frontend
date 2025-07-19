import { useState } from 'react';
import { 
  ChevronRight, 
  Eye, 
  Check, 
  X,
  Clock,
  Truck,
  Ban
} from 'lucide-react';
import { Link } from '../../components/ui/Link';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'sonner';

// Sample orders data
const ordersData = [
  {
    id: "ORD1235",
    customer: {
      name: "María López",
      email: "maria@example.com",
      phone: "+51 984 567 890",
      address: "Av. Sol 456, Cusco"
    },
    date: "15 de Junio, 2023",
    total: 79.90,
    status: "Pendiente",
    items: [
      { name: "Pollo Entero", quantity: 1, price: 65.90 },
      { name: "Gaseosa 1.5L", quantity: 1, price: 14.00 }
    ]
  },
  {
    id: "ORD1234",
    customer: {
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "+51 984 123 456",
      address: "Calle Plateros 123, Cusco"
    },
    date: "15 de Junio, 2023",
    total: 45.80,
    status: "Entregado",
    items: [
      { name: "1/2 Pollo", quantity: 1, price: 39.90 },
      { name: "Papas Fritas", quantity: 1, price: 5.90 }
    ]
  },
  {
    id: "ORD1233",
    customer: {
      name: "Ana Gómez",
      email: "ana@example.com",
      phone: "+51 984 789 012",
      address: "Urb. Magisterio 789, Cusco"
    },
    date: "14 de Junio, 2023",
    total: 65.50,
    status: "Entregado",
    items: [
      { name: "1/2 Pollo", quantity: 1, price: 39.90 },
      { name: "Ensalada Mixta", quantity: 1, price: 12.90 },
      { name: "Gaseosa Personal", quantity: 2, price: 6.35 }
    ]
  },
  {
    id: "ORD1232",
    customer: {
      name: "Pedro Santos",
      email: "pedro@example.com",
      phone: "+51 984 345 678",
      address: "Av. La Cultura 321, Cusco"
    },
    date: "13 de Junio, 2023",
    total: 32.90,
    status: "Cancelado",
    items: [
      { name: "1/4 Pollo", quantity: 1, price: 22.90 },
      { name: "Papas Fritas", quantity: 1, price: 5.90 },
      { name: "Gaseosa Personal", quantity: 1, price: 4.10 }
    ]
  }
];

const AdminOrders = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState(ordersData);

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
    toast.success(`Pedido ${orderId} actualizado a ${newStatus}`);
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return <Clock className="text-yellow-500\" size={20} />;
      case 'Entregado':
        return <Check className="text-green-500" size={20} />;
      case 'En camino':
        return <Truck className="text-blue-500" size={20} />;
      case 'Cancelado':
        return <Ban className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  // Get status class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'En camino':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar for larger screens */}
          <AdminSidebar activePage="orders" className="hidden md:block" />

          {/* Mobile menu button */}
          <div className="md:hidden w-full">
            <button
              type="button"
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="font-medium">Menú de Administrador</span>
              <ChevronRight className={`transform transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
            </button>
            
            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-lg shadow-sm overflow-hidden">
                <AdminSidebar activePage="orders" className="block" />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-bold mb-2">Gestión de Pedidos</h1>
              <p className="text-gray-600">Administra y actualiza el estado de los pedidos</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pedido
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
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
                    {orders.map((order) => (
                      <>
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                            <div className="text-sm text-gray-500">{order.customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{order.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">S/. {order.total.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                              <span className="flex items-center">
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{order.status}</span>
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                              className="text-primary-600 hover:text-primary-900 flex items-center justify-end"
                            >
                              <Eye size={16} className="mr-1" />
                              Detalles
                            </button>
                          </td>
                        </tr>
                        {selectedOrder === order.id && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              <div className="text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Información del Cliente</h4>
                                    <dl className="space-y-1">
                                      <div>
                                        <dt className="text-gray-500">Nombre:</dt>
                                        <dd>{order.customer.name}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-gray-500">Email:</dt>
                                        <dd>{order.customer.email}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-gray-500">Teléfono:</dt>
                                        <dd>{order.customer.phone}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-gray-500">Dirección:</dt>
                                        <dd>{order.customer.address}</dd>
                                      </div>
                                    </dl>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Estado del Pedido</h4>
                                    <div className="space-x-2">
                                      <button
                                        onClick={() => updateOrderStatus(order.id, 'Pendiente')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          order.status === 'Pendiente'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                                        }`}
                                      >
                                        Pendiente
                                      </button>
                                      <button
                                        onClick={() => updateOrderStatus(order.id, 'En camino')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          order.status === 'En camino'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                                        }`}
                                      >
                                        En camino
                                      </button>
                                      <button
                                        onClick={() => updateOrderStatus(order.id, 'Entregado')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          order.status === 'Entregado'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                                        }`}
                                      >
                                        Entregado
                                      </button>
                                      <button
                                        onClick={() => updateOrderStatus(order.id, 'Cancelado')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          order.status === 'Cancelado'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                                        }`}
                                      >
                                        Cancelado
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <h4 className="font-medium mb-2">Detalles del Pedido</h4>
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead>
                                    <tr>
                                      <th className="text-left font-medium text-gray-500">Producto</th>
                                      <th className="text-left font-medium text-gray-500">Cantidad</th>
                                      <th className="text-left font-medium text-gray-500">Precio</th>
                                      <th className="text-left font-medium text-gray-500">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, index) => (
                                      <tr key={index}>
                                        <td className="py-2">{item.name}</td>
                                        <td className="py-2">{item.quantity}</td>
                                        <td className="py-2">S/. {item.price.toFixed(2)}</td>
                                        <td className="py-2">S/. {(item.quantity * item.price).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                    <tr className="border-t">
                                      <td colSpan={3} className="py-2 text-right font-medium">Total:</td>
                                      <td className="py-2 font-medium">S/. {order.total.toFixed(2)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;