import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { OnboardingOverlay } from "@/components/layout/onboarding-overlay";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <OnboardingOverlay />
        <Breadcrumbs />
        <Topbar />
        {children}
      </main>
    </div>
  );
}
