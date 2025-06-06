
import { User } from '@/types/auth';

export const loginAdmin = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Admin login error:', error);
    return null;
  }
};

export const loginStore = async (cnpj: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/store/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cnpj, password }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Store login error:', error);
    return null;
  }
};

export const clientLogin = async (phone: string, code: string): Promise<User | null> => {
  try {
    const response = await fetch('/api/clients/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Client login error:', error);
    return null;
  }
};
