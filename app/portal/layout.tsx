import type { ReactNode } from "react";
import { MobilePortalNav } from "@/components/portal/MobilePortalNav";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      {children}
      <MobilePortalNav />
    </div>
  );
}

