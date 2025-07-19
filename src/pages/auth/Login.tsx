import React from 'react';
import { API_BASE_URL } from '../../config/apiConfig';

const Login: React.FC = () => {

  const handleGoogleLogin = () => {
    // Redirigir al usuario al endpoint de autenticación de Google en el backend.
    // Se utiliza la URL base del archivo de configuración para mayor mantenibilidad.
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Accede a tu cuenta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Usa tu cuenta de Google para continuar
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md"
          >
            <img src="/google-logo.svg" alt="Google logo" className="h-5 w-5 mr-2" />
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;