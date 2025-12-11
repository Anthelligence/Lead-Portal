"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type AccountSettingsFormProps = {
  userId: string;
  name?: string | null;
  email?: string | null;
  allowEmailSignIn: boolean;
  isDemo: boolean;
};

export function AccountSettingsForm({
  userId,
  name,
  email,
  allowEmailSignIn,
  isDemo
}: AccountSettingsFormProps) {
  const [fields, setFields] = useState({
    name: name ?? "",
    email: email ?? ""
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: fields.name.trim(),
          email: fields.email.trim()
        })
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || "Could not save changes");
      }

      const message = body?.demoMode
        ? "Updated for this demo session. Changes are not persisted."
        : "Login details saved.";
      setStatus(message);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleSendLoginLink() {
    setSendingLink(true);
    setStatus(null);
    setError(null);

    try {
      if (!allowEmailSignIn) {
        throw new Error("Email sign-in is not configured yet.");
      }

      const result = await signIn("email", {
        email: fields.email.trim(),
        redirect: false,
        callbackUrl: "/portal"
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setStatus("Login link sent to your email address.");
    } catch (err: any) {
      setError(err.message || "Unable to send login link.");
    } finally {
      setSendingLink(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-col sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold font-heading">Account & login</h2>
            <p className="text-sm text-gray-600">
              Update the name and email tied to your login. We use passwordless email links for secure access.
            </p>
          </div>
          {isDemo ? (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              Demo mode
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full name"
            name="name"
            value={fields.name}
            onChange={(e) => setFields((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="How your name appears"
            icon="🧑‍💼"
          />
          <Input
            label="Login email"
            name="email"
            type="email"
            required
            value={fields.email}
            onChange={(e) => setFields((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="you@company.com"
            icon="✉️"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" disabled={saving} fullWidth>
            {saving ? "Saving..." : "Save login details"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={sendingLink || !fields.email}
            onClick={handleSendLoginLink}
          >
            {sendingLink ? "Sending..." : "Email me a login link"}
          </Button>
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
      </div>

      <div className="card p-5 space-y-3">
        <h3 className="text-base font-semibold font-heading">How login works</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>We rely on email-based login links instead of passwords.</li>
          <li>Updating your email here changes where login links are sent.</li>
          <li>
            If your organization uses a different auth provider, contact your admin to update your login method.
          </li>
        </ul>
        {!allowEmailSignIn ? (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            Email sign-in is not fully configured. Add EMAIL_SERVER and EMAIL_FROM to enable sending login links.
          </div>
        ) : null}
      </div>
    </form>
  );
}

