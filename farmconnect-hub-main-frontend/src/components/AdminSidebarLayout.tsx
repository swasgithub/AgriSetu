import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  Users,
  ShoppingBag,
  ShoppingCart,
  Tractor,
  Bot,
  BarChart2,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Overview",        path: "/dashboard/admin",            icon: LayoutDashboard },
  { label: "Users",           path: "/dashboard/admin/users",      icon: Users },
  { label: "Products",        path: "/dashboard/admin/products",   icon: ShoppingBag },
  { label: "Orders",          path: "/dashboard/admin/orders",     icon: ShoppingCart },
  { label: "Rentals",         path: "/dashboard/admin/rentals",    icon: Tractor },
  { label: "AI Agents",       path: "/dashboard/admin/agents",     icon: Bot },
  { label: "Analytics",       path: "/dashboard/admin/analytics",  icon: BarChart2 },
];

const AdminSidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex flex-col
          bg-primary text-primary-foreground
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto md:h-auto md:self-stretch
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-primary-foreground/20">
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight text-primary-foreground">AgriSetu</p>
            <p className="text-[10px] text-primary-foreground/60 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
                ${isActive(item.path)
                  ? "bg-primary-foreground/20 text-primary-foreground font-semibold"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }
              `}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="text-sm">{item.label}</span>
              {isActive(item.path) && (
                <ChevronRight className="w-3 h-3 ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        {/* Admin profile + logout */}
        <div className="px-3 py-4 border-t border-primary-foreground/20 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-foreground/10">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary-foreground truncate">{user?.name || "Admin"}</p>
              <Badge className="text-[9px] px-1.5 py-0 bg-accent text-accent-foreground h-4 mt-0.5">Admin</Badge>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 h-14 shrink-0">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex relative w-72">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
            <input aria-label="Search" placeholder="Search" className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          {/* Right: user pill */}
          <div className="flex items-center gap-2 ml-auto">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium hidden sm:inline">{user?.name || "Admin"}</span>
              <Badge className="text-[9px] px-1.5 h-4 bg-primary text-primary-foreground">Admin</Badge>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminSidebarLayout;
