
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Store, CreditCard, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  // Dados mockados para demonstração
  const stats = {
    totalStores: 15,
    paidStores: 12,
    totalOrders: 234,
    totalRevenue: 'R$ 45.678,90'
  };

  const recentStores = [
    { id: 1, name: 'Pizzaria do João', cnpj: '12.345.678/0001-90', status: 'Ativa', createdAt: '2024-01-15' },
    { id: 2, name: 'Lanchonete da Maria', cnpj: '98.765.432/0001-10', status: 'Pendente', createdAt: '2024-01-14' },
    { id: 3, name: 'Restaurante Central', cnpj: '11.222.333/0001-44', status: 'Ativa', createdAt: '2024-01-13' },
    { id: 4, name: 'Açaí da Praia', cnpj: '55.666.777/0001-88', status: 'Ativa', createdAt: '2024-01-12' },
    { id: 5, name: 'Hamburgueria Top', cnpj: '99.888.777/0001-66', status: 'Pendente', createdAt: '2024-01-11' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {user?.name}</span>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStores}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lojas Pagas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paidStores}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.paidStores / stats.totalStores) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +18% desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                +25% desde o mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Stores Table */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Lojas Cadastradas</CardTitle>
            <CardDescription>
              As 10 lojas mais recentemente cadastradas na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Nome da Loja</th>
                    <th className="text-left py-2">CNPJ</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Data de Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStores.map((store) => (
                    <tr key={store.id} className="border-b">
                      <td className="py-2">{store.name}</td>
                      <td className="py-2">{store.cnpj}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          store.status === 'Ativa' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {store.status}
                        </span>
                      </td>
                      <td className="py-2">{new Date(store.createdAt).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
