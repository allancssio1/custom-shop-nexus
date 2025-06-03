
import { supabase } from '@/integrations/supabase/client';
import { createSlugFromText } from '@/utils/slug';

export interface StoreRegistrationData {
  cnpj: string;
  nome: string;
  subtitulo: string;
  corPrincipal: string;
  endereco: string;
  nomeResponsavel: string;
  senha: string;
}

export const registerStore = async (formData: StoreRegistrationData) => {
  try {
    console.log('Starting store registration:', { ...formData, senha: '[HIDDEN]' });
    
    // Generate slug from store name
    const slug = createSlugFromText(formData.nome);
    
    // Check if CNPJ already exists
    const { data: existingAuth, error: checkError } = await supabase
      .from('auth_users')
      .select('id')
      .eq('login', formData.cnpj)
      .eq('user_type', 'store')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error('Erro ao verificar CNPJ existente');
    }
    
    if (existingAuth) {
      throw new Error('CNPJ já cadastrado no sistema');
    }
    
    // Check if slug already exists
    const { data: existingStore, error: slugError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (slugError && slugError.code !== 'PGRST116') {
      throw new Error('Erro ao verificar slug da loja');
    }
    
    if (existingStore) {
      throw new Error('Já existe uma loja com este nome. Tente um nome diferente.');
    }
    
    // Hash the password using the database function
    const { data: hashedPasswordData, error: hashError } = await supabase
      .rpc('hash_password', { password: formData.senha });
    
    if (hashError || !hashedPasswordData) {
      console.error('Password hash error:', hashError);
      throw new Error('Erro ao processar senha');
    }
    
    // Create auth user entry
    const { data: authUser, error: authError } = await supabase
      .from('auth_users')
      .insert({
        login: formData.cnpj,
        password_hash: hashedPasswordData,
        user_type: 'store'
      })
      .select()
      .single();
    
    if (authError) {
      console.error('Auth user creation error:', authError);
      throw new Error('Erro ao criar usuário de autenticação');
    }
    
    // Create store entry
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        auth_id: authUser.id,
        cnpj: formData.cnpj,
        name: formData.nome,
        subtitle: formData.subtitulo,
        primary_color: formData.corPrincipal,
        address: formData.endereco,
        responsible_name: formData.nomeResponsavel,
        slug: slug
      })
      .select()
      .single();
    
    if (storeError) {
      console.error('Store creation error:', storeError);
      // Clean up auth user if store creation fails
      await supabase
        .from('auth_users')
        .delete()
        .eq('id', authUser.id);
      
      throw new Error('Erro ao criar dados da loja');
    }
    
    console.log('Store registered successfully:', store);
    return { store, slug };
    
  } catch (error) {
    console.error('Store registration error:', error);
    throw error;
  }
};
