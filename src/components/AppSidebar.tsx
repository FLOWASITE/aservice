import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Building2,
  FileSignature,
  Wallet,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/types/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AppRole[]; // undefined = visible to all
}

const menuItems: MenuItem[] = [
  { title: "Trang điều khiển", url: "/", icon: LayoutDashboard },
  { title: "Khách hàng", url: "/khach-hang", icon: Users },
  { title: "Nhân sự", url: "/nhan-su", icon: UserCog, roles: ["admin", "manager"] },
  { title: "Kết quả tờ khai thuế", url: "/to-khai-thue", icon: FileText },
  { title: "Trạng thái doanh nghiệp", url: "/trang-thai-dn", icon: Building2 },
  { title: "Hợp đồng dịch vụ", url: "/hop-dong", icon: FileSignature, roles: ["admin", "manager"] },
  { title: "Theo dõi công nợ", url: "/cong-no", icon: Wallet, roles: ["admin", "manager"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout, hasAnyRole } = useAuth();

  const visibleItems = menuItems.filter(
    (item) => !item.roles || hasAnyRole(item.roles)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
            A
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-semibold text-sidebar-accent-foreground">
                AService
              </h1>
              <p className="text-xs text-sidebar-foreground">Quản lý dịch vụ kế toán</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase text-[10px] tracking-wider">
            Menu chính
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/80"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                {user?.username || "User"}
              </p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">
                {user?.roles.join(", ")}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="text-sidebar-foreground/60 hover:text-destructive transition-colors shrink-0"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
