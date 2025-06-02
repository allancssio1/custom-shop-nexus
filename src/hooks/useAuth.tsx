
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  type: 'admin' | 'store' | 'client';
  storeSlug?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'admin' | 'store') => Promise<boolean>;
  clientLogin: (phone: string, code: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Simulação de login - aqui você integraria com Supabase
    console.log('Login attempt:', { email, password, type });
    
    // Dados mockados para demonstração
    if (type === 'admin' && email === 'allan.cassio1@gmail.com' && password === '123456') {
      const adminUser: User = {
        id: '1',
        email: 'allan.cassio1@gmail.com',
        name: 'Allan Cássio',
        type: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    return false;
  };

  const clientLogin = async (phone: string, code: string): Promise<boolean> => {
    // Simulação de login por SMS
    console.log('Client login attempt:', { phone, code });
    
    if (code === '123456') {
      const clientUser: User = {
        id: '2',
        phone,
        name: 'Cliente Teste',
        type: 'client'
      };
      setUser(clientUser);
      localStorage.setItem('user', JSON.stringify(clientUser));
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
      clientLogin,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
