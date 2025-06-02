
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Package, Users, Clock, CheckCircle } from 'lucide-react';

const StoreDashboard = () => {
  const { slug } = useParams();
  const { user, logout } = useAuth();

  // Dados mockados para demonstração
  const stats = {
    pendingOrders: 8,
    totalClients: 45,
    completedOrders: 123,
    todayRevenue: 'R$ 1.245,80'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Painel da Loja</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Loja: {slug}</span>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <a href={`/store/${slug}/dashboard`} className="py-4 px-2 border-b-2 border-blue-500 text-blue-600">
              Dashboard
            </a>
            <a href={`/store/${slug}/orders`} className="py-4 px-2 text-gray-500 hover:text-gray-700">
              Pedidos
            </a>
            <a href={`/store/${slug}/products`} className="py-4 px-2 text-gray-500 hover:text-gray-700">
              Produtos
            </a>
            <a href={`/store/${slug}/clients`} className="py-4 px-2 text-gray-500 hover:text-gray-700">
              Clientes
            </a>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando preparo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita de Hoje</CardTitle>
              <Package className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayRevenue}</div>
              <p className="text-xs text-muted-foreground">
                +15% em relação a ontem
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Gerencie sua loja com facilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Ver Pedidos Pendentes
              </Button>
              <Button className="w-full" variant="outline">
                Adicionar Novo Produto
              </Button>
              <Button className="w-full" variant="outline">
                Visualizar Relatório de Vendas
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo de Hoje</CardTitle>
              <CardDescription>
                Atividades do dia atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Novos pedidos:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Pedidos entregues:</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Novos clientes:</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de conversão:</span>
                  <span className="font-semibold">75%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StoreDashboard;
