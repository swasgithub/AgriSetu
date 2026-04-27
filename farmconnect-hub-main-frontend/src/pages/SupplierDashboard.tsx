import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import {
    Package,
    ShoppingCart,
    User,
    Phone,
    MapPin,
    Plus,
    TrendingUp,
    DollarSign,
    Box,
    Clock
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
const SupplierDashboard = () => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user"));
    });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                const { data: userData } = await axios.get(`${API_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { data: productData } = await axios.get(`${API_URL}/api/products/my`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { data: orderData } = await axios.get(`${API_URL}/api/orders/supplier`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(userData);
                setProducts(productData);
                setOrders(orderData);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-20 flex flex-col items-center gap-4">
        <Package className="w-10 h-10 animate-bounce text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading your dashboard...</p>
    </div>;

    if (!user) return <Navigate to="/login" />;
    if (user.role !== "supplier") return <Navigate to="/" />;

    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    const quickStats = [
        { 
            label: "Total Products", 
            value: products.length, 
            icon: Box,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        { 
            label: "Orders Received", 
            value: orders.length, 
            icon: ShoppingCart,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        { 
            label: "Total Revenue", 
            value: `₹${totalRevenue.toLocaleString()}`, 
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-100",
        },
    ];

    return (
        <DashboardLayout
            title="Supplier Dashboard"
            description="Manage your inventory, track orders, and grow your sales."
            user={user}
        >
            {/* QUICK STATS */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                {quickStats.map((item) => (
                    <Card key={item.label} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                            <div className="flex items-stretch h-24">
                                <div className={`w-2 ${item.bg.replace('100', '500')}`} />
                                <div className="flex-1 p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                                        <p className="text-2xl font-black mt-1">{item.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${item.bg}`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Profile & Quick Actions */}
                <div className="space-y-8">
                    <Card className="shadow-md border-none">
                        <CardHeader className="border-b"><CardTitle className="text-lg">Business Profile</CardTitle></CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {[
                                { icon: User, label: "Representative", value: user.name },
                                { icon: Phone, label: "Support Phone", value: user.phone },
                                { icon: MapPin, label: "Warehouse Location", value: user.district },
                            ].map((row) => (
                                <div key={row.label} className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <row.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">{row.label}</p>
                                        <p className="font-semibold text-sm">{row.value}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 border border-primary/10">
                            <Plus className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-lg font-bold mb-2 text-foreground">Add New Product</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                List seeds, tools, or fertilizers for sale in the marketplace.
                            </p>
                            <Link to="/add-product">
                                <Button className="w-full shadow-lg shadow-primary/20">Create Listing</Button>
                            </Link>
                        </div>

                        <div className="rounded-2xl bg-muted/50 p-6 border">
                            <Package className="w-10 h-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-bold mb-2 text-foreground">Inventory Control</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Update pricing, stock levels, or manage existing listings.
                            </p>
                            <Link to="/my-products">
                                <Button variant="outline" className="w-full">Manage Products</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Orders */}
                    <Card className="shadow-lg border-none overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg font-bold">Recent Incoming Orders</CardTitle>
                            </div>
                            <Badge variant="secondary">{orders.length}</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            {orders.length === 0 ? (
                                <div className="text-center py-16">
                                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                    <p className="text-muted-foreground">No orders received yet.</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {orders.slice(0, 5).map((o) => (
                                        <div key={o._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-muted/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">Order #{o._id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-xs text-muted-foreground">Amount: <span className="font-semibold text-primary">₹{o.totalAmount}</span></p>
                                                </div>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3">Processing</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stock Overview */}
                    <Card className="shadow-md border-none">
                        <CardHeader className="border-b">
                            <div className="flex items-center gap-2">
                                <Box className="w-5 h-5 text-blue-600" />
                                <CardTitle className="text-lg font-bold">Inventory Preview</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {products.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground">No products listed yet.</p>
                            ) : (
                                <div className="divide-y max-h-[300px] overflow-y-auto">
                                    {products.map((p) => (
                                        <div key={p._id} className="p-4 flex justify-between items-center hover:bg-muted/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                                                    <img src={p.image || "https://via.placeholder.com/40"} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{p.name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-sm text-primary">₹{p.price}</p>
                                                <p className="text-[10px] text-muted-foreground">per {p.unit || 'unit'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default SupplierDashboard;