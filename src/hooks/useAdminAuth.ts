import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async (userId: string) => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      
      if (cancelled) return;
      console.log("[AdminAuth] Role check:", { userId, data, error });
      setIsAdmin(!!data);
      setLoading(false);
    };

    // Use onAuthStateChange as the single source of truth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        checkAdmin(u.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // Fallback: if onAuthStateChange hasn't fired after 2s, check manually
    const timeout = setTimeout(async () => {
      if (cancelled) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      const u = session?.user ?? null;
      if (!u) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
};
