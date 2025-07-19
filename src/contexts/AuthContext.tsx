import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

// --- Tipos e Interfaces ---
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DecodedToken extends User {
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (jwtToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Proveedor de Autenticación ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt_token');
        localStorage.removeItem('cart'); // Limpiar también el carrito
    window.location.href = '/'; // Forzar recarga a la página de inicio
  }, []);

  const login = useCallback((jwtToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(jwtToken);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }
      setUser(decoded as User);
      setToken(jwtToken);
      localStorage.setItem('jwt_token', jwtToken);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
          const decoded = jwtDecode<DecodedToken>(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            setUser(decoded as User);
            setToken(storedToken);
          } else {
            // Token expirado
            logout();
          }
        }
      } catch (error) {
        console.error("Could not verify token on initial load", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Hook Personalizado ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
