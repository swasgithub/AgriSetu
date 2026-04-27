import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Tractor, MapPin, Power, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { API_URL } from "@/config/api";
const MyMachines = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchMachines = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/api/machines/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMachines(data);
        } catch (error) {
            console.error("Fetch machines error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    const toggleAvailability = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/api/machines/${id}`, 
                { available: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMachines(machines.map(m => m._id === id ? { ...m, available: !currentStatus } : m));
            
            toast({
                title: "Status Updated",
                description: `Machine is now ${!currentStatus ? 'Available' : 'Booked'}.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update availability.",
                variant: "destructive"
            });
        }
    };

    const deleteMachine = async (id) => {
        
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/machines/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMachines(machines.filter((m) => m._id !== id));
            toast({
                title: "Machine deleted",
                description: "Equipment removed from your listings.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete machine.",
                variant: "destructive"
            });
        }
    };

    return (
        <DashboardLayout 
            title="Manage Machinery" 
            description="Control your listings and availability" 
            user={JSON.parse(localStorage.getItem("user"))}
        >
            <div className="max-w-5xl mx-auto">
                <Card className="shadow-lg border-none">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Tractor className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold">My Machine Listings</CardTitle>
                        </div>
                        <Badge variant="secondary" className="px-4 py-1 text-sm font-bold">
                            {machines.length} Total
                        </Badge>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-muted-foreground">Loading your equipment...</p>
                            </div>
                        ) : machines.length === 0 ? (
                            <div className="text-center py-20">
                                <Tractor className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-10" />
                                <h3 className="text-xl font-semibold mb-2">No machines found</h3>
                                <p className="text-muted-foreground mb-8 text-sm">Start earning by listing your first machine today.</p>
                                <Button onClick={() => window.location.href='/add-machine'}>Add New Machine</Button>
                            </div>
                        ) : (
                            <div className="divide-y">
                                <TooltipProvider>
                                {machines.map((m) => (
                                    <div 
                                        key={m._id} 
                                        className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted/10 transition-all"
                                    >
                                        <div className="flex gap-6 items-center flex-1">
                                            <div className="w-24 h-24 rounded-xl bg-muted overflow-hidden shrink-0 shadow-inner">
                                                <img 
                                                    src={m.image || "https://via.placeholder.com/150?text=Machine"} 
                                                    alt={m.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-xl text-foreground">{m.name}</h3>
                                                    <Badge className={m.available ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                                                        {m.available ? "Available" : "Booked"}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <MapPin className="w-3 h-3" />
                                                        {m.location?.village || "Main"}, {m.location?.district || "Area"}
                                                    </span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                                    <span className="text-primary font-bold text-lg">₹{m.pricePerDay}<span className="text-[10px] text-muted-foreground font-normal">/day</span></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                            
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className={`h-11 w-11 rounded-full border-2 ${m.available ? "border-orange-100 text-orange-600 hover:bg-orange-50" : "border-green-100 text-green-600 hover:bg-green-50"}`}
                                                        onClick={() => toggleAvailability(m._id, m.available)}
                                                    >
                                                        <Power className="w-5 h-5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{m.available ? "Mark as Booked" : "Mark as Available"}</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link to={`/edit-machine/${m._id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-11 w-11 rounded-full border-2 border-blue-100 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Machine Details</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-11 w-11 rounded-full border-2 border-red-100 text-red-600 hover:bg-red-50"
                                                        onClick={() => deleteMachine(m._id)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Listing</p>
                                                </TooltipContent>
                                            </Tooltip>

                                        </div>
                                    </div>
                                ))}
                                </TooltipProvider>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default MyMachines;
