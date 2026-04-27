import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";
const AddProduct = () => {
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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/api/products`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Product added!",
        description: "Your product has been listed successfully.",
      });
      navigate("/my-products");

    } catch (err) {
      console.log(err.response?.data || err.message);
      toast({
        title: "Error",
        description: "Failed to add product. Please check all fields.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add Product" description="List a new product" user={JSON.parse(localStorage.getItem("user"))}>
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <Input name="name" placeholder="Product Name" onChange={handleChange} />

            <Input name="price" type="number" placeholder="Price" onChange={handleChange} />

            <Input name="category" placeholder="Category" onChange={handleChange} />

            <Input name="unit" placeholder="Unit (kg, litre, etc)" onChange={handleChange} />

            <Input name="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating" onChange={handleChange} />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <Input name="image" placeholder="Image URL" onChange={handleChange} />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Product"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AddProduct;