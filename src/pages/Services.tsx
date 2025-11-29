import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, ArrowLeft, Filter, Wrench, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  base_price: number;
}

interface Worker {
  id: string;
  user_id: string;
  hourly_rate: number;
  rating: number;
  total_jobs: number;
  status: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
  worker_services: {
    services: {
      name: string;
    };
  }[];
}

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchWorkers();
    }
  }, [selectedService]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading services",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      
      // First get worker_services for the selected service
      const { data: workerServiceData, error: wsError } = await supabase
        .from("worker_services")
        .select("worker_id")
        .eq("service_id", selectedService);
      
      if (wsError) throw wsError;
      
      const workerIds = workerServiceData?.map(ws => ws.worker_id) || [];
      
      if (workerIds.length === 0) {
        setWorkers([]);
        setLoading(false);
        return;
      }

      // Then get workers with their profiles
      const { data: workerData, error } = await supabase
        .from("workers")
        .select("*")
        .eq("verification_status", "verified")
        .in("id", workerIds)
        .order("rating", { ascending: false });

      if (error) throw error;
      
      // Get profiles separately
      const workersWithProfiles = await Promise.all(
        (workerData || []).map(async (worker) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", worker.user_id)
            .single();
          
          const { data: services } = await supabase
            .from("worker_services")
            .select("services(name)")
            .eq("worker_id", worker.id);
          
          return {
            ...worker,
            profiles: profile || { full_name: "Unknown", avatar_url: null },
            worker_services: services || []
          };
        })
      );
      
      setWorkers(workersWithProfiles as any);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading workers",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="text-xl font-display font-bold">ServiceNow</span>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for services..."
              className="pl-12 h-14 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {!selectedService ? (
          // Services Grid
          <div>
            <h2 className="text-3xl font-display mb-6">Choose a Service</h2>
            {loading ? (
              <div className="text-center py-12">Loading services...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="p-6 cursor-pointer hover:shadow-card transition-all hover:-translate-y-1"
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="text-center space-y-3">
                      <div className="text-5xl">{service.icon}</div>
                      <h3 className="font-display">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        From ${service.base_price}/hr
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Workers List
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display">Available Workers</h2>
              <Button variant="outline" onClick={() => setSelectedService(null)}>
                <Filter className="mr-2 h-4 w-4" /> Change Service
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">Finding workers near you...</div>
            ) : workers.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No workers available for this service right now.</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.map((worker) => (
                  <Card
                    key={worker.id}
                    className="p-6 cursor-pointer hover:shadow-card transition-all hover:-translate-y-1"
                    onClick={() => navigate(`/worker/${worker.id}`)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-display text-white">
                          {worker.profiles?.full_name?.charAt(0) || "W"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg">{worker.profiles?.full_name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>{worker.rating.toFixed(1)}</span>
                            <span>({worker.total_jobs} jobs)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Hourly Rate</span>
                          <span className="font-semibold">${worker.hourly_rate}/hr</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            worker.status === 'available' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {worker.status}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-secondary hover:bg-secondary/90">
                        View Profile & Book
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Services;