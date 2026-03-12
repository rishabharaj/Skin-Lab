import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, User, LogOut, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
        <Link to="/" className="font-display text-lg sm:text-xl font-bold tracking-tight">
          SKIN<span className="text-gradient">LAB</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/devices/phones" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            All Phones
          </Link>
          <Link to="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Collections
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Support
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search size={18} className="sm:w-5 sm:h-5" />
          </button>
          <Link to="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} className="text-muted-foreground" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User size={14} /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                    <Package size={14} /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut size={14} /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Sign In
            </Link>
          )}

          <button className="md:hidden text-muted-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/30"
          >
            <div className="flex flex-col p-4 gap-4">
              {[
                { to: "/devices/phones", label: "All Phones" },
                { to: "/collections", label: "Collections" },
                { to: "/contact", label: "Support" },
                { to: "/faq", label: "FAQs" },
                ...(user
                  ? [{ to: "/orders", label: "My Orders" }]
                  : [{ to: "/login", label: "Sign In" }]),
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="text-sm text-destructive hover:text-destructive/80 transition-colors py-1 text-left"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
