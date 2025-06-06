
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Package, Users, Clock, CheckCircle, CreditCard, AlertTriangle } from 'lucide-react';
import { checkSubscription, type SubscriptionStatus } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

const StoreDashboard = () => {
  const { slug } = useParams();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  // Dados mockados para demonstração
  const stats = {
    pendingOrders: 8,
    totalClients: 45,
    completedOrders: 123,
    todayRevenue: 'R$ 1.245,80'
  };

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const status = await checkSubscription();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
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
            <a href={`/store/${slug}/subscription`} className="py-4 px-2 text-gray-500 hover:text-gray-700">
              Assinatura
            </a>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Subscription Alert */}
        {subscriptionStatus && !subscriptionStatus.canAddClients && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-800">Limite de clientes atingido</p>
                    <p className="text-sm text-red-600">
                      Você atingiu o limite de {subscriptionStatus.clientLimit} clientes. 
                      <a href={`/store/${slug}/subscription`} className="underline ml-1">
                        Faça upgrade do seu plano
                      </a> para continuar cadastrando.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
              <CardTitle className="text-sm font-medium">Clientes Cadastrados</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscriptionStatus ? subscriptionStatus.clientCount : stats.totalClients}
              </div>
              <p className="text-xs text-muted-foreground">
                {subscriptionStatus && (
                  <>
                    Limite: {subscriptionStatus.clientLimit === 999999 ? 'Ilimitado' : subscriptionStatus.clientLimit}
                  </>
                )}
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

        {/* Quick Actions and Subscription Info */}
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
              <Button 
                className="w-full" 
                variant="outline"
                disabled={subscriptionStatus && !subscriptionStatus.canAddClients}
              >
                Adicionar Novo Cliente
                {subscriptionStatus && !subscriptionStatus.canAddClients && (
                  <span className="ml-2 text-xs">(Limite atingido)</span>
                )}
              </Button>
              <Button className="w-full" variant="outline">
                Visualizar Relatório de Vendas
              </Button>
            </CardContent>
          </Card>

          {subscriptionStatus && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Sua Assinatura</CardTitle>
                </div>
                <CardDescription>
                  Informações do seu plano atual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plano:</span>
                    <span className="font-semibold capitalize">
                      {subscriptionStatus.planType === 'trial' ? 'Período de Teste' : subscriptionStatus.planType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clientes:</span>
                    <span className="font-semibold">
                      {subscriptionStatus.clientCount}/{subscriptionStatus.clientLimit === 999999 ? '∞' : subscriptionStatus.clientLimit}
                    </span>
                  </div>
                  {subscriptionStatus.monthlyPrice && (
                    <div className="flex justify-between">
                      <span>Mensalidade:</span>
                      <span className="font-semibold">R$ {subscriptionStatus.monthlyPrice}</span>
                    </div>
                  )}
                </div>
                <Button asChild className="w-full">
                  <a href={`/store/${slug}/subscription`}>
                    Gerenciar Assinatura
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default StoreDashboard;
