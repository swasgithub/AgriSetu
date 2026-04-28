import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Bug,
  Cloud,
  Droplets,
  TrendingUp,
  Shield,
  Activity,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { API_URL } from "@/config/api";
import axios from "axios";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Bug,
  Cloud,
  Droplets,
  TrendingUp,
  Shield,
};

const colorMap: Record<string, string> = {
  earth: "bg-earth text-primary-foreground",
  leaf: "bg-leaf text-primary-foreground",
  sky: "bg-sky text-primary-foreground",
  wheat: "bg-wheat text-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

const statusColorMap: Record<string, string> = {
  active: "bg-leaf/20 text-leaf border-leaf/30",
  warning: "bg-wheat/20 text-wheat border-wheat/30",
  inactive: "bg-muted text-muted-foreground",
};

const Consult = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState<any[]>([]);
  const [purchasedTypes, setPurchasedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch all agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/agents`);
        console.log(API_URL)
        console.log(data)
        setAgents(data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  //Fetch purchased agents
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get(
          `${API_URL}/api/agent-purchases/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const types = data.map((p: any) => p.agentType);
        setPurchasedTypes(types);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };

    fetchPurchases();
  }, []);

  // Only show soil agent (as per your demo)
  const visibleAgents = agents

  // Buy button handler
  const handleBuyAgent = (agent: any) => {
    navigate("/agent-checkout", {
      state: {
        agentType: agent.type,
        agentName: agent.name,
        price: agent.price,
      },
    });
  };

  //  Dashboard open handler (protected)
  const handleViewDashboard = (agent: any) => {
    if (!purchasedTypes.includes(agent.type)) {
      alert("Please purchase the sensor kit first!");
      return;
    }

    window.open("https://agrisetu-dashboard.onrender.com/", "_blank");
  };

  if (loading) {
    return <h1 className="text-center mt-10">Loading agents...</h1>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-wheat-light py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">
            AI Farming Consultancy
          </h1>
          <p className="text-muted-foreground">
            Buy sensor kits to unlock real-time AI insights for your farm.
          </p>
        </div>
      </section>

      {/* Main */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAgents.map((agent) => {
              const Icon = iconMap[agent.icon] || Leaf;
              const isOwned = purchasedTypes.includes(agent.type);

              return (
                <Card key={agent._id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded ${colorMap[agent.color]}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <Badge className={statusColorMap[agent.status]}>
                        {agent.status}
                      </Badge>
                    </div>

                    <CardTitle>{agent.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {agent.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    {/* Reading */}
                    <div className="bg-muted p-3 rounded mb-3 relative">
                      {!isOwned && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
                          🔒 Buy to unlock data
                        </div>
                      )}

                      {Object.entries(agent.lastReading || {}).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span>{key}</span>
                            <span>{String(value)}</span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Price */}
                    {!isOwned && (
                      <p className="mb-2 font-bold">₹{agent.price}</p>
                    )}

                    {/* Buttons */}
                    {isOwned ? (
                      <Button
                        className="w-full"
                        onClick={() => handleViewDashboard(agent)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Dashboard
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleBuyAgent(agent)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Sensor Kit
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Consult;