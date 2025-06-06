
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, AlertTriangle } from 'lucide-react';

interface SubscriptionUsageProps {
  clientCount: number;
  clientLimit: number;
  planType: string;
}

const SubscriptionUsage = ({ clientCount, clientLimit, planType }: SubscriptionUsageProps) => {
  const usagePercentage = (clientCount / clientLimit) * 100;
  const isNearLimit = usagePercentage >= 80;
  const isOverLimit = clientCount >= clientLimit;

  const getPlanName = (type: string) => {
    switch (type) {
      case 'basico': return 'Básico';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      case 'trial': return 'Período de Teste';
      default: return 'Desconhecido';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Uso de Clientes</CardTitle>
          </div>
          <Badge variant={planType === 'trial' ? 'secondary' : 'default'}>
            {getPlanName(planType)}
          </Badge>
        </div>
        <CardDescription>
          {clientCount} de {clientLimit === 999999 ? 'ilimitados' : clientLimit} clientes cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress 
          value={Math.min(usagePercentage, 100)} 
          className={`w-full ${isOverLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : ''}`}
        />
        
        {isOverLimit && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">
              Limite de clientes excedido. Faça upgrade do seu plano para continuar cadastrando.
            </span>
          </div>
        )}
        
        {isNearLimit && !isOverLimit && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-700">
              Você está próximo do limite de clientes. Considere fazer upgrade do seu plano.
            </span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          {usagePercentage.toFixed(1)}% do limite utilizado
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionUsage;
