
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Smartphone, TrendingUp } from 'lucide-react';

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
