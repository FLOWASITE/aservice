import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogIn, Eye, EyeOff, ShieldCheck, BarChart3, Users } from "lucide-react";
import logoHorizontal from "@/assets/logo-horizontal.png";

const FEATURES = [
  { icon: ShieldCheck, title: "Bảo mật cao", desc: "Dữ liệu được mã hóa và bảo vệ 24/7" },
  { icon: BarChart3, title: "Báo cáo thông minh", desc: "Tổng hợp & phân tích dữ liệu tự động" },
  { icon: Users, title: "Quản lý toàn diện", desc: "Khách hàng, nhân sự, hợp đồng trong một nền tảng" },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({ title: "Vui lòng nhập đầy đủ thông tin", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      toast({ title: "Đăng nhập thành công!" });
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: err.message || "Sai tên đăng nhập hoặc mật khẩu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(215 30% 16%), hsl(215 40% 24%))" }}>
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsl(210 60% 65%), transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(195 70% 45%), transparent 70%)" }} />

        <div>
          <img src={logoHorizontal} alt="AService" className="h-10 object-contain brightness-0 invert" />
        </div>

        <div className="space-y-8 relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Nền tảng quản lý<br />dịch vụ kế toán
            </h1>
            <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-sm">
              Giải pháp toàn diện giúp doanh nghiệp dịch vụ kế toán vận hành hiệu quả, chuyên nghiệp và tiết kiệm thời gian.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white/10">
                  <f.icon className="h-4.5 w-4.5 text-white/80" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-white/50">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/30">© 2026 AService. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center">
            <img src={logoHorizontal} alt="AService" className="h-10 object-contain" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Đăng nhập</h2>
            <p className="text-sm text-muted-foreground">
              Nhập thông tin tài khoản để truy cập hệ thống
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-medium">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập hoặc email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium">Mật khẩu</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                  Đang đăng nhập...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Liên hệ quản trị viên nếu bạn chưa có tài khoản
          </p>
        </div>
      </div>
    </div>
  );
}
