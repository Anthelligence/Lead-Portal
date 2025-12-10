import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";

const resources = [
  {
    title: "E-books",
    desc: "Comprehensive guides on operational excellence and digital transformation",
    status: "AVAILABLE",
    cta: "Browse E-books",
    href: "/portal/resources/ebooks"
  },
  {
    title: "Use Cases",
    desc: "Real-world examples and success stories from industry leaders",
    status: "COMING SOON",
    cta: "Not Available Yet"
  },
  {
    title: "Videos",
    desc: "Video tutorials and product demonstrations",
    status: "COMING SOON",
    cta: "Not Available Yet"
  },
  {
    title: "Documentation",
    desc: "Technical documentation and API references",
    status: "COMING SOON",
    cta: "Not Available Yet"
  },
  {
    title: "Whitepapers",
    desc: "In-depth research and industry insights",
    status: "COMING SOON",
    cta: "Not Available Yet"
  }
];

export default function ResourceLibraryPage() {
  return (
    <main className="min-h-screen px-4 py-6 space-y-6">
      <TopBar />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold font-heading">Resource Library</h1>
        <p className="text-sm text-gray-600">
          Access guides, tools, and documentation to maximize your operational intelligence.
        </p>
      </div>

      <div className="card p-4">
        <input
          className="w-full rounded-lg border border-gray-200 bg-white text-[#1d1d1d] placeholder:text-gray-500 px-3 py-3 text-sm focus:border-[#FE5E17] focus:ring-2 focus:ring-[#FE5E17]/30"
          placeholder="Search resources..."
        />
      </div>

      <div className="space-y-4">
        {resources.map((res) => {
          const isAvailable = res.status === "AVAILABLE" && res.href;
          const badgeClasses =
            res.status === "AVAILABLE"
              ? "bg-[#93D753]/20 text-[#3a7b16]"
              : "bg-gray-200 text-gray-600";
          const buttonClasses = isAvailable
            ? "border-[#FE5E17] text-[#FE5E17]"
            : "bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed";

          const content = (
            <div className="card p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{res.title}</p>
                  <p className="text-xs text-gray-600">{res.desc}</p>
                </div>
                <span className={`text-xs rounded-full px-2 py-1 ${badgeClasses}`}>{res.status}</span>
              </div>
              {isAvailable ? (
                <Link
                  href={res.href}
                  className={`w-full inline-flex justify-center rounded-lg border px-4 py-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5E17]/60 ${buttonClasses}`}
                >
                  {res.cta}
                </Link>
              ) : (
                <button
                  className={`w-full rounded-lg px-4 py-3 text-sm font-semibold ${buttonClasses}`}
                  disabled
                  aria-disabled
                >
                  {res.cta}
                </button>
              )}
            </div>
          );

          return <div key={res.title}>{content}</div>;
        })}
      </div>

      <div className="card p-5 space-y-2">
        <p className="text-sm font-semibold">Need Help?</p>
        <p className="text-xs text-gray-600">
          Can&apos;t find what you&apos;re looking for? Our support team is here to help.
        </p>
        <a className="text-[#4D93D6] text-sm font-semibold" href="#">
          Contact Support
        </a>
      </div>

      <div className="text-center text-xs text-gray-500 pb-6">Powered by COTIT 360°</div>
    </main>
  );
}

