import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MaskTemplateConfig } from "@/lib/maskTemplateTypes";

export type MaskTemplate = {
  id: string;
  name: string;
  description: string | null;
  brand_hint: string | null;
  config: MaskTemplateConfig;
  preview_url: string | null;
  created_at: string;
  updated_at: string;
};

export const useMaskTemplates = () =>
  useQuery({
    queryKey: ["mask-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mask_templates")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as MaskTemplate[];
    },
  });

export const useMaskTemplate = (id?: string) =>
  useQuery({
    queryKey: ["mask-template", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("mask_templates")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as MaskTemplate;
    },
    enabled: !!id,
  });

export const useSaveMaskTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: {
      id?: string;
      name: string;
      description?: string;
      brand_hint?: string;
      config: MaskTemplateConfig;
    }) => {
      if (template.id) {
        const { data, error } = await supabase
          .from("mask_templates")
          .update({
            name: template.name,
            description: template.description ?? null,
            brand_hint: template.brand_hint ?? null,
            config: template.config as unknown as Record<string, unknown>,
            updated_at: new Date().toISOString(),
          })
          .eq("id", template.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("mask_templates")
          .insert({
            name: template.name,
            description: template.description ?? null,
            brand_hint: template.brand_hint ?? null,
            config: template.config as unknown as Record<string, unknown>,
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mask-templates"] });
      queryClient.invalidateQueries({ queryKey: ["mask-template"] });
    },
  });
};

export const useDeleteMaskTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("mask_templates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mask-templates"] });
    },
  });
};
