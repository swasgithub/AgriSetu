import { Leaf, Bug, Cloud, Droplets, TrendingUp, Shield, ArrowRight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { agents } from "@/data/demoData";
import { API_URL } from "@/config/api";
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
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-wheat-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-wheat/20 px-3 py-1 rounded-full mb-4">
              <Activity className="w-4 h-4 text-wheat" />
              <span className="text-sm font-medium text-foreground">Powered by AI</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI Farming Consultancy
            </h1>
            <p className="text-muted-foreground text-lg">
              Get intelligent insights from our 6 specialized AI agents for soil, weather, disease, irrigation, market prices, and pest detection.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Agents Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const Icon = iconMap[agent.icon] || Leaf;
              return (
                <Card key={agent.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[agent.color] || colorMap.leaf}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={statusColorMap[agent.status]}
                      >
                        {agent.status === "active" ? "● Active" : "⚠ Warning"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-4">{agent.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </CardHeader>
                  <CardContent>
                    {/* Latest Reading */}
                    <div className="bg-muted rounded-lg p-4 mb-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Latest Reading
                      </h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(agent.lastReading).map(([key, value]) => {
                          if (key === "recommendation") return null;
                          return (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span className="font-medium text-foreground">{String(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recommendation */}
                    {agent.lastReading.recommendation && (
                      <div className="bg-leaf-light border border-leaf/20 rounded-lg p-3 mb-4">
                        <p className="text-sm text-foreground">
                          <span className="font-semibold">💡 Tip:</span> {agent.lastReading.recommendation}
                        </p>
                      </div>
                    )}

                    <Button variant="outline" className="w-full gap-2 group">
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-primary rounded-2xl p-8 text-primary-foreground">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">How AI Agents Work</h2>
              <p className="text-primary-foreground/80 mb-6">
                Our AI agents analyze data from multiple sources including IoT sensors, satellite imagery, and local weather stations to provide you with actionable farming insights in real-time.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                  Real-time Analysis
                </Badge>
                <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                  Local Data
                </Badge>
                <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                  24/7 Monitoring
                </Badge>
                <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                  SMS Alerts
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Consult;
