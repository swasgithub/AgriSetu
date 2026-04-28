import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Plus, ShoppingCart, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_URL } from "@/config/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    let cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cartData.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cartData.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    toast({
      title: "Added to Cart",
      description: `${product.name} added successfully`,
    });
  };

  const handleBuy = () => {
    navigate("/checkout", {
      state: {
        items: [{
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }],
        totalAmount: product.price,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Loading product...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero — same bg as Buy.tsx */}
      <section className="bg-leaf-light py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Product Details
          </h1>
        </div>
      </section>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0">

              {/* Left — Image */}
              <div className="relative bg-muted aspect-square md:aspect-auto">
                <img
                  src={product.image || "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-base px-3 py-1">
                  {product.category}
                </Badge>
              </div>

              {/* Right — Info */}
              <CardContent className="p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-5 h-5 fill-wheat text-wheat" />
                    <span className="font-medium">{product.rating || "4.5"}</span>
                    <span className="text-muted-foreground text-sm ml-1">/ 5</span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-primary">
                      ₹{product.price}
                    </span>
                    <span className="text-muted-foreground ml-1">/ {product.unit || "unit"}</span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Extra details */}
                  <div className="space-y-2 text-sm mb-8">
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground w-24">Category:</span>
                      <span className="text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground w-24">Unit:</span>
                      <span className="text-muted-foreground">{product.unit || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons — same pattern as Buy.tsx */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={addToCart}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleBuy}
                  >
                    <Plus className="w-4 h-4" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>

            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;