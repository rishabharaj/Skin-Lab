import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkAdminRole = async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    return !!roleData;
  };

  // Check if already logged in as admin
  useEffect(() => {
    let active = true;

    const handleSessionUser = async (userId: string) => {
      const isAdmin = await checkAdminRole(userId);
      if (!active) return;

      if (isAdmin) {
        navigate("/admin");
        return;
      }

      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You don't have admin privileges.", variant: "destructive" });
      setLoading(false);
    };

    // One-time check on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active || !session?.user) return;
      handleSessionUser(session.user.id);
    });

    // Critical for OAuth redirect: auth session may arrive after initial render
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active || !session?.user) return;
      handleSessionUser(session.user.id);
    });

    // Clean trailing hash from OAuth callback URL for a stable route
    if (window.location.hash === "#") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkAdminAndRedirect = async (userId: string) => {
    const isAdmin = await checkAdminRole(userId);

    if (!isAdmin) {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You don't have admin privileges.", variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Welcome back, Admin!" });
    navigate("/admin");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    await checkAdminAndRedirect(data.user.id);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/login`,
      },
    });

    if (error) {
      toast({ title: "Google login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // After redirect, session will be set — useEffect handles the rest
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold">
            SKIN<span className="text-gradient">LAB</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold">Admin Sign In</h2>
              <p className="text-xs text-muted-foreground">Authorized personnel only</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skinlab.com"
                required
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div className="relative flex items-center my-1">
            <div className="flex-1 border-t border-border/50" />
            <span className="px-3 text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border/50" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-secondary border border-border rounded-lg py-2.5 font-display font-semibold text-sm hover:bg-accent transition-colors disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
