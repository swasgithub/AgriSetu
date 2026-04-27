import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Star, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_URL } from "@/config/api";
const Buy = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ["All", "Seeds", "Fertilizer", "Pesticide", "Tools"];

  // ✅ Fetch products + load cart
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        setProducts(data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();

    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ADD TO CART
  const addToCart = (product) => {
    let cartData = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cartData.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cartData.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    setCart([...cartData]); // refresh UI

    toast({
      title: "Added to Cart",
      description: `${product.name} added successfully`,
    });
  };

  // BUY FUNCTION 
  const handleBuy = (product) => {
    navigate("/checkout", { 
      state: { 
        items: [{ 
          product: product._id, 
          name: product.name, 
          price: product.price, 
          quantity: 1,
          image: product.image 
        }],
        totalAmount: product.price 
      } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-leaf-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Buy Agricultural Products
            </h1>
            <p className="text-muted-foreground text-lg">
              Quality seeds, fertilizers, pesticides, and tools for your farm
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Cart Button */}
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="w-4 h-4" />
              Cart ({cart.length})
            </Button>

          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary">
                    {product.category}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-wheat text-wheat" />
                    <span className="text-sm font-medium">
                      {product.rating || "4.5"}
                    </span>
                  </div>

                  {/* Price + Buttons */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /unit
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {/* ADD */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(product)}
                      >
                        Add
                      </Button>

                      {/* BUY */}
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => handleBuy(product)}
                      >
                        <Plus className="w-4 h-4" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Products */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found matching your criteria.
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Buy;