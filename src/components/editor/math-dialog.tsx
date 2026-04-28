import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MathDialog({
  open,
  latex,
  onSave,
  onCancel,
}: {
  open: boolean;
  latex: string;
  onSave: (latex: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(latex);

  useEffect(() => {
    if (open) {
      setValue(latex);
    }
  }, [latex, open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>LaTeX formula</DialogTitle>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. x^{2} + \frac{a}{b}"
          className="font-mono text-sm"
          autoFocus
          autoCorrect="off"
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSave(value.trim());
            }
          }}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => value.trim() && onSave(value.trim())}
            disabled={!value.trim()}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
