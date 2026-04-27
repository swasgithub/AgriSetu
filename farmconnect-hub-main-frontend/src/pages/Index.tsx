import { Link } from "react-router-dom";
import { ShoppingCart, Tractor, Bot, ArrowRight, Sprout, Users, Package, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { stats } from "@/data/demoData";
import { API_URL } from "@/config/api";
const Index = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "Buy Products",
      description: "Quality seeds, fertilizers, pesticides, and farming tools at best prices",
      link: "/buy",
      color: "bg-leaf",
    },
    {
      icon: Tractor,
      title: "Rent Machinery",
      description: "Affordable rental of tractors, drones, harvesters, and more",
      link: "/rent",
      color: "bg-earth",
    },
    {
      icon: Bot,
      title: "AI Consultancy",
      description: "Smart AI agents for soil, weather, disease detection, and market insights",
      link: "/consult",
      color: "bg-wheat",
    },
  ];

  const statIcons = [Users, Package, Tractor, Cpu];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative gradient-hero text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Smart Farming.
              <br />
              Smart Decisions.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Empowering Indian farmers with AI-powered tools, quality products, and modern machinery for sustainable and profitable agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/consult">
                <Button size="lg" className="bg-wheat text-foreground hover:bg-wheat/90 gap-2 w-full sm:w-auto">
                  <Bot className="w-5 h-5" />
                  Try AI Consultancy
                </Button>
              </Link>
              <Link to="/buy">
                <Button size="lg" variant="outline" className="bg-wheat text-foreground hover:bg-primary-foreground/10 gap-2 w-full sm:w-auto">
                  Explore Products
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From seeds to smart insights, AgriSetu is your complete farming companion
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20 cursor-pointer group">
                  <CardContent className="p-6 md:p-8">
                    <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = statIcons[index];
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of farmers already using AgriSetu for smarter farming decisions.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-wheat text-foreground hover:bg-wheat/90">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
