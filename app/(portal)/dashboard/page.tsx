import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";

const cards = [
  {
    title: "Start the Self Assessment",
    description: "Unlock your personalized report + special reward.",
    href: "/portal/assessment",
    badge: "NEW"
  },
  {
    title: "See Your Savings",
    description: "Calculate your operational efficiency gains.",
    href: "/portal/roi"
  },
  {
    title: "Explore Resources",
    description: "E-book, use cases & more.",
    href: "/portal/resources"
  }
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-4 py-6 space-y-6">
      <TopBar />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold font-heading">Welcome.</h1>
        <p className="text-sm text-gray-600">Your Control 360° Portal is ready.</p>
      </div>

      <div className="space-y-4">
        {cards.map((card) => (
          <div key={card.title} className="card p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h2 className="font-semibold font-heading">{card.title}</h2>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
              {card.badge ? (
                <span className="text-xs rounded-full bg-[#93D753]/20 px-2 py-1 text-[#3a7b16]">
                  {card.badge}
                </span>
              ) : null}
            </div>
            <Link
              href={card.href}
              className="block w-full rounded-lg border border-[#FE5E17] px-4 py-3 text-center text-[#FE5E17] font-semibold"
            >
              {card.title.includes("Assessment")
                ? "Begin Assessment"
                : card.title.includes("Savings")
                ? "Calculate ROI"
                : "Browse Library"}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

