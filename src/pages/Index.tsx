import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Star, Clock, Shield, ArrowRight, Wrench, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    { icon: "🔧", name: "Plumbing", workers: "150+ workers" },
    { icon: "⚡", name: "Electrical", workers: "120+ workers" },
    { icon: "🧹", name: "Cleaning", workers: "200+ workers" },
    { icon: "🔨", name: "Carpentry", workers: "80+ workers" },
    { icon: "🎨", name: "Painting", workers: "95+ workers" },
    { icon: "❄️", name: "AC Repair", workers: "60+ workers" },
    { icon: "🌱", name: "Gardening", workers: "110+ workers" },
    { icon: "🦟", name: "Pest Control", workers: "45+ workers" },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Real-Time Location",
      description: "Find workers near you instantly with live GPS tracking"
    },
    {
      icon: Star,
      title: "Verified Professionals",
      description: "All workers are KYC verified with ratings from real customers"
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description: "Book services in seconds, get confirmed in minutes"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Safe payments and background-checked service providers"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold">ServiceNow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>Login</Button>
            <Button className="bg-secondary hover:bg-secondary/90" onClick={() => navigate('/auth')}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero -z-10" />
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Trusted by 10,000+ customers</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight">
                Find <span className="text-gradient">Trusted</span> Local Workers <span className="text-gradient">Instantly</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Connect with verified service professionals in your area. Book plumbers, electricians, cleaners, and more with real-time availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-lg h-14 px-8 shadow-glow"
                  onClick={() => navigate('/services')}
                >
                  Browse Services <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg h-14 px-8"
                  onClick={() => navigate('/auth')}
                >
                  Become a Worker
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-display font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Verified Workers</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-display font-bold">4.8★</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-display font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">Service Available</div>
                </div>
              </div>
            </div>
            <div className="relative lg:block hidden">
              <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="Professional service workers" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-display">Popular Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of verified service professionals
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-card transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                onClick={() => navigate('/services')}
              >
                <div className="text-center space-y-3">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{service.icon}</div>
                  <h3 className="font-display text-lg">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.workers}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-display">Why Choose ServiceNow?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The fastest way to connect with trusted local service professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-4 p-6">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-display">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-display">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get help in just three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Choose Service", desc: "Select the type of service you need" },
              { step: "2", title: "Find Workers", desc: "See available workers near you with ratings" },
              { step: "3", title: "Book Instantly", desc: "Confirm booking and get service completed" }
            ].map((item, index) => (
              <div key={index} className="relative text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-display text-white shadow-glow">
                  {item.step}
                </div>
                <h3 className="text-xl font-display">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="relative overflow-hidden p-12 md:p-16 text-center gradient-hero border-0 shadow-2xl">
            <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-display">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of satisfied customers who trust ServiceNow for their home service needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-lg h-14 px-8 shadow-glow"
                  onClick={() => navigate('/services')}
                >
                  Find a Worker <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg h-14 px-8 bg-background"
                  onClick={() => navigate('/auth')}
                >
                  Register as Worker
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-6 w-6 text-primary" />
                <span className="text-xl font-display font-bold">ServiceNow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting you with trusted local service professionals instantly.
              </p>
            </div>
            <div>
              <h4 className="font-display mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Plumbing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Electrical</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cleaning</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">All Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 ServiceNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;