
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface SubscriptionCardProps {
  planType: string;
  title: string;
  price: number;
  clientLimit: number;
  features: string[];
  isCurrentPlan?: boolean;
  isRecommended?: boolean;
  onSelect: () => void;
  loading?: boolean;
}

const SubscriptionCard = ({
  planType,
  title,
  price,
  clientLimit,
  features,
  isCurrentPlan = false,
  isRecommended = false,
  onSelect,
  loading = false
}: SubscriptionCardProps) => {
  return (
    <Card className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''} ${isRecommended ? 'ring-2 ring-green-500' : ''}`}>
      {isRecommended && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">
          Recomendado
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-2 right-4 bg-blue-500">
          Plano Atual
        </Badge>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold">R$ {price}</span>
          <span className="text-muted-foreground">/mês</span>
        </CardDescription>
        <p className="text-sm text-muted-foreground">
          Até {clientLimit === 999999 ? 'ilimitados' : clientLimit} clientes
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
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
