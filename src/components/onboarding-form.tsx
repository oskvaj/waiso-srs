"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createAccount = api.student.createAccount.useMutation({
    onSuccess: () => {
      router.push("/course");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createAccount.mutate({ name: name.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        autoFocus
        required
      />
      <Button
        type="submit"
        className="w-full"
        disabled={!name.trim() || createAccount.isPending}
      >
        {createAccount.isPending ? "Setting up..." : "Get started"}
      </Button>
    </form>
  );
}
