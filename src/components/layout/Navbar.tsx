import { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, Phone } from 'lucide-react';

import Logo from '../ui/Logo';
import { StyledLink as Link } from '../ui/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import LoginModal from '../auth/LoginModal';
import ConfirmationModal from '../ui/ConfirmationModal';

interface NavbarProps {
  toggleMobileMenu: () => void;
}

const Navbar = ({ toggleMobileMenu }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { user, logout, isLoading } = useAuth();
  const { cartQuantity } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4';

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${navClasses}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <Logo />

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="font-medium">Inicio</Link>
              <Link href="/menu" className="font-medium">Menú</Link>
              <Link href="/reservation" className="font-medium">Reservas</Link>
              <Link href="/about" className="font-medium">Nosotros</Link>
              <Link href="/contact" className="font-medium">Contacto</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <a href="tel:+51984123456" className="flex items-center text-sm font-medium px-3 py-1 rounded-full bg-primary-50 text-primary-600">
                <Phone size={16} className="mr-1" />
                <span>984 123 456</span>
              </a>
              
              <Link href="/checkout" className="p-2 rounded-full hover:bg-gray-100 relative">
                <ShoppingCart size={20} />
                {cartQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartQuantity}
                  </span>
                )}
              </Link>

              <div className="relative">
                {isLoading ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <User size={20} />
                    </button>
                    {isUserMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                      >
                        <RouterLink to="/user/dashboard" className="block px-4 py-3 hover:bg-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        </RouterLink>
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={() => setIsLogoutModalOpen(true)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <RouterLink
                    to="/login"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <User size={20} />
                  </RouterLink>
                )}
              </div>
            </div>

            <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={toggleMobileMenu} aria-label="Toggle menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />}
      {isLogoutModalOpen && (
        <ConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={logout}
          title="Confirmar Cierre de Sesión"
          message="¿Estás seguro de que quieres cerrar tu sesión?"
        />
      )}
    </>
  );
};

export default Navbar;