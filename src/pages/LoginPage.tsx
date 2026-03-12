import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AUTH_REDIRECT_KEY = "skinlab_auth_redirect";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectFromQuery = searchParams.get("redirect");
  const redirectFromStorage = typeof window !== "undefined" ? window.sessionStorage.getItem(AUTH_REDIRECT_KEY) : null;
  const redirectTo = redirectFromQuery || redirectFromStorage || "/";

  useEffect(() => {
    if (!loading && user) {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(AUTH_REDIRECT_KEY);
      }
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);

  const handleGoogleLogin = async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(AUTH_REDIRECT_KEY, redirectTo);
    }
    const callbackUrl = `${window.location.origin}/login${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
    if (error) {
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4"
        >
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
            <h1 className="text-2xl font-display font-bold mb-2">Sign In</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Sign in to continue to checkout and track your orders
            </p>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-secondary hover:bg-surface-hover border border-border/50 rounded-xl px-6 py-3.5 text-sm font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
