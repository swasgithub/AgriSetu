import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";
const AddMachine = () => {
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

    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            await axios.post(`${API_URL}/api/machines`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast({
                title: "Machine added!",
                description: "Your equipment has been listed for rent.",
            });
            navigate("/dashboard/owner");

        } catch (err) {
            console.log(err.response?.data || err.message);
            toast({
                title: "Error",
                description: "Failed to add machine. Please check all fields.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout 
            title="Add Machine" 
            description="List your machinery for rent" 
            user={JSON.parse(localStorage.getItem("user"))}
        >
            <Card className="max-w-xl mx-auto shadow-md">
                <CardHeader>
                    <CardTitle>Add New Machine</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <Input name="name" placeholder="Machine Name (e.g. John Deere Tractor)" required onChange={handleChange} />

                        <Input name="type" placeholder="Type (e.g. Tractor, Harvester, Drone)" required onChange={handleChange} />

                        <Input name="pricePerDay" type="number" placeholder="Rent Price Per Day (₹)" required onChange={handleChange} />

                        <Input name="image" placeholder="Image URL " onChange={handleChange} />

                        <div className="grid grid-cols-2 gap-4">
                            <Input name="village" placeholder="Village" onChange={handleChange} />
                            <Input name="district" placeholder="District" onChange={handleChange} />
                        </div>

                        <textarea
                            name="description"
                            placeholder="Brief description of the machine's condition and features"
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md min-h-[100px] text-sm"
                        />

                        <Button type="submit" disabled={loading} className="w-full h-11 text-lg font-semibold">
                            {loading ? "Listing..." : "List Machine"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default AddMachine;
