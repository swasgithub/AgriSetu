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
const EditMachine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [form, setForm] = useState({
        name: "",
        type: "",
        pricePerDay: "",
        description: "",
        image: "",
        location: {
            village: "",
            district: "",
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchMachine = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${API_URL}/api/machines/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setForm({
                    name: data.name || "",
                    type: data.type || "",
                    pricePerDay: data.pricePerDay || "",
                    description: data.description || "",
                    image: data.image || "",
                    location: {
                        village: data.location?.village || "",
                        district: data.location?.district || "",
                    }
                });
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to load machine data.",
                    variant: "destructive"
                });
                navigate("/my-machines");
            } finally {
                setLoading(false);
            }
        };

        fetchMachine();
    }, [id, navigate, toast]);

    const handleChange = (e) => {
        if (e.target.name === "village" || e.target.name === "district") {
            setForm({
                ...form,
                location: {
                    ...form.location,
                    [e.target.name]: e.target.value
                }
            });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            await axios.put(`${API_URL}/api/machines/${id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast({
                title: "Updated Successfully!",
                description: "Machine details have been saved.",
            });
            navigate("/my-machines");

        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to update machine.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading machine details...</div>;

    return (
        <DashboardLayout 
            title="Edit Machine" 
            description="Update your machinery information" 
            user={JSON.parse(localStorage.getItem("user"))}
        >
            <div className="max-w-xl mx-auto">
                <Button 
                    variant="ghost" 
                    className="mb-4 gap-2 text-muted-foreground"
                    onClick={() => navigate("/my-machines")}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Listings
                </Button>

                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Edit {form.name}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Machine Name</label>
                                <Input name="name" value={form.name} required onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Type</label>
                                <Input name="type" value={form.type} required onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Rent Price Per Day (₹)</label>
                                <Input name="pricePerDay" type="number" value={form.pricePerDay} required onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Image URL</label>
                                <Input name="image" value={form.image} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Village</label>
                                    <Input name="village" value={form.location.village} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">District</label>
                                    <Input name="district" value={form.location.district} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-md min-h-[100px] text-sm"
                                />
                            </div>

                            <Button type="submit" disabled={saving} className="w-full h-11 text-lg font-semibold">
                                {saving ? "Saving Changes..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default EditMachine;
