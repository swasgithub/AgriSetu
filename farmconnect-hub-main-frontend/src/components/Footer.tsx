import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">AgriSetu</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Empowering farmers with smart technology for better yields and sustainable agriculture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/buy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Buy Products</Link></li>
              <li><Link to="/rent" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Rent Machinery</Link></li>
              <li><Link to="/consult" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">AI Consultancy</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2 text-primary-foreground/80">
            <li><Link to="/consult">Soil Analysis</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>support@agrisetu.in</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span>West Bengal, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>© 2026 AgriSetu. All rights reserved. | Smart India Hackathon 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
