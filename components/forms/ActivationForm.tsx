/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "New Zealand",
  "Germany",
  "France",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  "Italy",
  "Spain",
  "Portugal",
  "Poland",
  "Czech Republic",
  "Singapore",
  "Malaysia",
  "Indonesia",
  "Philippines",
  "Thailand",
  "Vietnam",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "South Africa",
  "Kenya",
  "Nigeria",
  "Ghana",
  "Tanzania",
  "India",
  "Pakistan",
  "Bangladesh",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile"
].map((c) => ({ label: c, value: c }));

const businessTypes = [
  "Retail",
  "Wholesale",
  "Distribution",
  "E-commerce",
  "Warehousing",
  "Other"
].map((b) => ({ label: b, value: b }));

type ActivationFormProps = {
  token: string;
};

export function ActivationForm({ token }: ActivationFormProps) {
  const router = useRouter();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/profile/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, token })
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.error || "Activation failed");
      }

      // Persist activation context for personalized assessment results
      try {
        const activationContext = {
          contactName: (payload as any).name ?? "",
          companyName: (payload as any).companyName ?? "",
          businessType: (payload as any).businessType ?? "",
          country: (payload as any).country ?? ""
        };
        localStorage.setItem("activationContext", JSON.stringify(activationContext));
      } catch (e) {
        console.warn("Failed to persist activation context", e);
      }

      if (body?.demoMode) {
        router.push("/portal/dashboard");
        return;
      }

      const { email } = payload as { email?: string };
      if (email) {
        await signIn("email", {
          email,
          redirect: true,
          callbackUrl: "/portal/dashboard"
        });
      } else {
        router.push("/portal/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input name="name" label="Full name" required placeholder="Enter your full name" />
        <Input
          name="companyName"
          label="Company name"
          required
          placeholder="Enter your company name"
        />
        <Input
          name="email"
          type="email"
          label="Business email"
          required
          placeholder="Enter your business email"
        />
        <Select name="country" label="Country" required options={countries} />
        <Select name="businessType" label="Business type" required options={businessTypes} />
      </div>

      <div className="border rounded-xl bg-white">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-[#FE5E17]"
          onClick={() => setAdvancedOpen((prev) => !prev)}
        >
          <span>+ Add more details (recommended)</span>
          <span>{advancedOpen ? "▴" : "▾"}</span>
        </button>
        {advancedOpen ? (
          <div className="p-4 space-y-3 border-t bg-gray-50">
            <Input name="role" label="Role" placeholder="Your role" />
            <Input name="website" label="Website" placeholder="https://yourcompany.com" />
            <Input name="size" label="Company size" placeholder="e.g. 50-200" />
            <Input
              name="monthlyOrders"
              label="Monthly order volume"
              placeholder="e.g. 2500"
            />
          </div>
        ) : null}
      </div>

      <p className="text-center text-xs text-gray-500">
        Your data is stored securely and only used for your personalized portal.
      </p>

      {error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Activating..." : "Activate My Portal"}
      </Button>
    </form>
  );
}

