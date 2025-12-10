import { CompanyHeader } from "@/components/profile/CompanyHeader";
import { ContactCard } from "@/components/profile/ContactCard";
import { ScoreCard } from "@/components/profile/ScoreCard";
import { StrengthsCard } from "@/components/profile/StrengthsCard";
import { OpportunitiesCard } from "@/components/profile/OpportunitiesCard";
import { ShareBar } from "@/components/profile/ShareBar";
import { TopBar } from "@/components/brand/TopBar";
import { getPublicProfile } from "@/lib/queries";
import { demoCompany, demoAssessment } from "@/lib/demo";

export default async function PublicProfilePage({
  params
}: {
  params: { slug: string };
}) {
  const data =
    (await getPublicProfile(params.slug)) ||
    (params.slug === "demo-company"
      ? {
          company: demoCompany,
          assessment: demoAssessment
        }
      : null);

  if (!data) {
    return (
      <main className="min-h-screen px-4 py-10">
        <TopBar />
        <div className="card p-6 space-y-2 text-center">
          <h1 className="text-xl font-semibold font-heading">Profile not found</h1>
          <p className="text-sm text-gray-600">
            This public profile is not available or has been disabled.
          </p>
        </div>
      </main>
    );
  }

  const { company, assessment } = data;
  const publicUrl = `${process.env.NEXTAUTH_URL || ""}/profile/${company.slug}`;
  const showAssessments = company.show_assessment_scores !== false && assessment;

  return (
    <main className="min-h-screen px-4 pb-10 pt-6 space-y-6">
      <TopBar />
      <CompanyHeader
        name={company.name}
        businessType={company.business_type}
        bannerUrl={company.banner_url}
        logoUrl={company.logo_url}
        readinessLabel={assessment?.profile_label}
      />

      <ContactCard
        phone={company.phone}
        email={company.email}
        website={company.website}
        whatsapp={company.whatsapp}
        messaging={company.messaging_url}
        linkedin={company.linkedin_url}
        instagram={company.instagram_url}
        tiktok={company.tiktok_url}
        x={company.x_url}
        vcardUrl={`/api/vcard/${company.slug}`}
      />

      <div className="card p-5 space-y-3">
        <h3 className="text-lg font-semibold font-heading">About the Company</h3>
        <p className="text-sm text-gray-700">
          {company.description || "This company has not added a description yet."}
        </p>
      </div>

      {company.additional_details ? (
        <div className="card p-5 space-y-3">
          <h3 className="text-lg font-semibold font-heading">Additional Details</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{company.additional_details}</p>
        </div>
      ) : null}

      {showAssessments ? (
        <>
      <ScoreCard score={assessment?.total_score ?? null} label={assessment?.profile_label} />
      <StrengthsCard title="Operational Strengths" items={assessment?.strengths ?? []} />
      <OpportunitiesCard
        title="Growth Opportunities"
        items={assessment?.opportunities ?? []}
      />
        </>
      ) : null}

      <div className="card p-5 space-y-3 text-center">
        <p className="text-sm text-gray-700">
          Ready to generate your own company profile?
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#FE5E17] px-5 py-3 text-white text-sm font-semibold"
        >
          Generate Your Own Company Profile
        </a>
      </div>

      <ShareBar url={publicUrl} />

      <div className="text-center text-xs text-gray-500">Powered by COTIT 360°</div>
    </main>
  );
}

