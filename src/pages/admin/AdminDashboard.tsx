import { useState } from 'react';
import { 
  ChevronRight, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar,
  TrendingUp,
  TrendingDown,

} from 'lucide-react';
import { StyledLink as Link } from '../../components/ui/Link';
import AdminSidebar from '../../components/admin/AdminSidebar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sample order data
const recentOrders = [
  {
    id: "ORD1235",
    customer: "María López",
    date: "15 de Junio, 2023",
    total: 79.90,
    status: "Pendiente",
  },
  {
    id: "ORD1234",
    customer: "Juan Pérez",
    date: "15 de Junio, 2023",
    total: 45.80,
    status: "Entregado",
  },
  {
    id: "ORD1233",
    customer: "Ana Gómez",
    date: "14 de Junio, 2023",
    total: 65.50,
    status: "Entregado",
  },
  {
    id: "ORD1232",
    customer: "Pedro Santos",
    date: "13 de Junio, 2023",
    total: 32.90,
    status: "Cancelado",
  },
];

// Sample reservation data
const recentReservations = [
  {
    id: "RSV456",
    customer: "Carlos Martínez",
    date: "18 de Junio, 2023",
    time: "19:00",
    people: 4,
    status: "Confirmada",
  },
  {
    id: "RSV455",
    customer: "Lucía Mendoza",
    date: "18 de Junio, 2023",
    time: "20:30",
    people: 2,
    status: "Confirmada",
  },
  {
    id: "RSV454",
    customer: "Jorge Ríos",
    date: "17 de Junio, 2023",
    time: "13:00",
    people: 6,
    status: "Completada",
  },
];

// Sample popular products
const popularProducts = [
  {
    id: 1,
    name: "Pollo Entero",
    sales: 42,
    revenue: 2767.80,
    growth: 12,
  },
  {
    id: 4,
    name: "Combo Familiar",
    sales: 38,
    revenue: 3036.20,
    growth: 8,
  },
  {
    id: 7,
    name: "Papas Fritas",
    sales: 65,
    revenue: 1033.50,
    growth: -3,
  },
];

const AdminDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Line chart data for sales
  const salesData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Ventas diarias (S/.)',
        data: [650, 590, 800, 810, 960, 1100, 1050],
        borderColor: '#E11D48',
        backgroundColor: 'rgba(225, 29, 72, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  // Bar chart data for orders by category
  const ordersByCategoryData = {
    labels: ['Pollos', 'Combos', 'Acompañamientos', 'Bebidas'],
    datasets: [
      {
        label: 'Cantidad de pedidos',
        data: [65, 42, 37, 50],
        backgroundColor: [
          'rgba(225, 29, 72, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar for larger screens */}
          <AdminSidebar activePage="dashboard" className="hidden md:block" />

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
                <AdminSidebar activePage="dashboard" className="block" />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-gray-600">Bienvenido al panel de control de ChickenSystem</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm">Ventas Totales</h3>
                  <div className="bg-primary-100 p-2 rounded-full">
                    <DollarSign className="text-primary-600" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold">S/. 12,589</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">8.2%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm">Pedidos</h3>
                  <div className="bg-secondary-100 p-2 rounded-full">
                    <ShoppingBag className="text-secondary-600" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold">168</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">12.5%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm">Clientes</h3>
                  <div className="bg-accent-100 p-2 rounded-full">
                    <Users className="text-accent-600" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold">94</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">5.3%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm">Reservas</h3>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold">42</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="text-red-500 mr-1" size={16} />
                  <span className="text-red-500 font-medium">3.1%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Ventas de la Semana</h2>
                <div className="h-80">
                  <Line 
                    data={salesData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)',
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Pedidos por Categoría</h2>
                <div className="h-80">
                  <Bar 
                    data={ordersByCategoryData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)',
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Popular Products */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Productos Populares</h2>
                <Link href="/admin/products" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                  Ver todos los productos
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ventas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingresos
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crecimiento
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ver</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {popularProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.sales} unidades</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">S/. {product.revenue.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center text-sm ${
                            product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.growth >= 0 ? (
                              <TrendingUp size={16} className="mr-1" />
                            ) : (
                              <TrendingDown size={16} className="mr-1" />
                            )}
                            {Math.abs(product.growth)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/admin/products/${product.id}`} className="text-primary-600 hover:text-primary-700">
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Pedidos Recientes</h2>
                <Link href="/admin/orders" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                  Ver todos
                </Link>
              </div>

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
                        <span className="sr-only">Ver</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{order.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">S/. {order.total.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Entregado' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'Pendiente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/admin/orders/${order.id}`} className="text-primary-600 hover:text-primary-700">
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Reservations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Reservas Recientes</h2>
                <Link href="/admin/reservations" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                  Ver todas
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reserva
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Personas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ver</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentReservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reservation.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{reservation.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{reservation.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{reservation.people}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reservation.status === 'Confirmada' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/admin/reservations/${reservation.id}`} className="text-primary-600 hover:text-primary-700">
                            Ver
                          </Link>
                        </td>
                      </tr>
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

export default AdminDashboard;