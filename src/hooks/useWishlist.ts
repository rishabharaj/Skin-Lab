import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setWishlistIds(new Set());
      return;
    }
    const fetchWishlist = async () => {
      const { data } = await supabase
        .from("wishlists")
        .select("skin_id")
        .eq("user_id", user.id);
      if (data) {
        setWishlistIds(new Set(data.map((w) => w.skin_id)));
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = useCallback(
    async (skinId: string) => {
      if (!user) {
        toast.error("Please login to add to wishlist");
        return;
      }
      setLoading(true);
      const isWishlisted = wishlistIds.has(skinId);

      if (isWishlisted) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("skin_id", skinId);
        if (!error) {
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(skinId);
            return next;
          });
          toast.success("Removed from wishlist");
        }
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({ user_id: user.id, skin_id: skinId });
        if (!error) {
          setWishlistIds((prev) => new Set(prev).add(skinId));
          toast.success("Added to wishlist ❤️");
        }
      }
      setLoading(false);
    },
    [user, wishlistIds]
  );

  const isWishlisted = useCallback(
    (skinId: string) => wishlistIds.has(skinId),
    [wishlistIds]
  );

  return { wishlistIds, toggleWishlist, isWishlisted, loading };
};
