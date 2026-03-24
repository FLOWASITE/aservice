import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "Trang điều khiển",
  "/khach-hang": "Khách hàng",
  "/nhan-su": "Nhân sự",
  "/to-khai-thue": "Kết quả tờ khai thuế",
  "/trang-thai-dn": "Trạng thái doanh nghiệp",
  "/hop-dong": "Hợp đồng dịch vụ",
  "/cong-no": "Theo dõi công nợ",
};

export function AppHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || "";

  return (
    <header className="h-14 flex items-center border-b border-border/60 bg-card/80 backdrop-blur-md px-4 gap-3 shrink-0 sticky top-0 z-30">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      {/* Separator */}
      <div className="h-5 w-px bg-border/60" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground/70 font-medium">AService</span>
        {pageTitle && (
          <>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground">{pageTitle}</span>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Search button */}
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg relative text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive ring-2 ring-card" />
        </Button>

        {/* Divider */}
        <div className="h-5 w-px bg-border/60 mx-1" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-muted/60 transition-all duration-200">
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-primary/15 to-accent/15 text-primary text-xs font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-[13px] font-semibold text-foreground leading-tight">{user?.username || "User"}</p>
                <p className="text-[10px] text-muted-foreground leading-tight capitalize">{user?.roles.join(", ")}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60 hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <p className="text-sm font-semibold">{user?.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.roles.join(", ")}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer">
              <User className="h-4 w-4 mr-2.5" />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer">
              <Settings className="h-4 w-4 mr-2.5" />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="rounded-lg px-3 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2.5" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
