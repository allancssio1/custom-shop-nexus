
export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  type: 'admin' | 'store' | 'client';
  storeSlug?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'admin' | 'store') => Promise<boolean>;
  clientLogin: (phone: string, code: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
