import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-card/50 mt-12 sm:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-display text-xl font-bold mb-3 sm:mb-4">
              SKIN<span className="text-gradient">LAB</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Premium device skins crafted with precision. Transform your device with our curated collection.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Shop</h4>
            <div className="flex flex-col gap-2">
              {["Apple", "Samsung", "Google", "OnePlus"].map((item) => (
                <Link key={item} to={`/devices/phones/${item.toLowerCase()}`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Support</h4>
            <div className="flex flex-col gap-2">
              <Link to="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link to="/faq" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQs
              </Link>
              <Link to="/installation-guide" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                Installation Guide
              </Link>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-display font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">Get exclusive offers and new arrivals.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 bg-secondary border border-border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-border/30 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          © 2026 SkinLab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
