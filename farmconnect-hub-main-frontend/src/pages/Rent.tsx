import { useEffect, useState } from "react";
import { Search, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { machines } from "@/data/demoData";
import axios from "axios";
import { API_URL } from "@/config/api";
const Rent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [machines, setMachines] = useState([]);
  const { toast } = useToast();

  const machineTypes = ["All", "Tractor", "Drone", "Harvester", "Sprayer", "Tiller", "Seeder"];

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/machines`);
        setMachines(data);
      } catch (error) {
        console.log("FETCH MACHINE ERROR:", error);
      }
    };

    fetchMachines();
  }, []);

  const filteredMachines = machines.filter((machine: any) => {
    const matchesSearch = machine.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "All" || machine.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleRentRequest = async (machine: any) => {
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-earth-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Rent Farm Machinery
            </h1>
            <p className="text-muted-foreground text-lg">
              Affordable rental of tractors, drones, harvesters, and modern farming equipment
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search machinery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {machineTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={selectedType === type ? "bg-secondary hover:bg-secondary/90" : "hover:bg-muted"}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Machines Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines.map((machine) => (
              <Card key={machine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={machine.image}
                    alt={machine.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${machine.available
                        ? "bg-leaf text-primary-foreground"
                        : "bg-destructive text-destructive-foreground"
                      }`}
                  >
                    {machine.available ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Available</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Booked</>
                    )}
                  </Badge>
                  <Badge className="absolute top-3 left-3 bg-secondary">
                    {machine.type}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {machine.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {machine.description}
                  </p>




                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">

                    {/* Daily */}
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Daily</div>
                      <div className="font-bold text-primary">
                        ₹{machine.pricePerDay?.toLocaleString()}
                      </div>
                    </div>

                    <div className="h-8 w-px bg-border" />

                    {/* Weekly (calculated) */}
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Weekly</div>
                      <div className="font-bold text-primary">
                        ₹{(machine.pricePerDay * 7)?.toLocaleString()}
                      </div>
                    </div>

                  </div>

                  <Button
                    className="w-full gap-2"
                    disabled={!machine.available}
                    onClick={() => handleRentRequest(machine)}
                  >
                    <Calendar className="w-4 h-4" />
                    {machine.available ? "Request Rental" : "Not Available"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMachines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No machinery found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rent;
