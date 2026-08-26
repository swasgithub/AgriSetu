import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Bot, Ellipsis, Leaf, Package, ShoppingCart, Sprout, TrendingUp, Users } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/config/api";

const roleColors = ["hsl(142 45% 35%)", "hsl(200 75% 50%)", "hsl(43 75% 50%)"];

export default function AdminDashboard() {
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [summary, setSummary] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [soilAgent, setSoilAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    Promise.allSettled([
      axios.get(`${API_URL}/api/analytics/summary`, { headers }), axios.get(`${API_URL}/api/orders/all`, { headers }),
      axios.get(`${API_URL}/api/users/`, { headers }), axios.get(`${API_URL}/api/products/all`, { headers }), axios.get(`${API_URL}/api/agents`),
    ]).then(([summaryResult, ordersResult, usersResult, productsResult, agentsResult]) => {
      if (summaryResult.status === "fulfilled") setSummary(summaryResult.value.data);
      if (ordersResult.status === "fulfilled") setOrders(ordersResult.value.data.slice(0, 3));
      if (usersResult.status === "fulfilled") setUsers(usersResult.value.data.slice(0, 3));
      if (productsResult.status === "fulfilled") setProducts(productsResult.value.data.slice(0, 3));
      if (agentsResult.status === "fulfilled") setSoilAgent(agentsResult.value.data.find((agent: any) => /soil/i.test(agent.name)) ?? null);

      const failed = [summaryResult, ordersResult, usersResult, productsResult, agentsResult].filter(result => result.status === "rejected");
      if (failed.length) {
        console.error("Admin dashboard requests failed:", failed);
        setLoadError("Some dashboard data could not be loaded. Please refresh and check the browser console for the failed request.");
      }
    }).finally(() => setLoading(false));
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  const roles = [{ name: "Farmers", value: summary?.users?.farmers ?? 0 }, { name: "Suppliers", value: summary?.users?.suppliers ?? 0 }, { name: "Equipment Owners", value: summary?.users?.owners ?? 0 }];
  const roleTotal = roles.reduce((n, r) => n + r.value, 0);
  const cards = [
    ["Total Users", summary?.users?.total ?? 0, Users, "bg-leaf-light text-leaf border-leaf/20"],
    ["Total Orders", summary?.orders?.total ?? 0, ShoppingCart, "bg-sky-light text-sky border-sky/20"],
    ["Platform Revenue", `₹${(summary?.totalRevenue ?? 0).toLocaleString()}`, TrendingUp, "bg-wheat-light text-earth border-wheat/30"],
    ["Active AI Agents", soilAgent?.isVisible === false ? 0 : 1, Bot, "bg-primary/10 text-primary border-primary/20"],
  ] as const;
  const statusClass: Record<string, string> = { pending: "bg-wheat-light text-soil", shipped: "bg-sky-light text-sky-700", delivered: "bg-leaf-light text-leaf", cancelled: "bg-red-100 text-red-700" };
  const updateSoil = async (isVisible: boolean) => {
    if (!soilAgent?._id) return;
    try { const { data } = await axios.put(`${API_URL}/api/agents/${soilAgent._id}`, { isVisible }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); setSoilAgent(data); } catch (error) { console.error(error); }
  };

  return <AdminSidebarLayout>
    <div className="mb-5"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-sm text-muted-foreground">Platform Overview</p></div>
    {loading ? <div className="grid h-72 place-items-center"><Leaf className="h-8 w-8 animate-pulse text-primary" /></div> : <>
      {loadError && <p className="mb-4 rounded-lg border border-wheat/40 bg-wheat-light px-3 py-2 text-sm text-soil">{loadError}</p>}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([title, value, Icon, colour]) => <Card key={title} className={`border shadow-sm ${colour}`}><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs font-semibold text-foreground/75">{title}</p><p className="mt-1 text-2xl font-bold text-foreground">{value}</p></div><div className="rounded-lg bg-card/60 p-3"><Icon className="h-6 w-6" /></div></CardContent></Card>)}</div>
      <div className="mb-5 grid gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-3 shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-3"><CardTitle className="text-base">Recent Orders</CardTitle><Ellipsis className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent className="overflow-x-auto pt-0">{orders.length ? <table className="w-full min-w-[500px] text-sm"><thead className="border-b text-left text-xs text-muted-foreground"><tr><th className="pb-2 font-medium">Order ID</th><th className="pb-2 font-medium">Farmer Name</th><th className="pb-2 font-medium">Amount</th><th className="pb-2 font-medium">Status</th></tr></thead><tbody>{orders.map(order => <tr key={order._id} className="border-b last:border-0"><td className="py-3 font-medium">#{order._id.slice(-7).toUpperCase()}</td><td className="py-3">{order.user?.name ?? "Unknown"}</td><td className="py-3 font-semibold">₹{order.totalAmount?.toLocaleString() ?? 0}</td><td className="py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusClass[order.status] ?? "bg-muted"}`}>{order.status}</span></td></tr>)}</tbody></table> : <Empty message="No orders yet." />}</CardContent></Card>
        <Card className="xl:col-span-2 shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-1"><CardTitle className="text-base">User Role Distribution</CardTitle><Ellipsis className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent className="flex items-center gap-3 pt-1"><ResponsiveContainer width="48%" height={150}><PieChart><Pie data={roles} dataKey="value" innerRadius={40} outerRadius={64} paddingAngle={2}>{roles.map((_, i) => <Cell key={i} fill={roleColors[i]} />)}</Pie></PieChart></ResponsiveContainer><div className="space-y-2 text-xs">{roles.map((role, i) => <div key={role.name} className="flex items-center justify-between gap-3"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: roleColors[i] }} />{role.name}</span><strong>{roleTotal ? Math.round(role.value / roleTotal * 100) : 0}%</strong></div>)}</div></CardContent></Card>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-base">User Management</CardTitle><Link to="/dashboard/admin/users" className="text-xs font-semibold text-primary hover:underline">View All</Link></CardHeader><CardContent className="space-y-3">{users.length ? users.map(u => <div className="flex items-center gap-3" key={u._id}><div className="grid h-9 w-9 place-items-center rounded-full bg-leaf-light text-leaf"><Users className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{u.name}</p><p className="text-xs text-muted-foreground capitalize">{u.role?.replace("_", " ")}</p></div><Badge variant="outline" className="text-[10px] capitalize">{u.role?.replace("_", " ")}</Badge></div>) : <Empty message="No users yet." />}</CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-base">Product Listings</CardTitle><Ellipsis className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent className="space-y-3">{products.length ? products.map(product => <div className="flex items-center gap-3" key={product._id}><div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-wheat-light">{product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-earth" />}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{product.name}</p><Badge className="mt-1 h-4 bg-wheat-light px-1 text-[9px] text-soil">{product.category || "Product"}</Badge></div></div>) : <Empty message="No product listings yet." />}</CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-base">AI Agent Control</CardTitle><Ellipsis className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="rounded-lg border border-border bg-leaf-light/40 p-3"><div className="flex items-start justify-between"><div className="flex gap-2"><div className="rounded-md bg-card p-2 text-leaf"><Sprout className="h-5 w-5" /></div><div><p className="text-sm font-bold">Soil</p><p className="text-xs text-muted-foreground">Soil health advisor</p></div></div><i className={`mt-1 h-2.5 w-2.5 rounded-full ${soilAgent?.isVisible === false ? "bg-muted-foreground" : "bg-leaf"}`} /></div><label className="mt-4 flex cursor-pointer items-center justify-between text-xs font-medium">Status <input type="checkbox" className="h-4 w-7 accent-primary" checked={soilAgent?.isVisible ?? true} onChange={e => updateSoil(e.target.checked)} /></label></div></CardContent></Card>
      </div>
    </>}
  </AdminSidebarLayout>;
}

function Empty({ message }: { message: string }) { return <p className="py-8 text-center text-sm text-muted-foreground">{message}</p>; }
