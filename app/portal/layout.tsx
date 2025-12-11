import Link from "next/link";
import type { ReactNode } from "react";
import { MobilePortalNav } from "@/components/portal/MobilePortalNav";

function DashboardShortcut() {
  return (
    <div className="fixed right-3 bottom-32 lg:bottom-auto lg:top-6 lg:right-6 z-30">
      <Link
        href="/portal/dashboard"
        className="inline-flex items-center gap-2 rounded-full border border-[#FE5E17]/70 bg-white px-3 py-2 text-sm font-semibold text-[#FE5E17] shadow-[0_6px_18px_rgba(0,0,0,0.14)] ring-1 ring-[#FE5E17]/20 transition hover:bg-[#fff0e6]"
      >
        <span aria-hidden>🏠</span>
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <DashboardShortcut />
      {children}
      <MobilePortalNav />
    </div>
  );
}

