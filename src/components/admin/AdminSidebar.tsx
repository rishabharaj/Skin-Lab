import {
  BarChart3,
  Smartphone,
  Palette,
  ShoppingBag,
  Settings,
  Home,
  Layers,
  Film,
  Ticket,
  Package,
  Star,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Analytics", url: "/admin", icon: BarChart3 },
  { title: "Devices", url: "/admin/devices", icon: Smartphone },
  { title: "Mask Templates", url: "/admin/masks", icon: Layers },
  { title: "Skins", url: "/admin/skins", icon: Palette },
  { title: "Home Page Skins", url: "/admin/home-skins", icon: Star },
  { title: "Video Reels", url: "/admin/reels", icon: Film },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
  { title: "Coupons", url: "/admin/coupons", icon: Ticket },
  { title: "Inventory", url: "/admin/inventory", icon: Package },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) =>
    path === "/admin" ? currentPath === "/admin" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed ? "Dashboard" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/" className="hover:bg-muted/50" activeClassName="">
                <Home className="mr-2 h-4 w-4" />
                {!collapsed && <span>Back to Store</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
