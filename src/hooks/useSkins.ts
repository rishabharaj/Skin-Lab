import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SkinDesign } from "@/data/mockData";

export type SkinCollection = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type AdminSkin = SkinDesign & {
  show_on_homepage: boolean;
  homepage_sort_order: number;
};

const coverageOptions = ["Back Only", "Full Body", "Camera Skin"];

type DbSkin = {
  id: string;
  name: string;
  category: string;
  texture_image: string | null;
  color: string | null;
  price: number;
  original_price: number | null;
  badge: string | null;
  offer_tag: string | null;
  show_on_homepage: boolean;
  homepage_sort_order: number;
  is_new: boolean;
  is_trending: boolean;
  is_active: boolean;
};

const resolveBadge = (skin: DbSkin): SkinDesign["badge"] | undefined => {
  if (skin.badge === "new" || skin.badge === "trending" || skin.badge === "bestseller") {
    return skin.badge;
  }
  if (skin.is_new) return "new";
  if (skin.is_trending) return "trending";
  return undefined;
};

const mapDbSkinToDesign = (skin: DbSkin): SkinDesign => ({
  id: skin.id,
  name: skin.name,
  collection: skin.category,
  textureImage: skin.texture_image || "",
  color: skin.color || "#1a1a1a",
  price: skin.price,
  originalPrice: skin.original_price ?? undefined,
  badge: resolveBadge(skin),
  offer: skin.offer_tag ?? undefined,
  coverageOptions,
});

const mapDbSkinToAdminSkin = (skin: DbSkin): AdminSkin => ({
  ...mapDbSkinToDesign(skin),
  show_on_homepage: skin.show_on_homepage,
  homepage_sort_order: skin.homepage_sort_order,
});

export const useActiveSkins = () =>
  useQuery({
    queryKey: ["skins", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skins")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DbSkin[]).map(mapDbSkinToDesign);
    },
  });

export const useAllSkins = () =>
  useQuery({
    queryKey: ["skins", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skins")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DbSkin[]).map(mapDbSkinToDesign);
    },
  });

export const useAllAdminSkins = () =>
  useQuery({
    queryKey: ["skins", "all-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skins")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DbSkin[]).map(mapDbSkinToAdminSkin);
    },
  });

export const useHomepageSkins = () =>
  useQuery({
    queryKey: ["skins", "homepage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skins")
        .select("*")
        .eq("is_active", true)
        .eq("show_on_homepage", true)
        .order("homepage_sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DbSkin[]).map(mapDbSkinToDesign);
    },
  });

export const useSkinCollections = () =>
  useQuery({
    queryKey: ["skin-collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skin_collections")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name");

      if (error) throw error;
      return data as SkinCollection[];
    },
  });