import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";
import { AccountSettingsForm } from "@/components/profile/AccountSettingsForm";
import { auth } from "@/auth";
import { isDemoMode } from "@/lib/config";
import { demoUser } from "@/lib/demo";
import { getAccountSettings } from "@/lib/queries";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AccountSettingsPage() {
  const session = await auth();
  const userId = session?.user?.id || demoUser.id;
  const account = await getAccountSettings(userId);
  const allowEmailSignIn = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);
  const readOnly = isDemoMode || !supabaseAdmin;

  return (
    <main className="min-h-screen px-4 py-6 space-y-6">
      <TopBar />
      <div className="space-y-2">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold font-heading">Account settings</h1>
          <p className="text-sm text-gray-600">
            Manage the email used for login and send yourself a fresh access link.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/portal/settings/profile"
            className="inline-flex items-center gap-2 rounded-full border border-[#FE5E17] px-4 py-2 text-sm font-semibold text-[#FE5E17] hover:bg-[#fff3ec]"
          >
            Company profile settings →
          </Link>
        </div>
      </div>

      {account ? (
        <AccountSettingsForm
          userId={account.id || userId}
          name={account.name}
          email={account.email}
          allowEmailSignIn={allowEmailSignIn}
          isDemo={readOnly}
        />
      ) : (
        <div className="card p-6 space-y-3">
          <h2 className="text-lg font-semibold font-heading">Account not found</h2>
          <p className="text-sm text-gray-600">
            We could not load your account details. Please sign in again or contact support.
          </p>
        </div>
      )}
    </main>
  );
}

