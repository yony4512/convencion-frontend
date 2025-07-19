import { API_BASE_URL } from '@/config/apiConfig';

// Helper para obtener el token de localStorage
const getToken = (): string | null => localStorage.getItem('token');

// Función genérica para hacer solicitudes HTTP
const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  body: any = null,
  requiresAuth: boolean = false
): Promise<any> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    credentials: 'include',
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data;
};

export default apiRequest;