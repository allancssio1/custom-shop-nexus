
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

export const loginAdmin = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data: authData, error: authError } = await supabase
      .from('auth_users')
      .select('id, user_type')
      .eq('login', email)
      .eq('user_type', 'admin')
      .single();

    if (authError || !authData) {
      console.error('Auth error:', authError);
      return null;
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
        return null;
      }

      return {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        type: 'admin'
      };
    }

    return null;
  } catch (error) {
    console.error('Login admin error:', error);
    return null;
  }
};

export const loginStore = async (cnpj: string, password: string): Promise<User | null> => {
  try {
    console.log('Store login attempt for CNPJ:', cnpj);
    
    // Get auth user with password hash
    const { data: authData, error: authError } = await supabase
      .from('auth_users')
      .select('id, user_type, password_hash')
      .eq('login', cnpj)
      .eq('user_type', 'store')
      .single();

    if (authError || !authData) {
      console.error('Store auth error:', authError);
      return null;
    }

    // Verify password using the database function
    const { data: passwordValid, error: passwordError } = await supabase
      .rpc('verify_password', { 
        password: password, 
        hash: authData.password_hash 
      });

    if (passwordError) {
      console.error('Password verification error:', passwordError);
      return null;
    }

    if (!passwordValid) {
      console.log('Invalid password for CNPJ:', cnpj);
      return null;
    }

    // Get store data
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('auth_id', authData.id)
      .single();

    if (storeError || !storeData) {
      console.error('Store data error:', storeError);
      return null;
    }

    console.log('Store login successful:', storeData.name);
    return {
      id: storeData.id,
      email: storeData.cnpj,
      name: storeData.name,
      type: 'store',
      storeSlug: storeData.slug
    };
  } catch (error) {
    console.error('Login store error:', error);
    return null;
  }
};

export const clientLogin = async (phone: string, code: string): Promise<User | null> => {
  console.log('Client login attempt:', { phone, code });
  
  if (code === '123456') {
    return {
      id: '2',
      phone,
      name: 'Cliente Teste',
      type: 'client'
    };
  }
  
  return null;
};
