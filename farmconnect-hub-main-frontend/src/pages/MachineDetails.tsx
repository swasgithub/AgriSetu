import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Calendar, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_URL } from "@/config/api";

const MachineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [machine, setMachine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/machines/${id}`)
      .then((res) => {
        setMachine(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleRentRequest = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/rentals`,
        {
          machineId: machine._id,
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Rental Request Sent",
        description: `${machine.name} requested successfully`,
      });

    } catch (error: any) {
      console.log(error.response?.data || error.message);
      toast({
        title: "Error",
        description: "Failed to send rental request.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Loading machine details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Machine not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-earth-light py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Machine Details
          </h1>
        </div>
      </section>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0">

              {/* Left — Image */}
              <div className="relative bg-muted aspect-square md:aspect-auto">
                <img
                  src={machine.image || "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={machine.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-4 right-4 text-base px-3 py-1 ${machine.available
                      ? "bg-leaf text-primary-foreground"
                      : "bg-destructive text-destructive-foreground"
                    }`}
                >
                  {machine.available ? (
                    <><CheckCircle className="w-4 h-4 mr-1 inline-block" /> Available</>
                  ) : (
                    <><XCircle className="w-4 h-4 mr-1 inline-block" /> Booked</>
                  )}
                </Badge>
                <Badge className="absolute top-4 left-4 bg-secondary text-base px-3 py-1">
                  {machine.type}
                </Badge>
              </div>

              {/* Right — Info */}
              <CardContent className="p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {machine.name}
                  </h2>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Daily Rate</div>
                      <div className="text-2xl font-bold text-primary">
                        ₹{machine.pricePerDay?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Weekly Rate</div>
                      <div className="text-2xl font-bold text-primary">
                        ₹{((machine.pricePerDay || 0) * 7).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {machine.description}
                  </p>

                  {/* Extra details */}
                  <div className="space-y-2 text-sm mb-8">
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground w-24">Type:</span>
                      <span className="text-muted-foreground">{machine.type}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-auto">
                  <Button
                    className="flex-1 gap-2"
                    disabled={!machine.available}
                    onClick={handleRentRequest}
                  >
                    <Calendar className="w-4 h-4" />
                    {machine.available ? "Request Rental" : "Not Available"}
                  </Button>
                </div>
              </CardContent>

            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MachineDetails;
