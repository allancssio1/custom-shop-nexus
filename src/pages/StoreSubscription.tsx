
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Package, CreditCard, Settings } from 'lucide-react';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import SubscriptionUsage from '@/components/subscription/SubscriptionUsage';
import { 
  checkSubscription, 
  createSubscriptionCheckout, 
  openCustomerPortal,
  type SubscriptionStatus 
} from '@/services/subscriptionService';

const StoreSubscription = () => {
  const { slug } = useParams();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const plans = [
    {
      planType: 'basico',
      title: 'Plano Básico',
      price: 30,
      clientLimit: 99,
      features: [
        'Até 99 clientes cadastrados',
        'Gestão completa de pedidos',
        'Dashboard de vendas',
        'Suporte por email'
      ]
    },
    {
      planType: 'intermediario',
      title: 'Plano Intermediário',
      price: 55,
      clientLimit: 199,
      features: [
        'Até 199 clientes cadastrados',
        'Gestão completa de pedidos',
        'Dashboard de vendas',
        'Relatórios avançados',
        'Suporte prioritário'
      ]
    },
    {
      planType: 'avancado',
      title: 'Plano Avançado',
      price: 80,
      clientLimit: 999999,
      features: [
        'Clientes ilimitados',
        'Gestão completa de pedidos',
        'Dashboard de vendas',
        'Relatórios avançados',
        'API para integrações',
        'Suporte 24/7'
      ]
    }
  ];

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const status = await checkSubscription();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: "Erro ao carregar assinatura",
        description: "Não foi possível carregar os dados da assinatura.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planType: string) => {
    try {
      setCheckoutLoading(planType);
      const { url } = await createSubscriptionCheckout(planType);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro ao criar checkout",
        description: "Não foi possível iniciar o processo de assinatura.",
        variant: "destructive"
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { url } = await openCustomerPortal();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro ao abrir portal",
        description: "Não foi possível abrir o portal de gerenciamento.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados da assinatura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Assinaturas</h1>
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
            <a href={`/store/${slug}/dashboard`} className="py-4 px-2 text-gray-500 hover:text-gray-700">
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
            <a href={`/store/${slug}/subscription`} className="py-4 px-2 border-b-2 border-blue-500 text-blue-600">
              Assinatura
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Current Status */}
          {subscriptionStatus && (
            <div className="grid md:grid-cols-2 gap-6">
              <SubscriptionUsage 
                clientCount={subscriptionStatus.clientCount}
                clientLimit={subscriptionStatus.clientLimit}
                planType={subscriptionStatus.planType}
              />
              
              {subscriptionStatus.hasSubscription && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <CardTitle>Gerenciar Assinatura</CardTitle>
                    </div>
                    <CardDescription>
                      Altere seu plano, método de pagamento ou cancele sua assinatura
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleManageSubscription} className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Abrir Portal do Cliente
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Available Plans */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Planos Disponíveis</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <SubscriptionCard
                  key={plan.planType}
                  planType={plan.planType}
                  title={plan.title}
                  price={plan.price}
                  clientLimit={plan.clientLimit}
                  features={plan.features}
                  isCurrentPlan={subscriptionStatus?.planType === plan.planType}
                  isRecommended={
                    subscriptionStatus && 
                    subscriptionStatus.clientCount > 70 && 
                    plan.planType === 'intermediario' && 
                    subscriptionStatus.planType === 'basico'
                  }
                  onSelect={() => handleSubscribe(plan.planType)}
                  loading={checkoutLoading === plan.planType}
                />
              ))}
            </div>
          </div>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle>Precisa de Ajuda?</CardTitle>
              <CardDescription>
                Entre em contato conosco se tiver dúvidas sobre os planos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Email: suporte@exemplo.com | WhatsApp: (11) 99999-9999
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StoreSubscription;
