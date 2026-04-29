import { useState } from "react";
import { Link, useLocation , useNavigate } from "react-router-dom";
import { Menu, X, Sprout, ShoppingCart, Tractor, Bot, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

    const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


  const navLinks = [
    { path: "/", label: "Home", icon: Sprout },
    { path: "/buy", label: "Buy Products", icon: ShoppingCart },
    { path: "/rent", label: "Rent Machinery", icon: Tractor },
    { path: "/consult", label: "AI Consult", icon: Bot },
  ];

 const getDashboardPath = () => {
    if (!user) return null;

    switch (user.role) {
      case "farmer":
        return "/dashboard/farmer";
      case "supplier":
        return "/dashboard/supplier";
      case "equipment_owner":
        return "/dashboard/owner";
      default:
        return null;
    }
  };

    const dashboardPath = getDashboardPath();

  // add dashboard for all roles
  if (dashboardPath) {
    navLinks.push({
      path: dashboardPath,
      label: "Dashboard",
      icon: LayoutDashboard,
    });
  }
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">AgriSetu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                  }`}
              >
                <link.icon className="w-4 h-4" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>


          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                    }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              {user ? (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                  {user.role === "farmer" && (
                    <Link to="/dashboard/farmer" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
