import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import KhachHangPage from "@/pages/KhachHangPage";
import NhanSuPage from "@/pages/NhanSuPage";
import ToKhaiThuePage from "@/pages/ToKhaiThuePage";
import TrangThaiDNPage from "@/pages/TrangThaiDNPage";
import HopDongPage from "@/pages/HopDongPage";
import CongNoPage from "@/pages/CongNoPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/khach-hang" element={<KhachHangPage />} />
            <Route path="/nhan-su" element={<NhanSuPage />} />
            <Route path="/to-khai-thue" element={<ToKhaiThuePage />} />
            <Route path="/trang-thai-dn" element={<TrangThaiDNPage />} />
            <Route path="/hop-dong" element={<HopDongPage />} />
            <Route path="/cong-no" element={<CongNoPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
