import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import {
  Bot,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  Sprout,
  Tractor,
  User,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { agents, machines, products } from "@/data/demoData";

const FarmerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [rents, setRents] = useState([])
  const [products, setProducts] = useState([]);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });
        console.log(data)
        setUser(data);
      } catch (error) {
        console.log("User fetch error:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get("/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(data);
      } catch (error) {
        console.log("Orders fetch error:", error.message);
      }
    };
    const fetchRentals = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get("/api/rentals/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRents(data);
      } catch (error) {
        console.log("Rentals fetch error:", error.message);
      }
    };
    const fetchProducts = async () => {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    };

    const fetchMachines = async () => {
      const { data } = await axios.get("/api/machines");
      setMachines(data);
    };

    fetchUser();
    fetchOrders();
    fetchRentals();
    fetchProducts();
    fetchMachines();
  }, []);






  // Handle loading
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (user.role && user.role !== "farmer") {
    return <Navigate to="/" replace />;
  }

  const featuredProducts = products.slice(0, 3);
  const availableMachines = machines
    .filter((machine) => machine.available)
    .slice(0, 3);
  const activeAgents = agents
    .filter((agent) => agent.status === "active")
    .slice(0, 4);

  const quickStats = [
    {
      label: "Products available",
      value: products.length,
      icon: ShoppingCart,
      helper: "Ready to purchase",
    },
    {
      label: "Machines available",
      value: availableMachines.length,
      icon: Tractor,
      helper: "Ready to rent",
    },
    {
      label: "AI agents online",
      value: activeAgents.length,
      icon: Bot,
      helper: "For farm guidance",
    },
    {
      label: "Your Orders",
      value: orders.length,
      icon: Package,
      helper: "Orders placed",
    },
    {
      label: "Your Rentals",
      value: rents.length,
      icon: Tractor,
      helper: "Machines rented",
    }
  ];

  const infoRows = [
    { icon: User, label: "Farmer name", value: user.name || "Not available" },
    { icon: Phone, label: "Phone", value: user.phone || "Not available" },
    {
      icon: MapPin,
      label: "Location",
      value:
        [user.village, user.district].filter(Boolean).join(", ") ||
        "Not available",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-gradient-to-br from-leaf-light via-background to-wheat-light py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary text-primary-foreground">
                Farmer Dashboard
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Welcome, {user.name || "Farmer"}
              </h1>
              <p className="text-muted-foreground text-lg">
                This dashboard provides farmers with a centralized platform to
                manage their profile, explore agricultural products, rent
                machinery, and access AI-powered guidance all in one convenient
                place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/buy">
                <Button className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Buy Inputs
                </Button>
              </Link>
              <Link to="/rent">
                <Button variant="outline" className="gap-2">
                  <Tractor className="w-4 h-4" />
                  Rent Equipment
                </Button>
              </Link>
              <Link to="/consult">
                <Button variant="outline" className="gap-2">
                  <Bot className="w-4 h-4" />
                  Ask AI Agents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 space-y-8">

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            {quickStats.map((item) => (
              <Card key={item.label}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {item.value}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.helper}
                    </p>
                    {item.label === "Your Orders" && orders.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {orders.slice(0, 2).map((order) => (
                          <p key={order._id} className="text-xs text-muted-foreground">
                            Rs {order.totalAmount}
                          </p>
                        ))}
                      </div>
                    )}
                    {item.label === "Your Rentals" && rents.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {rents.slice(0, 2).map((rent) => (
                          <p key={rent._id} className="text-xs text-muted-foreground">
                            {rent.machine?.name} ({rent.totalDays} days)
                          </p>
                        ))}
                      </div>
                    )}

                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile + Actions */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {infoRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="mt-0.5 w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <row.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {row.label}
                      </p>
                      <p className="font-medium text-foreground">
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}


              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What you can do now</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-leaf-light p-4">
                  <ShoppingCart className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">
                    Buy farm products
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse seeds, fertilizers, pesticides, and tools.
                  </p>
                  <Link to="/buy">
                    <Button size="sm">Open Marketplace</Button>
                  </Link>
                </div>

                <div className="rounded-xl bg-earth-light p-4">
                  <Tractor className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">
                    Rent machinery
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Request tractors, drones, harvesters, and more.
                  </p>
                  <Link to="/rent">
                    <Button size="sm" variant="secondary">
                      Open Rentals
                    </Button>
                  </Link>
                </div>

                <div className="rounded-xl bg-wheat-light p-4">
                  <Bot className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">
                    Consult AI agents
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check weather, pests, soil condition, and market insights.
                  </p>
                  <Link to="/consult">
                    <Button size="sm" variant="outline">
                      Open AI Hub
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lists */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {featuredProducts.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id}>
                    <div className="rounded-lg border p-3 hover:shadow cursor-pointer">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                        <Badge variant="outline">
                          Rs {product.price}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Machines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableMachines.map((machine) => (
                  <Link to={`/machine/${machine.id}`} key={machine.id}>
                    <div className="rounded-lg border p-3 hover:shadow cursor-pointer">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {machine.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {machine.type}
                          </p>
                        </div>
                        <Badge className="bg-secondary">
                          Rs {machine.dailyRate}/day
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Agent Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeAgents.map((agent) => (
                  <div key={agent.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-medium text-foreground">
                        {agent.name}
                      </p>
                      <Badge className="bg-leaf text-primary-foreground">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {agent.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>



          {/* Platform Status */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">


              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tractor className="w-4 h-4 text-primary" />
                  <p className="font-medium">Rentals API</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect to `/api/rentals/my`.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="w-4 h-4 text-primary" />
                  <p className="font-medium">AI history</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consultation records (coming soon).
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;
