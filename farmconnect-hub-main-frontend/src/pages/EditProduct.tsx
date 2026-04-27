import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "@/config/api";
const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        image: "",
        unit: "",
        rating: 0,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${API_URL}/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setForm({
                    name: data.name || "",
                    price: data.price || "",
                    category: data.category || "",
                    description: data.description || "",
                    image: data.image || "",
                    unit: data.unit || "",
                    rating: data.rating || 0,
                });
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to load product data.",
                    variant: "destructive"
                });
                navigate("/my-products");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate, toast]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            await axios.put(`/api/products/${id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast({
                title: "Updated Successfully!",
                description: "Product details have been saved.",
            });
            navigate("/my-products");

        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to update product.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 font-medium">Loading product details...</div>;

    return (
        <DashboardLayout 
            title="Edit Product" 
            description="Update your product information" 
            user={JSON.parse(localStorage.getItem("user"))}
        >
            <div className="max-w-xl mx-auto">
                <Button 
                    variant="ghost" 
                    className="mb-4 gap-2 text-muted-foreground hover:bg-muted"
                    onClick={() => navigate("/my-products")}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to My Products
                </Button>

                <Card className="shadow-lg border-none">
                    <CardHeader className="bg-primary/5 rounded-t-xl">
                        <CardTitle className="text-xl">Edit {form.name}</CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Product Name</label>
                                <Input name="name" value={form.name} required onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Price (₹)</label>
                                    <Input name="price" type="number" value={form.price} required onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Unit (e.g. kg, bag)</label>
                                    <Input name="unit" value={form.unit} required onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Category</label>
                                <Input name="category" value={form.category} required onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Image URL</label>
                                <Input name="image" value={form.image} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Rating (0.0 - 5.0)</label>
                                <Input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-xl min-h-[120px] text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            <Button type="submit" disabled={saving} className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 mt-4">
                                {saving ? "Saving Changes..." : "Save Product Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default EditProduct;
