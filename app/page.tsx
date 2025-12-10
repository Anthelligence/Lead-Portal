import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="card w-full max-w-xl p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center rounded-full bg-[#FE5E17]/10 px-4 py-2 text-sm font-semibold text-[#FE5E17]">
          COTIT 360°
        </div>
        <h1 className="text-2xl font-semibold font-heading">
          Welcome to COTIT Control 360°
        </h1>
        <p className="text-sm text-gray-600">
          Tap your NFC card to the device or open the link printed on your card
          to activate your portal.
        </p>
        <div className="space-y-3">
          <Link
            href="/activate"
            className="block w-full rounded-full bg-[#FE5E17] px-4 py-3 text-white font-medium"
          >
            Activate / Enter Token
          </Link>
          <Link
            href="/profile/demo-company"
            className="block w-full rounded-full border border-[#FE5E17] px-4 py-3 text-[#FE5E17] font-medium"
          >
            View Example Public Profile
          </Link>
          <Link
            href="/portal/dashboard"
            className="block w-full rounded-full border border-transparent px-4 py-2 text-sm text-[#FE5E17] font-medium"
          >
            Go to Portal Dashboard (login required)
          </Link>
        </div>
      </div>
    </main>
  );
}

