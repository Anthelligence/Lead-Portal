"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import imageCompression from "browser-image-compression";
import { CompanyHeader } from "@/components/profile/CompanyHeader";
import { ContactCard } from "@/components/profile/ContactCard";
import { ScoreCard } from "@/components/profile/ScoreCard";
import { StrengthsCard } from "@/components/profile/StrengthsCard";
import { OpportunitiesCard } from "@/components/profile/OpportunitiesCard";

type Company = {
  slug: string;
  name: string;
  business_type?: string | null;
  website?: string | null;
  country?: string | null;
  size?: string | null;
  monthly_orders?: number | null;
  description?: string | null;
  additional_details?: string | null;
  messaging_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  x_url?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  linkedin_url?: string | null;
  banner_url?: string | null;
  logo_url?: string | null;
  role?: string | null;
};

type Assessment = {
  total_score?: number | null;
  profile_label?: string | null;
  strengths?: string[] | null;
  opportunities?: string[] | null;
} | null;

type ProfileSettingsFormProps = {
  company: Company;
  assessment: Assessment;
  publicProfileEnabled: boolean;
  slug: string;
};

export function ProfileSettingsForm({
  company,
  assessment,
  publicProfileEnabled,
  slug
}: ProfileSettingsFormProps) {
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch (err) {
      console.warn("Supabase not configured for uploads", err);
      return null;
    }
  }, []);
  const [fields, setFields] = useState({
    name: company.name ?? "",
    businessType: company.business_type ?? "",
    website: company.website ?? "",
    country: company.country ?? "",
    size: company.size ?? "",
    monthlyOrders: company.monthly_orders ? String(company.monthly_orders) : "",
    description: company.description ?? "",
    additionalDetails: company.additional_details ?? "",
    messagingUrl: company.messaging_url ?? "",
    instagramUrl: company.instagram_url ?? "",
    tiktokUrl: company.tiktok_url ?? "",
    xUrl: company.x_url ?? "",
    phone: company.phone ?? "",
    email: company.email ?? "",
    whatsapp: company.whatsapp ?? "",
    linkedin: company.linkedin_url ?? "",
    bannerUrl: company.banner_url ?? "",
    logoUrl: company.logo_url ?? "",
    role: company.role ?? ""
  });
  const [profilePublic, setProfilePublic] = useState(publicProfileEnabled);
  const [showAssessmentScores, setShowAssessmentScores] = useState(
    company.show_assessment_scores !== false
  );
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "banner" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  const publicProfileLink = useMemo(() => `/profile/${slug}`, [slug]);
  const hasAssessment = Boolean(assessment?.total_score);
  const businessTypeOptions = [
    { label: "Technology & Software", value: "Technology & Software" },
    { label: "Retail", value: "Retail" },
    { label: "Wholesale", value: "Wholesale" },
    { label: "Distribution", value: "Distribution" },
    { label: "E-commerce", value: "E-commerce" },
    { label: "Manufacturing", value: "Manufacturing" },
    { label: "Logistics & Warehousing", value: "Logistics & Warehousing" },
    { label: "Other", value: "Other" }
  ];

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpload(file: File, field: "logoUrl" | "bannerUrl") {
    if (!supabase) {
      setUploadError("Uploads unavailable: Supabase is not configured.");
      return;
    }

    setUploadError(null);
    setUploading(field === "logoUrl" ? "logo" : "banner");
    try {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: field === "logoUrl" ? 512 : 1600,
        maxSizeMB: field === "logoUrl" ? 0.35 : 0.8,
        initialQuality: 0.85,
        useWebWorker: true,
        alwaysKeepResolution: false
      });

      const ext = file.name.split(".").pop();
      const path = `${field}/${crypto.randomUUID()}.${ext || "jpg"}`;
      const { error: uploadErrorResult } = await supabase.storage
        .from("public-assets")
        .upload(path, compressed, { upsert: true, cacheControl: "3600" });

      if (uploadErrorResult) {
        throw uploadErrorResult;
      }

      const { data } = supabase.storage.from("public-assets").getPublicUrl(path);
      if (data?.publicUrl) {
        setFields((prev) => ({
          ...prev,
          [field]: data.publicUrl
        }));
        setStatus("Upload successful. Remember to save your changes.");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>, field: "logoUrl" | "bannerUrl") {
    const file = event.target.files?.[0];
    if (file) {
      void handleUpload(file, field);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          ...fields,
          monthlyOrders: fields.monthlyOrders ? Number(fields.monthlyOrders) : null,
          publicProfileEnabled: profilePublic,
          showAssessmentScores
        })
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || "Failed to save changes");
      }

      if (body?.company) {
        const updated = body.company as Company;
        setFields({
          name: updated.name ?? "",
          businessType: updated.business_type ?? "",
          website: updated.website ?? "",
          country: updated.country ?? "",
          size: updated.size ?? "",
          monthlyOrders: updated.monthly_orders ? String(updated.monthly_orders) : "",
          description: updated.description ?? "",
          additionalDetails: updated.additional_details ?? "",
          messagingUrl: (updated as any).messaging_url ?? "",
          instagramUrl: (updated as any).instagram_url ?? "",
          tiktokUrl: (updated as any).tiktok_url ?? "",
          xUrl: (updated as any).x_url ?? "",
          phone: updated.phone ?? "",
          email: updated.email ?? "",
          whatsapp: updated.whatsapp ?? "",
          linkedin: updated.linkedin_url ?? "",
          bannerUrl: updated.banner_url ?? "",
          logoUrl: updated.logo_url ?? "",
          role: updated.role ?? ""
        });
      }

      if (typeof body?.publicProfileEnabled === "boolean") {
        setProfilePublic(body.publicProfileEnabled);
      }

      setStatus("Profile saved successfully.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex justify-end">
        <div className="inline-flex rounded-full border border-[#FE5E17] overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${
              viewMode === "edit"
                ? "bg-[#FE5E17] text-white"
                : "bg-white text-[#FE5E17]"
            }`}
          >
            <span aria-hidden>⚙️</span>
            <span>Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-l border-[#FE5E17] ${
              viewMode === "preview"
                ? "bg-[#FE5E17] text-white"
                : "bg-white text-[#FE5E17]"
            }`}
          >
            <span aria-hidden>👁️</span>
            <span>Live</span>
          </button>
        </div>
      </div>

      {viewMode === "edit" ? (
        <>
          <div className="card p-5 space-y-4">
        <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold font-heading">Branding</h3>
            <p className="text-sm text-gray-600">Add your logo and banner to match your brand.</p>
          </div>
        </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-700">Banner image</span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploading === "banner"}
                  >
                    {uploading === "banner" ? "Uploading..." : "Upload banner"}
                  </Button>
                </div>
                <Input
                  name="bannerUrl"
                  value={fields.bannerUrl}
                  onChange={handleChange}
                  placeholder="https://images..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-700">Logo image</span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading === "logo"}
                  >
                    {uploading === "logo" ? "Uploading..." : "Upload logo"}
                  </Button>
                </div>
                <Input
                  name="logoUrl"
                  value={fields.logoUrl}
                  onChange={handleChange}
                  placeholder="https://images..."
                />
              </div>
            </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileInputChange(e, "bannerUrl")}
        />
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileInputChange(e, "logoUrl")}
        />
        {uploadError ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {uploadError}
          </div>
        ) : null}
        <p className="text-xs text-gray-500">
          Uploads use the Supabase storage bucket <span className="font-semibold">public-assets</span>.
          Ensure it exists and allows public read access.
        </p>
      </div>

          <div className="card p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold font-heading">Company details</h3>
              <p className="text-sm text-gray-600">
                Keep your core company info current so it reflects on your public profile.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company name"
                name="name"
                value={fields.name}
                onChange={handleChange}
                icon="🏢"
              />
              <Select
                label="Business type"
                name="businessType"
                value={fields.businessType}
                onChange={(e) => setFields((prev) => ({ ...prev, businessType: e.target.value }))}
                options={businessTypeOptions}
              />
              <Input
                label="Website"
                name="website"
                value={fields.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
                icon="🌐"
              />
              <Input
                label="Country"
                name="country"
                value={fields.country}
                onChange={handleChange}
                placeholder="United States"
              />
              <Input
                label="Company size"
                name="size"
                value={fields.size}
                onChange={handleChange}
                placeholder="e.g. 50-200"
              />
              <Input
                label="Monthly orders"
                name="monthlyOrders"
                type="number"
                min={0}
                value={fields.monthlyOrders}
                onChange={handleChange}
                placeholder="e.g. 2500"
              />
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-base font-semibold text-gray-800">Contact details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Business email"
                  name="email"
                  type="email"
                  value={fields.email}
                  onChange={handleChange}
                  placeholder="team@company.com"
                  icon="✉️"
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={fields.phone}
                  onChange={handleChange}
                  placeholder="+1 555 123 4567"
                  icon="📞"
                />
                <Input
                  label="Messaging link (WhatsApp, Slack, etc.)"
                  name="messagingUrl"
                  value={fields.messagingUrl}
                  onChange={handleChange}
                  placeholder="https://wa.me/15551234567"
                  icon="💬"
                />
                <Input
                  label="LinkedIn URL"
                  name="linkedin"
                  value={fields.linkedin}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/company/your-company"
                  icon="🔗"
                />
                <Input
                  label="Instagram"
                  name="instagramUrl"
                  value={fields.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourcompany"
                  icon="📸"
                />
                <Input
                  label="TikTok"
                  name="tiktokUrl"
                  value={fields.tiktokUrl}
                  onChange={handleChange}
                  placeholder="https://www.tiktok.com/@yourcompany"
                  icon="🎵"
                />
                <Input
                  label="X (formerly Twitter)"
                  name="xUrl"
                  value={fields.xUrl}
                  onChange={handleChange}
                  placeholder="https://x.com/yourcompany"
                  icon="𝕏"
                />
                <Input
                  label="Role"
                  name="role"
                  value={fields.role}
                  onChange={handleChange}
                  placeholder="Operations Lead"
                  icon="🧑‍💼"
                />
              </div>
            </div>
          </div>

      <div className="card p-5 space-y-4">
        <div className="space-y-3">
          <label className="block space-y-2 text-sm">
            <span className="text-xs font-semibold text-gray-700">Company description</span>
            <textarea
              name="description"
              value={fields.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-200 bg-white text-[#1d1d1d] placeholder:text-gray-500 px-3 py-3 text-sm focus:border-[#FE5E17] focus:ring-2 focus:ring-[#FE5E17]/30"
              placeholder="Share a concise overview of your company."
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="text-xs font-semibold text-gray-700">
              Additional details (anything not covered above)
            </span>
            <textarea
              name="additionalDetails"
              value={fields.additionalDetails}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-200 bg-white text-[#1d1d1d] placeholder:text-gray-500 px-3 py-3 text-sm focus:border-[#FE5E17] focus:ring-2 focus:ring-[#FE5E17]/30"
              placeholder="Locations served, key certifications, partnerships, or other notes."
            />
          </label>
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <p className="text-sm font-semibold">Visibility</p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={profilePublic}
            onChange={(e) => setProfilePublic(e.target.checked)}
          />
          <span>Make profile public</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={showAssessmentScores}
            onChange={(e) => setShowAssessmentScores(e.target.checked)}
          />
          <span>Show assessment scores on public profile</span>
        </label>
        <div className="text-xs text-gray-600 space-y-1">
          <p>
            Public profile link: <span className="font-semibold">{publicProfileLink}</span>
          </p>
          <p className="text-gray-500">
            Assessment scores are shown automatically when available
            {hasAssessment ? " (latest score ready)" : " (no assessment data yet)"}.
          </p>
        </div>
      </div>

          {status ? (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {status}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" fullWidth disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => window.open(publicProfileLink, "_blank")}
            >
              View public profile
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="card p-5 space-y-4">
            <div className="flex items-start justify-between gap-2 flex-col sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold font-heading">Public profile preview</h3>
                <p className="text-sm text-gray-600">See how your profile will appear when shared.</p>
              </div>
              <Button type="button" variant="secondary" onClick={() => window.open(publicProfileLink, "_blank")}>
                Open live profile
              </Button>
            </div>
            <div className="space-y-4 border rounded-2xl p-4 bg-gray-50">
              <CompanyHeader
                name={fields.name || "Your Company"}
                businessType={fields.businessType}
                bannerUrl={fields.bannerUrl}
                logoUrl={fields.logoUrl}
                readinessLabel={showAssessmentScores ? assessment?.profile_label : null}
              />
              <ContactCard
                phone={fields.phone}
                email={fields.email}
                website={fields.website}
                whatsapp={fields.whatsapp}
                messaging={fields.messagingUrl}
                linkedin={fields.linkedin}
                instagram={fields.instagramUrl}
                tiktok={fields.tiktokUrl}
                x={fields.xUrl}
                vcardUrl={`/api/vcard/${slug}`}
              />
              <div className="card p-5 space-y-3">
                <h3 className="text-lg font-semibold font-heading">About the Company</h3>
                <p className="text-sm text-gray-700">
                  {fields.description || "Add a concise description to appear here."}
                </p>
              </div>
              {fields.additionalDetails ? (
                <div className="card p-5 space-y-3">
                  <h3 className="text-lg font-semibold font-heading">Additional Details</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{fields.additionalDetails}</p>
                </div>
              ) : null}
              {showAssessmentScores && assessment ? (
                <>
                  <ScoreCard score={assessment.total_score ?? null} label={assessment.profile_label} />
                  <StrengthsCard title="Operational Strengths" items={assessment.strengths ?? []} />
                  <OpportunitiesCard title="Growth Opportunities" items={assessment.opportunities ?? []} />
                </>
              ) : null}
            </div>
          </div>

          {status ? (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {status}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setViewMode("edit")}
            >
              Back to settings
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => window.open(publicProfileLink, "_blank")}
            >
              Open live profile
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

