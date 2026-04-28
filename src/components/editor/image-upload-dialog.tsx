import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadFiles } from "@/lib/uploadthing";
import { ImagePlus, Loader2 } from "lucide-react";

export function ImageUploadDialog({
  open,
  onUpload,
  onCancel,
}: {
  open: boolean;
  onUpload: (url: string) => void;
  onCancel: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const res = await uploadFiles("moduleImage", { files: [file] });
      const url = res[0]?.ufsUrl;
      if (url) {
        onUpload(url);
      } else {
        setError("Upload failed");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setError("");
          onCancel();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border-theme-border text-theme-muted hover:border-theme-primary hover:text-theme-primary flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors hover:cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="size-8 animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus className="size-8" />
              <span className="text-sm font-medium">
                Click to select an image
              </span>
              <span className="text-xs">Max 4MB</span>
            </>
          )}
        </button>

        {error && <p className="text-theme-danger text-sm">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
