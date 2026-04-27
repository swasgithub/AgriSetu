import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Package, Tag, Pencil, Plus } from "lucide-react";
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
const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/api/products/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(data);
        } catch (error) {
            console.error("Fetch products error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProducts(products.filter((p) => p._id !== id));
            toast({
                title: "Product deleted",
                description: "Product removed from your shop.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product.",
                variant: "destructive"
            });
        }
    };

    return (
        <DashboardLayout 
            title="My Products" 
            description="Manage your inventory and pricing" 
            user={JSON.parse(localStorage.getItem("user"))}
        >
            <div className="max-w-5xl mx-auto">
                <Card className="shadow-lg border-none overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-6 bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <Package className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Your Product List</CardTitle>
                        </div>
                        <Link to="/add-product">
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> Add New
                            </Button>
                        </Link>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-muted-foreground">Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-10" />
                                <h3 className="text-xl font-bold mb-2">No products found</h3>
                                <p className="text-muted-foreground mb-8 text-sm">You haven't added any products to your shop yet.</p>
                                <Link to="/add-product">
                                    <Button className="shadow-lg shadow-primary/20">Add Your First Product</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y">
                                <TooltipProvider>
                                {products.map((p) => (
                                    <div 
                                        key={p._id} 
                                        className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted/10 transition-all"
                                    >
                                        <div className="flex gap-6 items-center flex-1 w-full">
                                            <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden shrink-0 shadow-inner border">
                                                <img 
                                                    src={p.image || "https://via.placeholder.com/150?text=Product"} 
                                                    alt={p.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="font-bold text-xl text-foreground leading-none">{p.name}</h3>
                                                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                                                        {p.category}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1.5 font-bold text-primary text-lg">
                                                        ₹{p.price}
                                                        <span className="text-[10px] text-muted-foreground font-normal">/{p.unit || "unit"}</span>
                                                    </span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                                    <span className="text-xs text-muted-foreground italic line-clamp-1">{p.description}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-dashed">
                                            
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link to={`/edit-product/${p._id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-11 w-11 rounded-full border-2 border-blue-100 text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Product</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-11 w-11 rounded-full border-2 border-red-100 text-red-600 hover:bg-red-50 transition-all active:scale-95"
                                                        onClick={() => deleteProduct(p._id)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Product</p>
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

export default MyProducts;