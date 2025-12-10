"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/brand/TopBar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ManualTokenPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setError("Enter a token to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/token/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: trimmed })
      });
      const data = await res.json();

      if (res.ok && data?.found) {
        // If the token has a public profile enabled, the downstream page will redirect.
        router.push(`/${trimmed}`);
      } else if (res.ok && !data?.found) {
        setError("Token not found. Please check and try again.");
      } else {
        setError(data?.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Unable to verify token right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDemo() {
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/token/demo", { method: "POST" });
      const body = await res.json();

      if (!res.ok || !body?.token) {
        throw new Error(body?.error || "Could not create a demo token right now.");
      }

      router.push(`/${body.token}`);
    } catch (err: any) {
      setError(err.message || "Unable to create a demo token right now.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-10 space-y-8">
      <TopBar />
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold text-[#FE5E17]">Manual activation</p>
        <h1 className="text-xl font-semibold font-heading">Enter your card token</h1>
        <p className="text-sm text-gray-600">Paste or type the token from your NFC card.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <Input
          label="Card token"
          name="token"
          placeholder="e.g. ctl-123-456"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        {error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Checking..." : "Continue"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={creating}
          onClick={handleCreateDemo}
        >
          {creating ? "Creating demo token..." : "Create demo token"}
        </Button>
      </form>

      <p className="text-center text-xs text-gray-500">Powered by COTIT 360°</p>
    </main>
  );
}


