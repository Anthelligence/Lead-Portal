import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";

export default function ActivateLandingPage() {
  return (
    <main className="min-h-screen px-4 py-10 space-y-8">
      <TopBar />
      <div className="space-y-2 text-center">
        <p className="text-sm text-[#FE5E17] font-semibold">COTIT</p>
        <h1 className="text-xl font-semibold font-heading">
          Welcome! Let&apos;s activate your Control 360° Portal.
        </h1>
        <p className="text-sm text-gray-600">
          This experience is personalized for your business.
        </p>
      </div>

      <div className="card p-6 space-y-4 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-[#FE5E17]/10 flex items-center justify-center">
          📶
        </div>
        <p className="text-sm font-semibold">NFC Detection Active</p>
        <p className="text-xs text-gray-600">
          Hold your NFC card near your device to continue.
        </p>
        <div className="flex justify-center">
          <span className="h-2 w-2 rounded-full bg-[#FE5E17]" />
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/demo-token"
          className="w-full block rounded-full bg-[#FE5E17] py-3 text-center text-white font-semibold"
        >
          Continue
        </Link>
        <div className="text-center text-xs text-gray-600 space-y-1">
          <p>Don&apos;t have an NFC card?</p>
          <Link href="/demo-token" className="text-[#FE5E17] font-semibold">
            Enter token manually
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pt-4">Powered by COTIT 360°</div>
    </main>
  );
}

