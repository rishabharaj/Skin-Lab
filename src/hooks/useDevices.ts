import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbBrand = {
  id: string;
  slug: string;
  name: string;
};

export type DbModel = {
  id: string;
  slug: string;
  brand_id: string;
  name: string;
  image_url: string | null;
  mockup_url: string | null;
};

export const useDeviceBrands = () =>
  useQuery({
    queryKey: ["device-brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("device_brands").select("*").order("name");
      if (error) throw error;
      return data as DbBrand[];
    },
  });

export const useDeviceModels = (brandSlug?: string) =>
  useQuery({
    queryKey: ["device-models", brandSlug],
    queryFn: async () => {
      if (!brandSlug) {
        const { data, error } = await supabase
          .from("device_models")
          .select("*, device_brands!inner(slug)")
          .order("name");
        if (error) throw error;
        return data as (DbModel & { device_brands: { slug: string } })[];
      }
      // Get brand id first
      const { data: brand } = await supabase
        .from("device_brands")
        .select("id")
        .eq("slug", brandSlug)
        .single();
      if (!brand) return [];
      const { data, error } = await supabase
        .from("device_models")
        .select("*")
        .eq("brand_id", brand.id)
        .order("name");
      if (error) throw error;
      return data as DbModel[];
    },
  });

export const useDeviceBrand = (slug?: string) =>
  useQuery({
    queryKey: ["device-brand", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("device_brands")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as DbBrand;
    },
    enabled: !!slug,
  });

export const useDeviceModel = (slug?: string) =>
  useQuery({
    queryKey: ["device-model", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("device_models")
        .select("*, device_brands(*)")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as DbModel & { device_brands: DbBrand };
    },
    enabled: !!slug,
  });

export const useAllDeviceModels = () =>
  useQuery({
    queryKey: ["all-device-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_models")
        .select("*, device_brands(*)")
        .order("name");
      if (error) throw error;
      return data as (DbModel & { device_brands: DbBrand })[];
    },
  });
