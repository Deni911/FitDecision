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
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 md:hidden bg-card border-b border-border p-4 w-full flex items-center justify-between">
        <div></div>
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
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border transform transition-transform duration-200 z-40 md:relative md:transform-none pt-20 md:pt-0 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
