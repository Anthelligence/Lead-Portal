import { TopBar } from "@/components/brand/TopBar";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";
import { getProfileSettings } from "@/lib/queries";
import { demoAssessment, demoCompany } from "@/lib/demo";

type PageProps = {
  searchParams?: { slug?: string };
};

export default async function ProfileSettingsPage({ searchParams }: PageProps) {
  const slug = searchParams?.slug || demoCompany.slug;
  const data = await getProfileSettings(slug);

  if (!data) {
    return (
      <main className="min-h-screen px-4 py-6 space-y-6">
        <TopBar />
        <div className="space-y-1">
          <h1 className="text-xl font-semibold font-heading">Profile Settings</h1>
          <p className="text-sm text-gray-600">Manage your info and visibility.</p>
        </div>
        <div className="card p-6 space-y-3">
          <h2 className="text-lg font-semibold">Profile not found</h2>
          <p className="text-sm text-gray-600">
            We could not find a profile for the slug <span className="font-semibold">{slug}</span>.
            Check the link or try a different company.
          </p>
        </div>
      </main>
    );
  }

  const { company, assessment, publicProfileEnabled } = data;

  return (
    <main className="min-h-screen px-4 py-6 space-y-6">
      <TopBar />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold font-heading">Profile Settings</h1>
        <p className="text-sm text-gray-600">Manage your info and visibility.</p>
      </div>
      <ProfileSettingsForm
        slug={company.slug}
        company={company || demoCompany}
        assessment={assessment || demoAssessment}
        publicProfileEnabled={publicProfileEnabled}
      />
    </main>
  );
}

