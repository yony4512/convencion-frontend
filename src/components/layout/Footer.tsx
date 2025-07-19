import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Book } from 'lucide-react';
import Logo from '../ui/Logo';
import { StyledLink as Link } from '../ui/Link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Logo variant="white" size="lg" />
            <p className="mt-4 text-gray-300">
              La mejor pollería de Cusco, ofreciendo el auténtico sabor peruano desde 2010. Nuestro pollo a la brasa está preparado con ingredientes frescos y la receta tradicional.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="https://twitter.com" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-white transition-colors">Menú</Link>
              </li>
              <li>
                <Link href="/reservation" className="text-gray-300 hover:text-white transition-colors">Reservas</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">Nosotros</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contacto</Link>
              </li>
              <li>
                <Link href="/libro-de-reclamaciones" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Book size={16} className="text-red-500" />
                  <span>Libro de Reclamaciones</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0 text-primary-400" />
                <span className="text-gray-300">Av. El Sol 123, Cusco, Perú</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0 text-primary-400" />
                <span className="text-gray-300">+51 984 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0 text-primary-400" />
                <span className="text-gray-300">info@chickensystem.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horario de Atención</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">
                <span className="font-medium">Lunes - Jueves:</span>
                <br />11:00 - 22:00
              </li>
              <li className="text-gray-300">
                <span className="font-medium">Viernes - Sábado:</span>
                <br />11:00 - 23:00
              </li>
              <li className="text-gray-300">
                <span className="font-medium">Domingo:</span>
                <br />12:00 - 22:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p> {new Date().getFullYear()} ChickenSystem. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;