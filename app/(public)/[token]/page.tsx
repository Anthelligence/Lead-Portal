import { redirect } from "next/navigation";
import { ActivationForm } from "@/components/forms/ActivationForm";
import { TopBar } from "@/components/brand/TopBar";
import { getTokenState } from "@/lib/queries";

export default async function TokenPage({
  params
}: {
  params: { token: string };
}) {
  const tokenState = await getTokenState(params.token);

  if (!tokenState) {
    return (
      <main className="min-h-screen px-4 py-10">
        <TopBar />
        <div className="card p-6 space-y-3">
          <h1 className="text-xl font-semibold font-heading">Token not found</h1>
          <p className="text-sm text-gray-600">
            The card token you tried to use was not found. Please check the link or contact
            support.
          </p>
        </div>
      </main>
    );
  }

  const companySlug = Array.isArray(tokenState.companies)
    ? tokenState.companies[0]?.slug
    : tokenState.companies?.slug;

  if (tokenState.claimed && tokenState.public_profile_enabled && companySlug) {
    redirect(`/profile/${companySlug}`);
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <TopBar />

      {tokenState.claimed ? (
        <div className="card p-6 space-y-3">
          <h1 className="text-xl font-semibold font-heading">Already activated</h1>
          <p className="text-sm text-gray-600">
            This card is already activated, but you can create your own assessment and portal
            experience.
          </p>
          <a
            href="/portal/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-[#FE5E17] px-4 py-3 text-white text-sm font-semibold"
          >
            Go to Portal
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold font-heading">Activate Your Profile</h1>
            <p className="text-sm text-gray-600">
              Tell us who you are so we can personalize your experience.
            </p>
          </div>
          <div className="card p-4 sm:p-6">
            <ActivationForm token={params.token} />
          </div>
        </div>
      )}
    </main>
  );
}

