
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { registerStore, StoreRegistrationData } from '@/services/storeRegistrationService';

const StoreRegister = () => {
  const [formData, setFormData] = useState<StoreRegistrationData>({
    cnpj: '',
    nome: '',
    subtitulo: '',
    corPrincipal: '#3B82F6',
    endereco: '',
    nomeResponsavel: '',
    senha: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { store, slug } = await registerStore(formData);
      
      toast({
        title: "Loja cadastrada com sucesso!",
        description: `Sua loja foi criada com o endereço: /store/${slug}. Você já pode fazer login.`
      });
      
      // Redirect to store login page
      navigate(`/store/${slug}/login`);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Cadastro de Nova Loja</CardTitle>
          <CardDescription>
            Preencha os dados para criar sua loja personalizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  placeholder="00.000.000/0001-00"
                  value={formData.cnpj}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Loja</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Nome da sua loja"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitulo">Subtítulo</Label>
              <Input
                id="subtitulo"
                name="subtitulo"
                placeholder="Descrição breve da sua loja"
                value={formData.subtitulo}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="corPrincipal">Cor Principal da Loja</Label>
              <Input
                id="corPrincipal"
                name="corPrincipal"
                type="color"
                value={formData.corPrincipal}
                onChange={handleChange}
                disabled={isLoading}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                placeholder="Endereço completo da loja"
                value={formData.endereco}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomeResponsavel">Nome do Responsável</Label>
              <Input
                id="nomeResponsavel"
                name="nomeResponsavel"
                placeholder="Nome do responsável pela loja"
                value={formData.nomeResponsavel}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha de Acesso</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Senha para acessar o painel da loja"
                value={formData.senha}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar Loja'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreRegister;
