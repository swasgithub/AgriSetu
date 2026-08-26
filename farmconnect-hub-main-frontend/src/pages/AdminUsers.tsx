import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Users, Trash2, RefreshCw, Search } from "lucide-react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

const ROLE_LABELS: Record<string, string> = {
  farmer: "Farmer",
  supplier: "Supplier",
  equipment_owner: "Equip. Owner",
  admin: "Admin",
};

const ROLE_COLORS: Record<string, string> = {
  farmer:          "bg-leaf/20 text-leaf border-leaf/30",
  supplier:        "bg-sky/20 text-sky-700 border-sky/30",
  equipment_owner: "bg-earth/20 text-earth border-earth/30",
  admin:           "bg-primary/20 text-primary border-primary/30",
};

const AdminUsers = () => {
  const [authUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/users/`, { headers });
      setUsers(data);
      setFiltered(data);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load users.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let result = users;
    if (roleFilter !== "all") result = result.filter(u => u.role === roleFilter);
    if (search) result = result.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, roleFilter, users]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_URL}/api/users/${id}`, { headers });
      toast({ title: "Deleted", description: `${name} has been removed.` });
      fetchUsers();
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Delete failed.", variant: "destructive" });
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await axios.put(`${API_URL}/api/users/${id}/role`, { role: newRole }, { headers });
      toast({ title: "Role updated", description: `Role changed to ${newRole}.` });
      fetchUsers();
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Update failed.", variant: "destructive" });
    }
  };

  if (!authUser) return <Navigate to="/login" replace />;
  if (authUser.role !== "admin") return <Navigate to="/" replace />;

  const roleTabs = ["all", "farmer", "supplier", "equipment_owner", "admin"];

  return (
    <AdminSidebarLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} total users on the platform</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roleTabs.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {r === "all" ? "All" : ROLE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-bold">
              {filtered.length} {roleFilter === "all" ? "Users" : ROLE_LABELS[roleFilter] + "s"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-center py-16 text-muted-foreground">Loading users...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16 text-muted-foreground text-sm">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Name</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Email</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Phone</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">District</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Role</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-semibold text-foreground">{u.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.phone}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.district}</td>
                      <td className="px-5 py-3">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === authUser.id}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer bg-transparent ${ROLE_COLORS[u.role] ?? ""}`}
                        >
                          {["farmer", "supplier", "equipment_owner", "admin"].map(r => (
                            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        {u._id !== authUser.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 text-xs"
                            onClick={() => handleDelete(u._id, u.name)}
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminSidebarLayout>
  );
};

export default AdminUsers;
