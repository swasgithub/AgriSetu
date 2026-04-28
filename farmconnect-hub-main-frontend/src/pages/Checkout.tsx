import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { CreditCard, Truck, Wallet, CheckCircle2, ChevronLeft, Icon } from "lucide-react";
import { Leaf, Cloud, Bug, Droplets, TrendingUp, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { API_URL } from "@/config/api";
const iconMap = {
    soil: Leaf,
    weather: Cloud,
    disease: Bug,
    irrigation: Droplets,
    market: TrendingUp,
    pest: Shield,
};

const colorMap: Record<string, string> = {
  earth: "bg-earth text-primary-foreground",
  leaf: "bg-leaf text-primary-foreground",
  sky: "bg-sky text-primary-foreground",
  wheat: "bg-wheat text-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};


const Checkout = () => {
    
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const state = location.state || {};

    const isAgent = state.agentType;

const Icon = isAgent ? iconMap[state.agentType] || Leaf : null;
    const items = isAgent
        ? [
            {
                name: state.agentName,
                price: state.price,
                quantity: 1,
                image: "https://via.placeholder.com/80",
            },
        ]
        : state.items || [];

    const totalAmount = isAgent
        ? Number(state.price || 0)
        : Number(state.totalAmount || 0);

 const colorKey = colorMap[state.agentType] || "leaf";
const colorClass = colorMap[colorKey];

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center p-8">
                        <CardTitle className="text-2xl mb-4">Your cart is empty</CardTitle>
                        <Button onClick={() => navigate("/buy")}>Return to Shop</Button>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        try {
            const token = localStorage.getItem("token");

            if (isAgent) {
                //  Agent Purchase API
                await axios.post(
                    `${API_URL}/api/agent-purchases`,
                    {
                        agentType: state.agentType,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            } else {
                // Normal Product Order
                const orderData = {
                    items: items.map((item) => ({
                        product: item.product,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    totalAmount,
                    paymentMethod,
                };

                await axios.post(`${API_URL}/api/orders`, orderData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            toast({
                title: "Success!",
                description: isAgent
                    ? "Agent purchased successfully"
                    : "Order placed successfully",
            });

            navigate("/order-success", {
                state: {
                    totalAmount,
                },
            });

        } catch (error) {
            console.error("FULL ERROR:", error.response?.data || error.message);

            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive",
            });
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Summary & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                
                                {items.map((item, idx) => (
                                    <div key={idx} className="py-4 flex gap-4">
                                        {isAgent ? (
                                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${colorClass}`}>
                                                <Icon className="w-8 h-8 " />
                                                
                                            </div>
                                        ) : (
                                        <div className="w-20 h-20 rounded-md bg-muted overflow-hidden shrink-0">
                                            <img
                                                src={item.image || "https://via.placeholder.com/80"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-foreground">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="font-semibold text-primary mt-1">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div
                                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-transparent bg-card"}`}
                                    onClick={() => setPaymentMethod("cod")}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Cash on Delivery</p>
                                            <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                                        </div>
                                    </div>
                                    {paymentMethod === "cod" && <CheckCircle2 className="w-6 h-6 text-primary" />}
                                </div>

                                <div
                                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-transparent bg-card"}`}
                                    onClick={() => setPaymentMethod("upi")}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                            <Wallet className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">UPI (PhonePe / Google Pay)</p>
                                            <p className="text-sm text-muted-foreground">Instant payment via UPI app</p>
                                        </div>
                                    </div>
                                    {paymentMethod === "upi" && <CheckCircle2 className="w-6 h-6 text-primary" />}
                                </div>

                                <div
                                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-transparent bg-card"}`}
                                    onClick={() => setPaymentMethod("card")}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Debit / Credit Card</p>
                                            <p className="text-sm text-muted-foreground">Secure payment via gateway</p>
                                        </div>
                                    </div>
                                    {paymentMethod === "card" && <CheckCircle2 className="w-6 h-6 text-primary" />}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Totals */}
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-medium text-sm">FREE</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                    <span>Total Payable</span>
                                    <span className="text-primary">₹{totalAmount}</span>
                                </div>

                                <Button
                                    className="w-full mt-6 h-12 text-lg font-bold"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Processing..." : "Place Order"}
                                </Button>

                                <p className="text-center text-xs text-muted-foreground mt-4">
                                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
