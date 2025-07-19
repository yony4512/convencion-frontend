import { X } from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  if (!isOpen) return null;

  const handleLogin = () => {
    // Guardamos la página actual para poder volver después del login
    localStorage.setItem('loginRedirect', window.location.pathname);
    // Redirigimos al endpoint de autenticación de Google
        window.location.href = `${API_BASE_URL}/auth/google?origin=public`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full relative text-center shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Inicia Sesión para Continuar</h2>
        <p className="text-gray-600 mb-6">
          Para agregar productos a tu carrito, necesitas tener una sesión activa.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {/* Aquí podrías agregar un ícono de Google si lo deseas */}
          <span>Iniciar Sesión con Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
