import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Index from "./pages/Index";
import DeviceCategoryPage from "./pages/DeviceCategoryPage";
import DeviceBrandPage from "./pages/DeviceBrandPage";
import DeviceSkinsPage from "./pages/DeviceSkinsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CollectionsPage from "./pages/CollectionsPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import InstallationGuidePage from "./pages/InstallationGuidePage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminDevices from "./pages/admin/AdminDevices";
import AdminSkins from "./pages/admin/AdminSkins";
import AdminHomeSkins from "./pages/admin/AdminHomeSkins";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMasks from "./pages/admin/AdminMasks";
import AdminReels from "./pages/admin/AdminReels";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminInventory from "./pages/admin/AdminInventory";
import NotFound from "./pages/NotFound";
import { isSupabaseConfigured } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        {!isSupabaseConfigured && (
          <div className="fixed top-0 left-0 right-0 z-[200] bg-destructive text-destructive-foreground text-xs sm:text-sm px-3 py-2 text-center">
            Missing deployment env vars: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel.
          </div>
        )}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/devices/:category" element={<DeviceCategoryPage />} />
            <Route path="/devices/:category/:brandId" element={<DeviceBrandPage />} />
            <Route path="/devices/:category/:brandId/:modelId" element={<DeviceSkinsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign" element={<Navigate to="/login" replace />} />
            <Route path="/signin" element={<Navigate to="/login" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/installation-guide" element={<InstallationGuidePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminAnalytics />} />
              <Route path="devices" element={<AdminDevices />} />
              <Route path="skins" element={<AdminSkins />} />
              <Route path="home-skins" element={<AdminHomeSkins />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="masks" element={<AdminMasks />} />
              <Route path="reels" element={<AdminReels />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
