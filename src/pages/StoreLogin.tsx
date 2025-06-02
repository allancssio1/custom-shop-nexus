
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const StoreLogin = () => {
  const [cnpj, setCnpj] = useState('');
  const [password, setPassword] = useState('');
  const { slug } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular login da loja
    console.log('Store login attempt:', { cnpj, password, slug });
    
    // Para demonstração, aceitar qualquer CNPJ com senha "123456"
    if (password === '123456') {
      // Simular usuário da loja
      const storeUser = {
        id: '3',
        email: cnpj,
        name: 'Loja Teste',
        type: 'store' as const,
        storeSlug: slug
      };
      
      // Simular login bem-sucedido
      localStorage.setItem('user', JSON.stringify(storeUser));
      navigate(`/store/${slug}/dashboard`);
    } else {
      toast({
        title: "Erro no login",
        description: "CNPJ ou senha incorretos",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Acesso à Loja</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o painel da loja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreLogin;
