
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface SubscriptionCardProps {
  title: string;
  basePrice: number;
  clientCount: number;
  totalPrice: number;
  extraClientsCharge: number;
  isCurrentPlan?: boolean;
  onSelect: () => void;
  loading?: boolean;
}

const SubscriptionCard = ({
  title,
  basePrice,
  clientCount,
  totalPrice,
  extraClientsCharge,
  isCurrentPlan = false,
  onSelect,
  loading = false
}: SubscriptionCardProps) => {
  return (
    <Card className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
      {isCurrentPlan && (
        <Badge className="absolute -top-2 right-4 bg-blue-500">
          Plano Atual
        </Badge>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          <div className="space-y-1">
            <div>
              <span className="text-3xl font-bold">R$ {totalPrice.toFixed(2)}</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <div className="text-sm">
              Base: R$ {basePrice.toFixed(2)} (até 199 clientes)
              {extraClientsCharge > 0 && (
                <div>+ R$ {extraClientsCharge.toFixed(2)} ({clientCount - 199} clientes extras)</div>
              )}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Até 199 clientes: R$ 30/mês</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Clientes extras: R$ 0,10 cada/mês</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Gestão completa de pedidos</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Dashboard de vendas</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Suporte por email</span>
          </li>
        </ul>
        
        <Button 
          onClick={onSelect}
          disabled={isCurrentPlan || loading}
          className="w-full"
          variant={isCurrentPlan ? "secondary" : "default"}
        >
          {loading ? 'Carregando...' : isCurrentPlan ? 'Plano Atual' : 'Assinar'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
