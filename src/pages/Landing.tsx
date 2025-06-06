
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Smartphone, TrendingUp, Check } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transforme seu negócio com uma 
            <span className="text-blue-600"> loja online personalizada</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Crie sua loja virtual em minutos e comece a vender para seus clientes 
            de forma profissional e organizada. Sistema completo de pedidos, 
            gestão de clientes e muito mais.
          </p>
          <Link to="/store/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Criar Minha Loja Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Por que escolher nossa plataforma?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Loja Personalizada</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Customize sua loja com suas cores, logo e identidade visual única.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Gestão de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Mantenha um cadastro completo dos seus clientes e histórico de pedidos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Smartphone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Login por SMS</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seus clientes fazem login facilmente usando apenas o número do celular.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Relatórios Completos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Acompanhe suas vendas, pedidos e performance da sua loja em tempo real.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Plano Simples e Transparente
          </h2>
          <p className="text-xl text-gray-600">
            Um único plano que cresce com o seu negócio
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="relative border-2 border-blue-500 shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Plano Único
              </span>
            </div>
            
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-3xl font-bold">
                R$ 30<span className="text-base font-normal text-gray-600">/mês</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Para até 199 clientes cadastrados
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  <strong>Modelo flexível:</strong> Acima de 199 clientes, apenas R$ 0,10 por cliente extra/mês
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Loja online personalizada</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Gestão completa de pedidos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Cadastro ilimitado de produtos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Dashboard de vendas completo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Login por SMS para clientes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Suporte por email</span>
                </li>
              </ul>

              <div className="pt-4">
                <Link to="/store/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-lg p-6 shadow-md max-w-2xl">
            <h3 className="font-semibold text-gray-900 mb-3">Exemplos de Preços:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">50 clientes</div>
                <div className="text-gray-600">R$ 30,00/mês</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">250 clientes</div>
                <div className="text-gray-600">R$ 35,10/mês</div>
                <div className="text-xs text-gray-500">(R$ 30 + 51 × R$ 0,10)</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">500 clientes</div>
                <div className="text-gray-600">R$ 60,10/mês</div>
                <div className="text-xs text-gray-500">(R$ 30 + 301 × R$ 0,10)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para começar a vender online?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Cadastre sua loja agora e comece a receber pedidos em poucos minutos!
          </p>
          <Link to="/store/register">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Cadastrar Minha Loja
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Plataforma de Lojas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
