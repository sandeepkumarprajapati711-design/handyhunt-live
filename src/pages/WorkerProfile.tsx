import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Star, MapPin, Clock, Shield, Calendar,
  Phone, Mail, Briefcase, Award, MessageSquare, Wrench
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkerData {
  id: string;
  user_id: string;
  hourly_rate: number;
  experience_years: number;
  bio: string | null;
  rating: number;
  total_jobs: number;
  address: string | null;
  profiles: {
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
  };
  worker_services: {
    services: {
      id: string;
      name: string;
      icon: string | null;
    };
  }[];
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

const WorkerProfile = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [worker, setWorker] = useState<WorkerData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  useEffect(() => {
    fetchWorkerData();
    fetchReviews();
  }, [workerId]);

  const fetchWorkerData = async () => {
    try {
      const { data: workerData, error } = await supabase
        .from("workers")
        .select("*")
        .eq("id", workerId)
        .single();

      if (error) throw error;
      
      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url")
        .eq("id", workerData.user_id)
        .single();
      
      // Get services
      const { data: services } = await supabase
        .from("worker_services")
        .select("services(id, name, icon)")
        .eq("worker_id", workerData.id);
      
      setWorker({
        ...workerData,
        profiles: profile || { full_name: "Unknown", phone: null, avatar_url: null },
        worker_services: services || []
      } as any);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading worker profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Get reviews first
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .select("*")
        .eq("worker_id", workerId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (reviewError) throw reviewError;

      // Then get profile info for each review
      const reviewsWithProfiles = await Promise.all(
        (reviewData || []).map(async (review) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", review.customer_id)
            .single();
          
          return {
            ...review,
            profiles: profile || { full_name: "Anonymous" }
          };
        })
      );

      setReviews(reviewsWithProfiles);
    } catch (error: any) {
      console.error("Error loading reviews:", error);
    }
  };

  const handleBooking = async () => {
    if (!worker || !bookingDate || !customerAddress) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("bookings").insert({
        customer_id: user.id,
        worker_id: worker.id,
        service_id: worker.worker_services[0]?.services.id,
        scheduled_at: bookingDate,
        total_price: worker.hourly_rate,
        customer_address: customerAddress,
        notes: bookingNotes,
      });

      if (error) throw error;

      toast({
        title: "Booking requested!",
        description: "The worker will receive your booking request shortly.",
      });

      navigate("/services");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading worker profile...</div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Worker not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/services")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold">ServiceNow</span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Worker Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-4xl font-display text-white shadow-glow">
                  {worker.profiles.full_name.charAt(0)}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-display mb-2">{worker.profiles.full_name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-warning text-warning" />
                        <span className="font-semibold">{worker.rating.toFixed(1)}</span>
                        <span>({worker.total_jobs} jobs completed)</span>
                      </div>
                      {worker.address && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{worker.address}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {worker.worker_services.map(({ services }) => (
                      <Badge key={services.id} variant="secondary">
                        {services.icon} {services.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-display">{worker.experience_years}+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-display">${worker.hourly_rate}</div>
                    <div className="text-sm text-muted-foreground">Per Hour</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-display">✓</div>
                    <div className="text-sm text-muted-foreground">Verified</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bio */}
            {worker.bio && (
              <Card className="p-6">
                <h2 className="text-xl font-display mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{worker.bio}</p>
              </Card>
            )}

            {/* Reviews */}
            <Card className="p-6">
              <h2 className="text-xl font-display mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Customer Reviews
              </h2>
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No reviews yet</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{review.profiles.full_name}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-warning text-warning"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground">{review.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                      <Separator className="mt-4" />
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-display mb-6">Book This Worker</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date & Time</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Your Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements or details..."
                    rows={4}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estimated Cost</span>
                    <span className="text-2xl font-display">${worker.hourly_rate}/hr</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Final cost will be confirmed by the worker
                  </p>
                </div>

                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 h-12 text-lg"
                  onClick={handleBooking}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Request Booking
                </Button>

                {worker.profiles.phone && (
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Worker
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerProfile;