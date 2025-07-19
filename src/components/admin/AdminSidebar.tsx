import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  Settings, 
  LogOut,
  Users,
  Utensils
} from 'lucide-react';
import { StyledLink as Link } from '../ui/Link';

interface AdminSidebarProps {
  activePage: string;
  className?: string;
}

const AdminSidebar = ({ activePage, className = '' }: AdminSidebarProps) => {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      href: '/admin/dashboard' 
    },
    { 
      id: 'products', 
      label: 'Productos', 
      icon: <Utensils size={20} />, 
      href: '/admin/products' 
    },
    { 
      id: 'orders', 
      label: 'Pedidos', 
      icon: <ShoppingBag size={20} />, 
      href: '/admin/orders' 
    },
    { 
      id: 'reservations', 
      label: 'Reservas', 
      icon: <Calendar size={20} />, 
      href: '/admin/reservations' 
    },
    { 
      id: 'customers', 
      label: 'Clientes', 
      icon: <Users size={20} />, 
      href: '/admin/customers' 
    },
    { 
      id: 'settings', 
      label: 'Ajustes', 
      icon: <Settings size={20} />, 
      href: '/admin/settings' 
    },
  ];

  return (
    <div className={`w-full md:w-64 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 bg-gray-900 text-white">
          <h2 className="text-lg font-bold">Panel de Administración</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    activePage === item.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`mr-3 ${activePage === item.id ? 'text-primary-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/logout"
                className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                <span className="font-medium">Cerrar Sesión</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;