"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RouteLoadingBar } from "@/components/layout/route-loading-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { GlobalAssistant } from "@/components/assistant/global-assistant";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const theme = "light";
    const lang = localStorage.getItem("gw_lang") || "ru";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("lang", lang);
  }, []);

  return (
    <div className="min-h-dvh md:flex premium-shell">
      <RouteLoadingBar />
      <Sidebar className="hidden md:block" />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 md:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="h-dvh w-fit" onClick={(event) => event.stopPropagation()}>
            <Sidebar className="h-dvh shadow-xl" onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="page-enter relative min-w-0 flex-1 overflow-x-hidden px-3 pb-20 pt-4 sm:px-4 md:pb-4 lg:p-8">
        <div className="premium-orb premium-orb-a" />
        <div className="premium-orb premium-orb-b" />
        <Breadcrumbs />
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="premium-stage">{children}</div>
        <GlobalAssistant />
      </main>
      <MobileNav />
    </div>
  );
}
