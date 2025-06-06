
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface Store {
  id: string;
  name: string;
  cnpj: string;
  slug: string;
  responsibleName: string;
  paymentEnabled: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [totalStores, setTotalStores] = useState(0);
  const [paidStores, setPaidStores] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch all stores from the API
      const response = await fetch('/api/stores');
      
      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }

      const storesData = await response.json();

      setStores(storesData || []);
      setTotalStores(storesData?.length || 0);
      setPaidStores(storesData?.filter((store: Store) => store.paymentEnabled).length || 0);

    } catch (error) {
      console.error('Dashboard error:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações das lojas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600">Bem-vindo, {user?.name}</p>
            </div>
            <Button onClick={logout} variant="outline">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total de Lojas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalStores}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Lojas com Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paidStores}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {totalStores > 0 ? Math.round((paidStores / totalStores) * 100) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Lojas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalStores - paidStores}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela das últimas lojas cadastradas */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Lojas Cadastradas</CardTitle>
            <CardDescription>
              As 10 lojas mais recentemente cadastradas na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Loja</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status Pagamento</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.slice(0, 10).map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.cnpj}</TableCell>
                    <TableCell>{store.responsibleName}</TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {store.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        store.paymentEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {store.paymentEnabled ? 'Pago' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(store.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {stores.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma loja cadastrada ainda.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
