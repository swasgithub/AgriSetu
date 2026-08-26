import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const DashboardLayout = ({ title, description, user, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      
      <section className="bg-gradient-to-br from-leaf-light via-background to-wheat-light py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary text-primary-foreground">
                {title}
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Welcome, {user?.name || "User"}
              </h1>

              <p className="text-muted-foreground text-lg">
                {description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 space-y-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;