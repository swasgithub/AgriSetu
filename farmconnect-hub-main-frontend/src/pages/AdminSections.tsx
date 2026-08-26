import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BarChart3, Bot, Package, ShoppingCart, Tractor } from "lucide-react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/config/api";

const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const statusStyle: Record<string, string> = { pending: "bg-wheat-light text-soil", approved: "bg-sky-light text-sky-700", completed: "bg-leaf-light text-leaf", delivered: "bg-leaf-light text-leaf", cancelled: "bg-red-100 text-red-700" };

function AdminPage({ title, icon: Icon, children }: { title: string; icon: typeof Package; children: React.ReactNode }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <AdminSidebarLayout><div className="mb-6 flex items-center gap-3"><div className="rounded-lg bg-leaf-light p-2 text-leaf"><Icon className="h-5 w-5" /></div><div><h1 className="text-2xl font-bold">{title}</h1><p className="text-sm text-muted-foreground">Platform administration</p></div></div>{children}</AdminSidebarLayout>;
}

function Notice({ text }: { text: string }) { return <p className="py-12 text-center text-sm text-muted-foreground">{text}</p>; }

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get(`${API_URL}/api/products/all`, { headers: headers() }).then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);
  return <AdminPage title="Product Listings" icon={Package}><Card className="shadow-sm"><CardContent className="p-0">{loading ? <Notice text="Loading products..." /> : !products.length ? <Notice text="No products found." /> : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead className="border-b bg-muted/30 text-left text-xs text-muted-foreground"><tr><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Supplier</th><th className="p-4">District</th></tr></thead><tbody>{products.map(p => <tr key={p._id} className="border-b last:border-0"><td className="p-4 font-semibold">{p.name}</td><td className="p-4"><Badge variant="outline">{p.category || "—"}</Badge></td><td className="p-4">₹{p.price?.toLocaleString()}</td><td className="p-4">{p.supplier?.name || "Unknown"}</td><td className="p-4">{p.supplier?.district || "—"}</td></tr>)}</tbody></table></div>}</CardContent></Card></AdminPage>;
}

export function AdminRentals() {
  const [rentals, setRentals] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get(`${API_URL}/api/rentals/all`, { headers: headers() }).then(r => setRentals(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);
  return <AdminPage title="Machine Rentals" icon={Tractor}><Card className="shadow-sm"><CardContent className="p-0">{loading ? <Notice text="Loading rentals..." /> : !rentals.length ? <Notice text="No rental requests found." /> : <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead className="border-b bg-muted/30 text-left text-xs text-muted-foreground"><tr><th className="p-4">Machine</th><th className="p-4">Farmer</th><th className="p-4">Owner</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead><tbody>{rentals.map(r => <tr key={r._id} className="border-b last:border-0"><td className="p-4 font-semibold">{r.machine?.name || "Unknown"}</td><td className="p-4">{r.user?.name || "Unknown"}</td><td className="p-4">{r.owner?.name || "Unknown"}</td><td className="p-4">₹{r.totalAmount?.toLocaleString() || 0}</td><td className="p-4"><Badge className={`capitalize ${statusStyle[r.status] || "bg-muted text-muted-foreground"}`}>{r.status}</Badge></td></tr>)}</tbody></table></div>}</CardContent></Card></AdminPage>;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get(`${API_URL}/api/orders/all`, { headers: headers() }).then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);
  return <AdminPage title="Orders" icon={ShoppingCart}><Card className="shadow-sm"><CardContent className="p-0">{loading ? <Notice text="Loading orders..." /> : !orders.length ? <Notice text="No orders found." /> : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead className="border-b bg-muted/30 text-left text-xs text-muted-foreground"><tr><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead><tbody>{orders.map(o => <tr key={o._id} className="border-b last:border-0"><td className="p-4 font-semibold">#{o._id.slice(-7).toUpperCase()}</td><td className="p-4">{o.user?.name || "Unknown"}</td><td className="p-4">{o.items?.length || 0}</td><td className="p-4">₹{o.totalAmount?.toLocaleString() || 0}</td><td className="p-4"><Badge className={`capitalize ${statusStyle[o.status] || "bg-muted text-muted-foreground"}`}>{o.status}</Badge></td></tr>)}</tbody></table></div>}</CardContent></Card></AdminPage>;
}

export function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { axios.get(`${API_URL}/api/analytics/summary`, { headers: headers() }).then(r => setData(r.data)).catch(console.error); }, []);
  const metrics = [["Total users", data?.users?.total], ["Total products", data?.products?.total], ["Total machines", data?.machines?.total], ["Orders", data?.orders?.total], ["Rentals", data?.rentals?.total], ["Revenue", data ? `₹${data.totalRevenue?.toLocaleString()}` : undefined]];
  return <AdminPage title="Analytics" icon={BarChart3}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(([label, value]) => <Card key={label as string} className="shadow-sm"><CardContent className="p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value ?? "—"}</p></CardContent></Card>)}</div></AdminPage>;
}

export function AdminAgents() {
  const [agents, setAgents] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get(`${API_URL}/api/agents`).then(r => setAgents(r.data.filter((a: any) => a.type === "soil"))).catch(console.error).finally(() => setLoading(false)); }, []);
  const setVisibility = async (agent: any, isVisible: boolean) => { const { data } = await axios.put(`${API_URL}/api/agents/${agent._id}`, { isVisible }, { headers: headers() }); setAgents(current => current.map(a => a._id === data._id ? data : a)); };
  return <AdminPage title="AI Agents" icon={Bot}><Card className="max-w-xl shadow-sm"><CardHeader><CardTitle className="text-base">Soil Health Agent</CardTitle></CardHeader><CardContent>{loading ? <Notice text="Loading agent..." /> : agents.map(agent => <div key={agent._id} className="flex items-center justify-between rounded-lg border bg-leaf-light/40 p-4"><div><p className="font-semibold">{agent.name}</p><p className="text-sm text-muted-foreground">{agent.description}</p></div><label className="flex items-center gap-2 text-sm font-medium">Visible <input type="checkbox" className="h-4 w-4 accent-primary" checked={agent.isVisible} onChange={e => setVisibility(agent, e.target.checked)} /></label></div>)}{!loading && !agents.length && <Notice text="No Soil agent has been configured." />}</CardContent></Card></AdminPage>;
}
