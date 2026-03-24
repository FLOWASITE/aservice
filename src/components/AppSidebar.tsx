import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Building2,
  FileSignature,
  Wallet,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import logoHorizontal from "@/assets/logo-horizontal.png";
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
  roles?: AppRole[];
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
      {/* Header with logo */}
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          {collapsed ? (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0 shadow-lg shadow-sidebar-primary/20">
              A
            </div>
          ) : (
            <img src={logoHorizontal} alt="AService" className="h-8 object-contain" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[9px] tracking-[0.15em] font-semibold mb-1 px-3">
            Menu chính
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="group/nav relative rounded-lg px-3 py-2 transition-all duration-200 hover:bg-sidebar-accent/60 text-sidebar-foreground hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
                    >
                      {({ isActive }: { isActive: boolean }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sidebar-primary" />
                          )}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                            isActive
                              ? "bg-sidebar-primary/15 text-sidebar-primary"
                              : "text-sidebar-foreground/70 group-hover/nav:text-sidebar-accent-foreground"
                          }`}>
                            <item.icon className="h-[18px] w-[18px]" />
                          </div>
                          {!collapsed && (
                            <span className="text-[13px] flex-1">{item.title}</span>
                          )}
                          {!collapsed && isActive && (
                            <ChevronRight className="h-3.5 w-3.5 text-sidebar-primary/60 shrink-0" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarFooter className="border-t border-sidebar-border/50 p-3">
        {/* Pro badge - only when expanded */}
        {!collapsed && (
          <div className="mb-3 rounded-xl bg-gradient-to-r from-sidebar-primary/10 to-sidebar-accent/10 p-3 border border-sidebar-border/30">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-sidebar-primary" />
              <span className="text-[11px] font-semibold text-sidebar-accent-foreground">AService Pro</span>
            </div>
            <p className="text-[10px] text-sidebar-foreground/60 leading-relaxed">
              Hệ thống quản lý dịch vụ kế toán chuyên nghiệp
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-sidebar-border/50 ring-offset-1 ring-offset-sidebar-DEFAULT">
            <AvatarFallback className="bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 text-sidebar-primary-foreground text-xs font-semibold">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-sidebar-accent-foreground truncate">
                {user?.username || "User"}
              </p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate capitalize">
                {user?.roles.join(", ")}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sidebar-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 shrink-0"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
