import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-display font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Explore our collection and find the perfect skin for your device.</p>
            <Link
              to="/devices/phones"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-display font-semibold text-sm"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Shopping Cart ({totalItems})</h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border/50"
                >
                  <div
                    className="w-20 h-20 rounded-lg flex-shrink-0 bg-cover bg-center"
                    style={item.skin.textureImage ? { backgroundImage: `url(${item.skin.textureImage})` } : { backgroundColor: item.skin.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold truncate">{item.skin.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.device.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center hover:bg-surface-hover transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center hover:bg-surface-hover transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-display font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{totalPrice >= 999 ? "Free" : "₹99"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{(totalPrice * 0.18).toFixed(0)}</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 flex justify-between font-display font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(totalPrice + (totalPrice < 999 ? 99 : 0) + totalPrice * 0.18).toFixed(0)}</span>
                  </div>
                </div>
                <Link to="/checkout" className="block w-full bg-primary text-primary-foreground py-3 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity text-center">
                  Proceed to Checkout
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  {totalPrice < 999 && `Add ₹${(999 - totalPrice).toFixed(0)} more for free shipping`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
