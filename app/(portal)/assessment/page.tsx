import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";

export default function AssessmentIntroPage() {
  return (
    <main className="min-h-screen px-4 py-6 space-y-8">
      <TopBar />
      <div className="space-y-3 text-center">
        <div className="h-1 w-full max-w-md mx-auto rounded-full bg-gray-100">
          <div className="h-1 w-0 rounded-full bg-[#FE5E17]" />
        </div>
        <p className="text-sm text-gray-600">0% Complete</p>
        <div className="card p-6 space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-[#FE5E17]/10 flex items-center justify-center">
              📋
            </div>
          </div>
          <h1 className="text-xl font-semibold font-heading">
            Let&apos;s assess your operations.
          </h1>
          <p className="text-sm text-gray-600">
            15 questions. Takes 2 minutes. Unlock your personalized report and reward.
          </p>
          <div className="space-y-2 text-sm text-left">
            <div className="flex items-start gap-2">
              <span className="text-[#93D753]">✓</span>
              <span>Quick 2-minute assessment</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#4D93D6]">✓</span>
              <span>Personalized operational insights</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#FE5E17]">✓</span>
              <span>Exclusive rewards &amp; recommendations</span>
            </div>
          </div>
          <div className="rounded-xl bg-white shadow-soft p-4 border text-left space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[#4D93D6]">🛡️</span>
              <div>
                <p className="text-sm font-semibold">Your data is secure</p>
                <p className="text-xs text-gray-600">
                  All responses are used only to generate your personalized operational report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6">
        <Link
          href="/portal/assessment/run"
          className="block w-full rounded-full bg-[#FE5E17] py-3 text-center text-white font-semibold"
        >
          Start Assessment →
        </Link>
      </div>
    </main>
  );
}

