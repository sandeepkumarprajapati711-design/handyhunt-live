import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Clock,
  Shield,
  ArrowRight,
  Wrench,
  Zap,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  // --- LOCATION STATE ---
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locError, setLocError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocError(null);
      },
      () => {
        setLocError("Location permission denied. Please allow location access.");
      }
    );
  };

  // --- DATA ---
  const services = [
    { icon: "🛠", name: "Plumbing", workers: "150+ workers" },
    { icon: "⚡", name: "Electrical", workers: "120+ workers" },
    { icon: "🧹", name: "Cleaning", workers: "200+ workers" },
    { icon: "🪚", name: "Carpentry", workers: "80+ workers" },
    { icon: "🎨", name: "Painting", workers: "95+ workers" },
    { icon: "❄️", name: "AC Repair", workers: "60+ workers" },
    { icon: "🪴", name: "Gardening", workers: "110+ workers" },
    { icon: "🐜", name: "Pest Control", workers: "45+ workers" },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Real-Time Location",
      description:
        "Find workers near you instantly using your current GPS location.",
    },
    {
      icon: Star,
      title: "Verified Professionals",
      description:
        "All workers are KYC verified with ratings from real customers.",
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description:
        "Book services in seconds and get confirmation within minutes.",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description:
        "Safe platform with background-checked service providers.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose Service",
      desc: "Select the type of service you need at your home.",
    },
    {
      step: "2",
      title: "Find Workers",
      desc: "See available workers near you with ratings and prices.",
    },
    {
      step: "3",
      title: "Book Instantly",
      desc: "Confirm booking and get the work done on your schedule.",
    },
  ];

  // Demo worker (for judges)
  const demoWorker = {
    name: "Rohit Verma",
    skill: "Electrician – Fan & Light Repair",
    price: 299,
    time: "30–45 minutes per job",
    experience: "3+ years experience",
    area: "Civil Lines, Prayagraj",
    idProof: "Aadhaar Verified (****4321)",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg text-slate-900">
              ServiceNow
            </span>
          </div>

          <nav className="hidden md:flex gap-6 text-sm text-slate-600">
            <button onClick={() => navigate("/services")}>Services</button>
            <button>How It Works</button>
            <button>Features</button>
          </nav>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
          {/* HERO (no image) */}
          <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl">
            <div className="flex-1 space-y-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide bg-white/10 px-3 py-1 rounded-full">
                <Sparkles className="h-3 w-3" /> Trusted by 10,000+ customers
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-snug">
                Find Trusted Local Workers Instantly
              </h1>
              <p className="text-sm md:text-base text-blue-100">
                Connect with verified electricians, plumbers, carpenters,
                cleaners and more. See real prices in ₹ and book in a few taps.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate("/services")}
                >
                  Browse Services
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/60 text-white hover:bg-white/10"
                  onClick={() => navigate("/auth")}
                >
                  Become a Worker
                </Button>
              </div>

              <div className="flex gap-6 text-xs md:text-sm text-blue-100 pt-2">
                <div>
                  <div className="font-semibold text-white">500+</div>
                  Verified Workers
                </div>
                <div>
                  <div className="font-semibold text-white">4.8★</div>
                  Average Rating
                </div>
                <div>
                  <div className="font-semibold text-white">24/7</div>
                  Service Available
                </div>
              </div>
            </div>

            {/* DEMO WORKER CARD */}
            <Card className="flex-1 bg-white/95 text-slate-900 p-4 md:p-5 shadow-lg">
              <p className="text-xs font-semibold text-blue-600 mb-1">
                Featured demo worker
              </p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{demoWorker.name}</h3>
                  <p className="text-sm text-slate-600">{demoWorker.skill}</p>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  ₹{demoWorker.price} / visit
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>⏱ {demoWorker.time}</div>
                <div>⭐ {demoWorker.experience}</div>
                <div>📍 {demoWorker.area}</div>
                <div>🪪 {demoWorker.idProof}</div>
              </div>
              <Button className="w-full mt-3" size="sm">
                Book {demoWorker.name}
              </Button>
            </Card>
          </section>

          {/* LOCATION SECTION */}
          <section className="p-4 md:p-5 rounded-2xl border border-dashed border-slate-300 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Use my current location
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                We detect your GPS location and can show workers nearest to you.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <Button size="sm" onClick={handleGetLocation}>
                Detect my location
              </Button>
              {coords && (
                <p className="text-[11px] text-slate-500 font-mono">
                  lat: {coords.lat.toFixed(4)}, lng: {coords.lng.toFixed(4)}
                </p>
              )}
              {locError && (
                <p className="text-[11px] text-red-500">{locError}</p>
              )}
            </div>
          </section>

          {/* POPULAR SERVICES */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Popular Services
                </h2>
                <p className="text-sm text-slate-500">
                  Choose from our wide range of verified service professionals.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/services")}
              >
                View all
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="p-3 md:p-4 cursor-pointer hover:shadow-md transition"
                  onClick={() => navigate("/services")}
                >
                  <div className="text-2xl mb-1">{service.icon}</div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {service.workers}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Why Choose ServiceNow?
              </h2>
              <p className="text-sm text-slate-500">
                The fastest way to connect with trusted local service
                professionals.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-4 bg-white">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {feature.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                How It Works
              </h2>
              <p className="text-sm text-slate-500">
                Get help in just three simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {howItWorks.map((item, index) => (
                <Card key={index} className="p-4 relative">
                  <div className="absolute -top-3 left-3 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                Ready to get started?
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Join thousands of customers who trust ServiceNow for everyday
                home repairs.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-blue-500" onClick={() => navigate("/services")}>
                Find a Worker
              </Button>
              <Button
                variant="outline"
                className="border-slate-500 text-white"
                onClick={() => navigate("/auth")}
              >
                Register as Worker
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-white mt-6">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-800">ServiceNow</p>
            <p>Connecting you with trusted local service professionals.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Policy</span>
          </div>
          <p className="text-[11px]">
            © 2024 ServiceNow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
