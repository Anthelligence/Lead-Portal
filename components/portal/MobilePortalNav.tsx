/** @jsxImportSource react */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

type NavItem = {
  key: "assessment" | "roi" | "resources" | "profile";
  label: string;
  icon: string;
  href: string;
  fallbackHref?: string;
};

const items: NavItem[] = [
  {
    key: "assessment",
    label: "Assessment",
    icon: "📊",
    href: "/portal/assessment/results",
    fallbackHref: "/portal/assessment/run"
  },
  {
    key: "roi",
    label: "ROI",
    icon: "💰",
    href: "/portal/roi/results",
    fallbackHref: "/portal/roi"
  },
  {
    key: "resources",
    label: "Resources",
    icon: "📚",
    href: "/portal/resources"
  },
  {
    key: "profile",
    label: "Profile",
    icon: "👤",
    href: "/portal/settings/profile"
  }
];

const STORAGE_KEYS = {
  assessment: "assessmentResultReady",
  roi: "roiResultReady"
};

function isActivePath(item: NavItem, pathname: string) {
  const candidates = [item.href, item.fallbackHref, `/portal/${item.key}`].filter(Boolean) as string[];
  return candidates.some((p) => pathname.startsWith(p));
}

export function MobilePortalNav() {
  const pathname = usePathname();
  const [hasAssessment, setHasAssessment] = useState(false);
  const [hasRoi, setHasRoi] = useState(false);

  useEffect(() => {
    const read = () => {
      setHasAssessment(localStorage.getItem(STORAGE_KEYS.assessment) === "true");
      setHasRoi(localStorage.getItem(STORAGE_KEYS.roi) === "true");
    };
    read();
    const handler = () => read();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const isReady = (key: NavItem["key"]) => {
    if (key === "assessment") return hasAssessment;
    if (key === "roi") return hasRoi;
    return true;
  };

  const resolveHref = (item: NavItem) => {
    const ready = isReady(item.key);
    return ready || !item.fallbackHref ? item.href : item.fallbackHref;
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-gray-200 shadow-soft lg:hidden">
      <div className="grid grid-cols-4 text-xs font-semibold text-gray-700 px-2">
        {items.map((item) => {
          const ready = isReady(item.key);
          const href = resolveHref(item);
          const isActive = isActivePath(item, pathname);

          return (
            <Link
              key={item.href}
              href={href}
              className={clsx(
                "flex flex-col items-center justify-center py-4 gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5E17]/60 transition-colors text-[13px]",
                isActive
                  ? "text-[#FE5E17] font-semibold bg-[#FE5E17]/10 shadow-inner border-t-2 border-[#FE5E17]"
                  : "hover:text-[#FE5E17] active:text-[#FE5E17]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={clsx("text-xl", isActive && "scale-110 transition-transform")} aria-hidden>
                {item.icon}
              </span>
              <span className="leading-4">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

