import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const Success = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpiar el carrito de forma segura usando la función del contexto
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">¡Pedido realizado con éxito!</h1>
      <p className="text-md md:text-lg text-gray-600 mb-6">Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/menu" className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors">
          Ver el menú
        </Link>
        <Link to="/user/orders" className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
          Mis pedidos
        </Link>
      </div>
    </div>
  );
};

export default Success;
