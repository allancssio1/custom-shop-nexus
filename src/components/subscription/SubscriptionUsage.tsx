
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertTriangle } from 'lucide-react';

interface SubscriptionUsageProps {
  clientCount: number;
  basePrice: number;
  extraClientsCharge: number;
  totalMonthlyPrice: number;
  planType: string;
}

const SubscriptionUsage = ({ 
  clientCount, 
  basePrice, 
  extraClientsCharge, 
  totalMonthlyPrice, 
  planType 
}: SubscriptionUsageProps) => {
  const baseLimit = 199;
  const extraClients = Math.max(0, clientCount - baseLimit);
  const isTrialPlan = planType === 'trial';

  const getPlanName = (type: string) => {
    if (type === 'trial') return 'Período de Teste';
    return 'Plano Único';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Uso da Assinatura</CardTitle>
          </div>
          <Badge variant={isTrialPlan ? 'secondary' : 'default'}>
            {getPlanName(planType)}
          </Badge>
        </div>
        <CardDescription>
          {clientCount} clientes cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isTrialPlan && (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm">Valor base (até 199 clientes):</span>
              <span className="font-semibold">R$ {basePrice.toFixed(2)}</span>
            </div>
            
            {extraClients > 0 && (
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                <span className="text-sm">{extraClients} clientes extras (R$ 0,10 cada):</span>
                <span className="font-semibold">R$ {extraClientsCharge.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-md border-2 border-green-200">
              <span className="text-sm font-medium">Total mensal:</span>
              <span className="text-lg font-bold text-green-700">R$ {totalMonthlyPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        {isTrialPlan && clientCount >= 5 && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">
              Limite do período de teste atingido. Assine o plano para continuar cadastrando clientes.
            </span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          {isTrialPlan 
            ? `${clientCount}/5 clientes no período de teste`
            : `${extraClients} clientes acima do limite base de 199`
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionUsage;
