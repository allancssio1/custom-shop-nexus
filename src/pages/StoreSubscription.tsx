
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Settings } from 'lucide-react';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import SubscriptionUsage from '@/components/subscription/SubscriptionUsage';
import { 
  checkSubscription, 
  createSubscriptionCheckout, 
  openCustomerPortal,
  calculateSubscriptionPrice,
  type SubscriptionStatus 
} from '@/services/subscriptionService';

const StoreSubscription = () => {
  const { slug } = useParams();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  const handleSubscribe = async () => {
    try {
      setCheckoutLoading(true);
      const { url } = await createSubscriptionCheckout();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro ao criar checkout",
        description: "Não foi possível iniciar o processo de assinatura.",
        variant: "destructive"
      });
    } finally {
      setCheckoutLoading(false);
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

  const pricing = subscriptionStatus ? calculateSubscriptionPrice(subscriptionStatus.clientCount) : null;

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
          {subscriptionStatus && pricing && (
            <div className="grid md:grid-cols-2 gap-6">
              <SubscriptionUsage 
                clientCount={subscriptionStatus.clientCount}
                basePrice={pricing.basePrice}
                extraClientsCharge={pricing.extraClientsCharge}
                totalMonthlyPrice={pricing.totalMonthlyPrice}
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
                      Altere seu método de pagamento ou cancele sua assinatura
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

          {/* Subscription Plan */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Plano de Assinatura</h2>
            <div className="max-w-md mx-auto">
              {subscriptionStatus && pricing && (
                <SubscriptionCard
                  title="Plano Único"
                  basePrice={pricing.basePrice}
                  clientCount={subscriptionStatus.clientCount}
                  totalPrice={pricing.totalMonthlyPrice}
                  extraClientsCharge={pricing.extraClientsCharge}
                  isCurrentPlan={subscriptionStatus.hasSubscription}
                  onSelect={handleSubscribe}
                  loading={checkoutLoading}
                />
              )}
            </div>
          </div>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
              <CardDescription>
                Modelo de cobrança transparente e flexível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• <strong>Valor base:</strong> R$ 30,00/mês para até 199 clientes cadastrados</p>
                <p>• <strong>Clientes extras:</strong> R$ 0,10/mês para cada cliente acima de 200</p>
                <p>• <strong>Sem surpresas:</strong> Você paga apenas pelos clientes que cadastra</p>
                <p>• <strong>Cancelamento:</strong> Pode cancelar a qualquer momento</p>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm">
                  <strong>Exemplo:</strong> 250 clientes = R$ 30,00 (base) + R$ 5,00 (50 extras × R$ 0,10) = R$ 35,00/mês
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StoreSubscription;
