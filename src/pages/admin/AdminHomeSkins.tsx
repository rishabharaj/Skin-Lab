import { useMemo } from "react";
import { Star, GripVertical, Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAllAdminSkins } from "@/hooks/useSkins";

const AdminHomeSkins = () => {
  const queryClient = useQueryClient();
  const { data: skins = [], isLoading } = useAllAdminSkins();

  const homepageSkins = useMemo(
    () => skins.filter((skin: any) => skin.show_on_homepage).sort((a: any, b: any) => (a.homepage_sort_order ?? 0) - (b.homepage_sort_order ?? 0)),
    [skins]
  );

  const updateSkin = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const { error } = await supabase.from("skins").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skins"] });
      toast.success("Homepage skins updated");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update homepage skin");
    },
  });

  const toggleHomepage = (skin: any) => {
    const nextOrder = homepageSkins.length + 1;
    updateSkin.mutate({
      id: skin.id,
      data: {
        show_on_homepage: !skin.show_on_homepage,
        homepage_sort_order: skin.show_on_homepage ? 0 : nextOrder,
      },
    });
  };

  const moveSkin = (skin: any, direction: -1 | 1) => {
    const currentIndex = homepageSkins.findIndex((item: any) => item.id === skin.id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= homepageSkins.length) return;

    const current = homepageSkins[currentIndex];
    const target = homepageSkins[targetIndex];

    updateSkin.mutate({
      id: current.id,
      data: { homepage_sort_order: target.homepage_sort_order ?? targetIndex + 1 },
    });
    updateSkin.mutate({
      id: target.id,
      data: { homepage_sort_order: current.homepage_sort_order ?? currentIndex + 1 },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Home Page Skins</h1>
        <p className="text-sm text-muted-foreground">Choose which skins appear in the horizontal moving homepage carousel.</p>
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-muted-foreground">
        Mark skins for homepage and arrange their order. Hero carousel will use only these selected skins.
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Skin</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Collection</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Home Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Order</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skins.map((skin: any) => (
                  <tr key={skin.id} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-md border border-border/50 bg-cover bg-center"
                          style={skin.textureImage ? { backgroundImage: `url(${skin.textureImage})` } : { backgroundColor: skin.color }}
                        />
                        <div>
                          <p className="text-sm font-medium">{skin.name}</p>
                          <p className="text-xs text-muted-foreground">Rs{skin.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{skin.collection}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${skin.show_on_homepage ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        {skin.show_on_homepage ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{skin.show_on_homepage ? skin.homepage_sort_order || "-" : "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {skin.show_on_homepage && (
                          <>
                            <button
                              onClick={() => moveSkin(skin, -1)}
                              className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                              title="Move up"
                            >
                              <GripVertical size={14} />
                            </button>
                            <button
                              onClick={() => moveSkin(skin, 1)}
                              className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                              title="Move down"
                            >
                              <GripVertical size={14} className="rotate-180" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => toggleHomepage(skin)}
                          className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                          title={skin.show_on_homepage ? "Hide from homepage" : "Show on homepage"}
                        >
                          {skin.show_on_homepage ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border/50 text-sm text-muted-foreground">
            Featured on homepage: {homepageSkins.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomeSkins;