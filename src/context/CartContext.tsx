import React, { createContext, useContext, useState, useCallback } from "react";
import type { CartItem, DeviceModel, SkinDesign } from "@/data/mockData";
import { coveragePricing } from "@/data/mockData";

const CART_STORAGE_KEY = "skinlab_cart_v1";

const persistCart = (nextItems: CartItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
};

interface CartContextType {
  items: CartItem[];
  addItem: (device: DeviceModel, skin: SkinDesign, coverage: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const addItem = useCallback((device: DeviceModel, skin: SkinDesign, coverage: string) => {
    const id = `${device.id}-${skin.id}-${coverage}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        const next = prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        persistCart(next);
        return next;
      }
      const price = skin.price + (coveragePricing[coverage] || 0);
      const next = [...prev, { id, device, skin, coverage, quantity: 1, price }];
      persistCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
      persistCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
