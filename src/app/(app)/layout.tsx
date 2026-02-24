"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-dvh md:flex">
      <Sidebar className="hidden md:block" />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 md:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="h-dvh w-fit" onClick={(event) => event.stopPropagation()}>
            <Sidebar className="h-dvh shadow-xl" onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="page-enter min-w-0 flex-1 overflow-x-hidden px-3 pb-20 pt-4 sm:px-4 md:pb-4 lg:p-8">
        <Breadcrumbs />
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
