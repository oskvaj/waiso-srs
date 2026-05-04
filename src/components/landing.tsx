"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    await signIn("nodemailer", {
      email: email.trim(),
      redirect: false,
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="bg-theme-page flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="font-theme-heading text-theme-primary text-6xl font-bold tracking-tight">
            Waiso
          </h1>
          <p className="text-theme-muted text-lg">
            Remember what you learn. A spaced repetition platform built for
            lasting knowledge.
          </p>
        </div>

        {submitted ? (
          <div className="bg-theme-card border-theme-border rounded-xl border p-8 shadow-sm">
            <div className="space-y-2">
              <p className="font-theme-heading text-theme-text text-lg font-semibold">
                Check your email
              </p>
              <p className="text-theme-muted text-sm">
                We sent a sign-in link to{" "}
                <span className="text-theme-text font-medium">{email}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-theme-card border-theme-border rounded-xl border p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label
                  htmlFor="email"
                  className="text-theme-muted text-sm font-medium"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!email.trim() || loading}
              >
                {loading ? "Sending link..." : "Continue with email"}
              </Button>
              <p className="text-theme-muted text-xs">
                We&apos;ll send you a magic link to sign in. No password needed.
              </p>
            </form>
          </div>
        )}

        <p className="text-theme-disabled text-xs">
          Built on spaced repetition research by Ebbinghaus, Leitner &amp;
          Wozniak
        </p>
      </div>
    </main>
  );
}
