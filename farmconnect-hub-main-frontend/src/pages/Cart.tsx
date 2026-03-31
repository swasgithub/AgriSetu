import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, ShoppingCart } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    // ❌ Remove item
    const removeItem = (id) => {
        const updated = cart.filter((item) => item._id !== id);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    // 💰 Total
    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // ✅ Checkout
    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem("token");

            const orderData = {
                items: cart.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount,
            };

            await axios.post("/api/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Order placed successfully!");
            localStorage.removeItem("cart");
            setCart([]);
        } catch (error) {
            console.log(error);
            alert("Checkout failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero */}
            <section className="bg-leaf-light py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Your Cart
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Review your selected products and proceed to checkout
                        </p>
                    </div>
                </div>
            </section>

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">

                    {/* Empty Cart */}
                    {cart.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingCart className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-lg">
                                Your cart is empty
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {cart.map((item) => (
                                    <Card
                                        key={item._id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {/* Image */}
                                        <div className="aspect-video bg-muted">
                                            <img
                                                src={
                                                    item.image ||
                                                    "https://via.placeholder.com/300x200?text=No+Image"
                                                }
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-foreground">
                                                    {item.name}
                                                </h3>
                                                <Badge variant="outline">
                                                    Qty: {item.quantity}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-3">
                                                ₹{item.price} / unit
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-primary">
                                                    ₹{item.price * item.quantity}
                                                </span>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeItem(item._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Total + Checkout */}
                            <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-6">
                                <h2 className="text-2xl font-bold">
                                    Total: ₹{totalAmount}
                                </h2>

                                <Button className="gap-2" onClick={handleCheckout}>
                                    <ShoppingCart className="w-4 h-4" />
                                    Checkout
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Cart;