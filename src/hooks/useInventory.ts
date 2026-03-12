import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface InventoryItem {
  id: string;
  skin_id: string;
  device_id: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
  device_models?: {
    name: string;
  };
}

export const useInventory = () => {
  const queryClient = useQueryClient();

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skin_inventory")
        .select(`
          *,
          device_models (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  const addInventory = useMutation({
    mutationFn: async (item: {
      skin_id: string;
      device_id: string | null;
      stock_quantity: number;
      low_stock_threshold: number;
    }) => {
      const { error } = await supabase.from("skin_inventory").insert(item);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Inventory item added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateInventory = useMutation({
    mutationFn: async ({
      id,
      stock_quantity,
      low_stock_threshold,
    }: {
      id: string;
      stock_quantity: number;
      low_stock_threshold: number;
    }) => {
      const { error } = await supabase
        .from("skin_inventory")
        .update({ stock_quantity, low_stock_threshold })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteInventory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skin_inventory").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Inventory item deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    inventory,
    isLoading,
    addInventory,
    updateInventory,
    deleteInventory,
  };
};

export const useStockCheck = (skinId: string, deviceId: string | null) => {
  return useQuery({
    queryKey: ["stock", skinId, deviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skin_inventory")
        .select("stock_quantity")
        .eq("skin_id", skinId)
        .eq("device_id", deviceId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!skinId && !!deviceId,
  });
};
