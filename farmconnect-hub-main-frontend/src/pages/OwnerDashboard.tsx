import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import {
    Tractor,
    User,
    Phone,
    MapPin,
    Plus,
    Package,
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";
const OwnerDashboard = () => {
    const { toast } = useToast();
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user"));
    });

    const [machines, setMachines] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        try {
            const { data: userData } = await axios.get(`${API_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { data: machineData } = await axios.get(`${API_URL}/api/machines/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { data: rentalData } = await axios.get(`${API_URL}/api/rentals/owner`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(userData);
            setMachines(machineData);
            setRentals(rentalData);
        } catch (error) {
            console.error("Fetch dashboard data error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (rentalId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/api/rentals/${rentalId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast({
                title: "Status Updated",
                description: `Rental request ${newStatus} successfully.`,
            });
            fetchData(); // Refresh data
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update rental status.",
                variant: "destructive"
            });
        }
    };

    if (loading) return <div className="text-center py-20 flex flex-col items-center gap-4">
        <Tractor className="w-10 h-10 animate-bounce text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
    </div>;
    
    if (!user) return <Navigate to="/login" />;
    if (user.role !== "equipment_owner") return <Navigate to="/" />;

    const earnings = rentals
        .filter(r => r.status === "approved" || r.status === "completed")
        .reduce((acc, r) => acc + (r.totalAmount || 0), 0);

    const pendingRentals = rentals.filter(r => r.status === "pending");
    const activeRentals = rentals.filter(r => r.status === "approved" || r.status === "completed");

    const quickStats = [
        {
            label: "Your Machines",
            value: machines.length,
            icon: Tractor,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            label: "Pending Requests",
            value: pendingRentals.length,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
        {
            label: "Total Earnings",
            value: `₹${earnings.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-100",
        },
    ];

    const infoRows = [
        { icon: User, label: "Owner Name", value: user.name || "N/A" },
        { icon: Phone, label: "Phone", value: user.phone || "N/A" },
        { icon: MapPin, label: "Location", value: user.district || "N/A" },
    ];

    return (
        <DashboardLayout
            title="Equipment Owner Dashboard"
            description="Manage your machines, rentals, and earnings."
            user={user}
        >
            {/* QUICK STATS */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                {quickStats.map((item) => (
                    <Card key={item.label} className="border-none shadow-md overflow-hidden">
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
                {/* Profile & Actions */}
                <div className="space-y-8">
                    <Card className="shadow-md">
                        <CardHeader className="border-b"><CardTitle className="text-lg">Your Profile</CardTitle></CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {infoRows.map((row) => (
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
                            <h3 className="text-lg font-bold mb-2 text-foreground">List New Machine</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Add your tractors, drones, or other equipment to start earning.
                            </p>
                            <Link to="/add-machine">
                                <Button className="w-full shadow-lg shadow-primary/20">Add Machine</Button>
                            </Link>
                        </div>

                        <div className="rounded-2xl bg-muted/50 p-6 border">
                            <Tractor className="w-10 h-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-bold mb-2 text-foreground">My Equipment</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                View and manage your current machine listings.
                            </p>
                            <Link to="/my-machines">
                                <Button variant="outline" className="w-full">Manage Listings</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Area: Requests & Machines */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Pending Requests */}
                    <Card className="shadow-lg border-orange-100">
                        <CardHeader className="bg-orange-50/50 border-b flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-600" />
                                <CardTitle className="text-lg font-bold text-orange-900">Pending Requests</CardTitle>
                            </div>
                            <Badge className="bg-orange-600">{pendingRentals.length}</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            {pendingRentals.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground text-sm">No pending requests at the moment.</p>
                            ) : (
                                <div className="divide-y">
                                    {pendingRentals.map((r) => (
                                        <div key={r._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                    <Package className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{r.machine?.name}</p>
                                                    <p className="text-xs text-muted-foreground">Requested by: <span className="font-semibold text-foreground">{r.user?.name}</span></p>
                                                    <p className="text-xs font-medium text-primary mt-1">₹{r.totalAmount} for {r.totalDays} days</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <Button 
                                                    size="sm" 
                                                    className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                                                    onClick={() => handleUpdateStatus(r._id, "approved")}
                                                >
                                                    Approve
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="text-red-600 hover:bg-red-50 border-red-200 flex-1 sm:flex-none"
                                                    onClick={() => handleUpdateStatus(r._id, "rejected")}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Active/Completed Rentals */}
                    <Card className="shadow-md">
                        <CardHeader className="border-b">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <CardTitle className="text-lg font-bold">Rental History</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {activeRentals.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground text-sm">No rental history yet.</p>
                            ) : (
                                <div className="divide-y max-h-[400px] overflow-y-auto">
                                    {activeRentals.map((r) => (
                                        <div key={r._id} className="p-4 flex justify-between items-center bg-muted/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center">
                                                    <Tractor className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{r.machine?.name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{r.user?.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm">₹{r.totalAmount}</p>
                                                <Badge className={r.status === "completed" ? "bg-green-600" : "bg-blue-600"} style={{fontSize: '9px'}}>
                                                    {r.status}
                                                </Badge>
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
};

export default OwnerDashboard;