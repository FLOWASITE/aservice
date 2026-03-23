import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Building2,
  FileSignature,
  Wallet,
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
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Trang điều khiển", url: "/", icon: LayoutDashboard },
  { title: "Khách hàng", url: "/khach-hang", icon: Users },
  { title: "Nhân sự", url: "/nhan-su", icon: UserCog },
  { title: "Kết quả tờ khai thuế", url: "/to-khai-thue", icon: FileText },
  { title: "Trạng thái doanh nghiệp", url: "/trang-thai-dn", icon: Building2 },
  { title: "Hợp đồng dịch vụ", url: "/hop-dong", icon: FileSignature },
  { title: "Theo dõi công nợ", url: "/cong-no", icon: Wallet },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

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
              {menuItems.map((item) => (
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
    </Sidebar>
  );
}
