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
    const response = await fetch('/api/stores/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao registrar loja');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Store registration error:', error);
    throw error;
  }
};