import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";

type EbookStatus = "AVAILABLE" | "COMING SOON";

type Ebook = {
  title: string;
  description: string;
  status: EbookStatus;
  pages: number;
};

const ebooks: Ebook[] = [
  {
    title: "Digital Transformation Playbook",
    description:
      "A complete guide to implementing digital transformation strategies in manufacturing environments.",
    status: "AVAILABLE",
    pages: 24
  },
  {
    title: "Operational Excellence Framework",
    description:
      "Best practices and methodologies for achieving operational excellence in industrial settings.",
    status: "AVAILABLE",
    pages: 32
  },
  {
    title: "Industry 4.0 Implementation Guide",
    description:
      "Step-by-step approach to implementing Industry 4.0 technologies and smart manufacturing solutions.",
    status: "COMING SOON",
    pages: 28
  },
  {
    title: "Data-Driven Decision Making",
    description: "How to leverage data analytics for better operational decisions.",
    status: "AVAILABLE",
    pages: 18
  },
  {
    title: "Supply Chain Optimization",
    description:
      "Advanced strategies for optimizing supply chain performance and reducing operational costs.",
    status: "COMING SOON",
    pages: 36
  }
];

export default function EbooksLibraryPage() {
  return (
    <main className="min-h-screen px-4 py-6 space-y-6">
      <TopBar />

      <div className="space-y-1">
        <h1 className="text-xl font-semibold font-heading">E-books</h1>
        <p className="text-sm text-gray-600">
          Comprehensive guides on operational excellence and digital transformation.
        </p>
      </div>

      <div className="card p-4">
        <input
          className="w-full rounded-lg border border-gray-200 bg-white text-[#1d1d1d] placeholder:text-gray-500 px-3 py-3 text-sm focus:border-[#FE5E17] focus:ring-2 focus:ring-[#FE5E17]/30"
          placeholder="Search E-books..."
        />
      </div>

      <div className="space-y-4">
        {ebooks.map((ebook) => {
          const isAvailable = ebook.status === "AVAILABLE";
          const badgeClasses = isAvailable
            ? "bg-[#93D753]/20 text-[#3a7b16]"
            : "bg-gray-200 text-gray-600";
          const buttonClasses = isAvailable
            ? "bg-[#FE5E17] text-white border border-[#FE5E17] shadow-soft hover:bg-[#fd501b] focus-visible:ring-2 focus-visible:ring-[#FE5E17]/60"
            : "bg-white border border-gray-200 text-gray-500 cursor-not-allowed";

          return (
            <div key={ebook.title} className="card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-[#FFF4EA] text-[#FE5E17] px-3 py-1 text-[11px] font-semibold uppercase">
                    PDF
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{ebook.title}</p>
                    <p className="text-xs text-gray-600">{ebook.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className={`text-xs rounded-full px-2 py-1 ${badgeClasses}`}>
                    {isAvailable ? "AVAILABLE" : "COMING SOON"}
                  </span>
                  <span className="text-xs text-gray-500">{ebook.pages} pages</span>
                </div>
              </div>
              <div className="pt-1">
                <button
                  className={`w-full rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none ${buttonClasses}`}
                  disabled={!isAvailable}
                  aria-disabled={!isAvailable}
                >
                  {isAvailable ? "View Resource" : "Not Available Yet"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-5 space-y-2 text-center">
        <p className="text-sm font-semibold text-gray-800">Looking for something else?</p>
        <p className="text-xs text-gray-600">Browse our full resource library.</p>
        <Link
          href="/portal/resources"
          className="inline-flex justify-center rounded-full border border-[#FE5E17] px-5 py-2.5 text-sm font-semibold text-[#FE5E17] hover:bg-[#FE5E17]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5E17]/60"
        >
          Back to Resource Library
        </Link>
      </div>

      <div className="text-center text-xs text-gray-500 pb-6">Powered by COTIT 360°</div>
    </main>
  );
}


