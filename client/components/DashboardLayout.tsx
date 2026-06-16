import { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Clipboard,
  Lightbulb,
  Utensils,
  Dumbbell,
  BarChart3,
  History,
  Info,
  Menu,
  X,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Penilaian", href: "/assessment", icon: Clipboard },
    { label: "Rekomendasi", href: "/recommendations", icon: Lightbulb },
    { label: "Rencana Nutrisi", href: "/nutrition", icon: Utensils },
    { label: "Rencana Latihan", href: "/workout", icon: Dumbbell },
    { label: "Pemeringkatan SAW", href: "/ranking", icon: BarChart3 },
    { label: "Riwayat", href: "/history", icon: History },
    { label: "Tentang Sistem", href: "/about", icon: Info },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile menu button & dynamic clock */}
      <div className="fixed top-0 left-0 z-40 md:hidden bg-card border-b border-border p-4 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
          <ClockIcon size={14} />
          <span className="text-xs font-mono font-semibold">{formattedTime}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border transform transition-transform duration-200 z-40 md:relative md:transform-none pt-20 md:pt-0 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-accent">FitDecision</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Sistem Pendukung Keputusan Kebugaran
          </p>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-sidebar-accent text-sidebar-foreground"
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full md:pt-0 pt-20">
        {/* Desktop Header with dynamic clock and date */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-border bg-card">
          <h2 className="text-sm font-semibold text-muted-foreground">
            FitDecision Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-foreground bg-background/55 px-3 py-1.5 rounded-lg border border-border">
              <CalendarIcon size={14} className="text-accent" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
              <ClockIcon size={14} />
              <span>{formattedTime}</span>
            </div>
          </div>
        </header>

        {/* Running Text Marquee Banner */}
        <div className="bg-accent/15 border-b border-accent/20 py-2.5 overflow-hidden flex items-center text-xs font-medium text-accent">
          <div className="animate-marquee w-full">
            🔥 Tetap Konsisten! Kunci kebugaran adalah disiplin dan konsistensi. &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            💧 Hidrasi Tubuh: Pastikan minum air putih minimal 2-3 liter setiap hari agar tubuh tetap prima. &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            🍏 Rencana Nutrisi: Atur pola makan Anda sesuai dengan rencana gizi yang direkomendasikan. &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            💪 Latihan Fisik: Ikuti jadwal latihan mingguan Anda demi hasil yang optimal! &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            📊 Evaluasi Berkala: Perbarui metrik tubuh Anda secara berkala di menu Penilaian untuk hasil SAW yang akurat.
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
