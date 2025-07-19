import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const GoogleAuthCallback: React.FC = () => {

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Este efecto se encarga de procesar el token una sola vez.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      login(token);
    } else if (error) {
      toast.error(error || 'No se pudo completar el inicio de sesión con Google.');
      navigate('/login');
    } else {
      toast.error('Respuesta de autenticación inválida.');
      navigate('/login');
    }
    // Usamos location.search para que solo se ejecute si la URL (y el token) cambian.
  }, [login, navigate, location.search]);

  // Este efecto espera a que el usuario esté autenticado para redirigir.
  useEffect(() => {
    if (user) {
      toast.success('¡Bienvenido! Sesión iniciada correctamente.');
      navigate('/'); // Redirigir a la página principal o al dashboard
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Procesando autenticación...</p>
      {/* Podrías agregar un spinner aquí */}
    </div>
  );
};

export default GoogleAuthCallback;
