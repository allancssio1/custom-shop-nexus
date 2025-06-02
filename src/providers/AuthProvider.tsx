
import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { User } from '@/types/auth';
import { loginAdmin, loginStore, clientLogin } from '@/services/authService';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há usuário armazenado no localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, type: 'admin' | 'store'): Promise<boolean> => {
    console.log('Login attempt:', { email, type });

    try {
      let loggedUser: User | null = null;

      if (type === 'admin') {
        loggedUser = await loginAdmin(email, password);
      } else if (type === 'store') {
        loggedUser = await loginStore(email, password);
      }

      if (loggedUser) {
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleClientLogin = async (phone: string, code: string): Promise<boolean> => {
    const loggedUser = await clientLogin(phone, code);
    
    if (loggedUser) {
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      clientLogin: handleClientLogin,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}
