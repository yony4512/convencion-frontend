import { X, ShoppingCart, User, Phone } from 'lucide-react';
import { StyledLink as Link } from '../ui/Link';
import Logo from '../ui/Logo';

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const MobileMenu = ({ isOpen, closeMenu }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <Logo size="sm" />
          <button 
            onClick={closeMenu} 
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-5">
          <ul className="space-y-4">
            <li>
              <Link 
                href="/" 
                className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link 
                href="/menu" 
                className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
                onClick={closeMenu}
              >
                Menú
              </Link>
            </li>
            <li>
              <Link 
                href="/reservation" 
                className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
                onClick={closeMenu}
              >
                Reservas
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
                onClick={closeMenu}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
                onClick={closeMenu}
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="border-t border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/cart" 
              className="flex items-center py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
              onClick={closeMenu}
            >
              <ShoppingCart size={20} className="mr-2" />
              Carrito <span className="ml-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </Link>
            
            <Link 
              href="/login" 
              className="flex items-center py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
              onClick={closeMenu}
            >
              <User size={20} className="mr-2" />
              Cuenta
            </Link>
          </div>
          
          <a 
            href="tel:+51984123456" 
            className="flex items-center justify-center text-sm font-medium p-3 rounded-md bg-primary-600 text-white w-full"
          >
            <Phone size={16} className="mr-2" />
            Llamar: 984 123 456
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;