
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    try {
      console.log('Login attempt:', { email, type });

      if (type === 'admin') {
        // Login do admin
        const { data: authData, error: authError } = await supabase
          .from('auth_users')
          .select('id, user_type')
          .eq('login', email)
          .eq('user_type', 'admin')
          .single();

        if (authError || !authData) {
          console.error('Auth error:', authError);
          return false;
        }

        // Verificação simples para desenvolvimento (fallback direto)
        if (email === 'allan.cassio1@gmail.com' && password === '123456') {
          const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

          if (adminError || !adminData) {
            console.error('Admin data error:', adminError);
            return false;
          }

          const adminUser: User = {
            id: adminData.id,
            email: adminData.email,
            name: adminData.name,
            type: 'admin'
          };

          setUser(adminUser);
          localStorage.setItem('user', JSON.stringify(adminUser));
          return true;
        }

        return false;
      } else if (type === 'store') {
        // Login da loja (usando CNPJ)
        const { data: authData, error: authError } = await supabase
          .from('auth_users')
          .select('id, user_type')
          .eq('login', email) // O CNPJ será usado como login
          .eq('user_type', 'store')
          .single();

        if (authError || !authData) {
          console.error('Store auth error:', authError);
          return false;
        }

        // Verificar senha (implementação simplificada para desenvolvimento)
        if (password === '123456') {
          const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('*')
            .eq('auth_id', authData.id)
            .single();

          if (storeError || !storeData) {
            console.error('Store data error:', storeError);
            return false;
          }

          const storeUser: User = {
            id: storeData.id,
            email: storeData.cnpj,
            name: storeData.name,
            type: 'store',
            storeSlug: storeData.slug
          };

          setUser(storeUser);
          localStorage.setItem('user', JSON.stringify(storeUser));
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
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
