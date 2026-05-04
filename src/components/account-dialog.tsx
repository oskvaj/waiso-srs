"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CircleUserRound, SquarePen } from "lucide-react";
import { NotificationToggle } from "./notification-toggle";
import { useTheme } from "./theme-provider";
import { api } from "@/trpc/react";

export function AccountDialog({
  email,
  initialName,
}: {
  email: string;
  initialName: string;
}) {
  const { mode, toggleMode } = useTheme();
  const [name, setName] = useState(initialName);
  const [saved, setSaved] = useState(true);
  const [editingName, setEditingName] = useState(false);

  const updateName = api.student.updateName.useMutation({
    onSuccess: () => setSaved(true),
  });

  const handleNameChange = (value: string) => {
    setName(value);
    setSaved(false);
  };

  const handleSaveName = () => {
    if (name.trim()) {
      updateName.mutate({ name: name.trim() });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="hover:cursor-pointer">
          <CircleUserRound className="text-theme-primary hover:text-theme-primary/70 size-8" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-theme-card border-theme-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-theme-heading text-lg">
            Account settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label className="text-theme-muted text-sm">Email</Label>
            <p className="text-theme-text text-sm">{email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-theme-muted text-sm">
              Display name
            </Label>
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  id="display-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Your name"
                  className="flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setName(initialName);
                    setSaved(true);
                    setEditingName(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleSaveName();
                    setEditingName(false);
                  }}
                  disabled={saved || updateName.isPending || !name.trim()}
                >
                  {updateName.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="text-theme-text hover:text-theme-primary flex w-full items-center gap-2 text-left text-sm transition-colors"
              >
                <span>{name || "Set your name"}</span>
                <SquarePen className="text-theme-muted size-3.5" />
              </button>
            )}
          </div>
          <div className="border-theme-border space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Dark mode</Label>
              <Switch checked={mode === "dark"} onCheckedChange={toggleMode} />
            </div>

            <div className="flex items-center justify-between">
              <NotificationToggle />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
