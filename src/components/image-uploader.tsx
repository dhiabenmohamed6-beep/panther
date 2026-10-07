"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle, AlertCircle, Trash2, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export function ImageUploader() {
  const [images, setImages] = React.useState<UploadedImage[]>([]);
  const [existing, setExisting] = React.useState<{ filename: string; url: string }[]>([]);
  const [loadingExisting, setLoadingExisting] = React.useState(true);
  const [deletingName, setDeletingName] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadExisting = React.useCallback(async () => {
    setLoadingExisting(true);
    try {
      const res = await fetch("/api/admin/images", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load images");
      setExisting(json.images ?? []);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setLoadingExisting(false);
    }
  }, [toast]);

  React.useEffect(() => {
    void loadExisting();
  }, [loadExisting]);

  const handleDeleteExisting = async (filename: string) => {
    setDeletingName(filename);
    try {
      const res = await fetch(`/api/admin/images?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete image");
      setExisting((prev) => prev.filter((image) => image.filename !== filename));
      toast({ title: `${filename} deleted`, variant: "success" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setDeletingName(null);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Unsupported file type. Use JPG, PNG, WebP or GIF.";
    }
    if (file.size > MAX_SIZE) {
      return "File too large. Maximum size is 5MB.";
    }
    return null;
  };

  const handleFiles = (files: FileList | File[]) => {
    const newImages: UploadedImage[] = [];
    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        toast({ title: "Upload rejected", description: error, variant: "destructive" });
        return;
      }
      newImages.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
      });
    });
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const uploadImages = async () => {
    const pendingImages = images.filter((img) => img.status === "pending");
    if (pendingImages.length === 0) return;

    for (const img of pendingImages) {
      setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, status: "uploading" } : i)));

      try {
        const formData = new FormData();
        formData.append("file", img.file);

        const response = await fetch("/api/upload-image", { method: "POST", body: formData });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || "Upload failed");
        }

        const result = await response.json();
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id ? { ...i, status: "success", preview: result.url } : i
          )
        );
        toast({
          title: "Uploaded",
          description: `${img.file.name} is live`,
          variant: "success",
        });
      } catch (error) {
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? {
                  ...i,
                  status: "error",
                  error: error instanceof Error ? error.message : "Unknown error",
                }
              : i
          )
        );
        toast({
          title: "Upload failed",
          description: `Could not upload ${img.file.name}`,
          variant: "destructive",
        });
      }
    }
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  const hasPending = images.some((img) => img.status === "pending");
  const hasErrors = images.some((img) => img.status === "error");
  const pendingCount = images.filter((img) => img.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black">Upload images</h2>
        {images.length > 0 && (
          <Button
            variant="dangerLight"
            size="sm"
            onClick={clearAll}
            disabled={images.some((i) => i.status === "uploading")}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </Button>
        )}
      </div>

      <div
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors md:p-12",
          dragActive
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-black/15 bg-white hover:border-emerald-500/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Image drop zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-hidden="true"
        />
        <Upload className="mx-auto mb-4 h-10 w-10 text-emerald-600" aria-hidden="true" />
        <p className="mb-1 text-base font-semibold text-black">Drag your images here</p>
        <p className="mb-4 text-sm text-black/50">
          or click to browse (JPG, PNG, WebP, GIF - max 5MB)
        </p>
        <Button variant="light" size="sm" onClick={() => fileInputRef.current?.click()}>
          Choose files
        </Button>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-black">
            Files ({images.length})
            {hasErrors ? <span className="ml-2 text-xs text-red-600">Some uploads failed</span> : null}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className={cn(
                  "overflow-hidden rounded-xl border bg-white transition-colors",
                  img.status === "success" && "border-emerald-200",
                  img.status === "error" && "border-red-200",
                  img.status === "pending" && "border-amber-200",
                  img.status === "uploading" && "border-emerald-200"
                )}
              >
                <div className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.preview}
                    alt={img.file.name}
                    className="h-full w-full object-cover"
                  />
                  {img.status === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-600" />
                    </div>
                  )}
                  {img.status === "success" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/15">
                      <CheckCircle className="h-8 w-8 text-emerald-600" aria-hidden="true" />
                    </div>
                  )}
                  {img.status === "error" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/10">
                      <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-white/85 p-1 text-black/50 transition-colors hover:bg-white hover:text-red-600"
                    aria-label={`Remove ${img.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 p-3">
                  <p className="truncate text-sm font-medium text-black" title={img.file.name}>
                    {img.file.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-black/50">
                    <span>{(img.file.size / 1024).toFixed(1)} KB</span>
                    <span
                      className={cn(
                        img.status === "pending" && "text-amber-600",
                        img.status === "uploading" && "text-emerald-600",
                        img.status === "success" && "text-emerald-600",
                        img.status === "error" && "text-red-600"
                      )}
                    >
                      {img.status === "pending" && "Pending"}
                      {img.status === "uploading" && "Uploading"}
                      {img.status === "success" && "Uploaded"}
                      {img.status === "error" && "Failed"}
                    </span>
                  </div>
                  {img.error && (
                    <p className="truncate text-xs text-red-600" title={img.error}>
                      {img.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {hasPending && (
            <Button
              size="lg"
              className="w-full"
              onClick={uploadImages}
              disabled={images.some((i) => i.status === "uploading")}
            >
              <Upload className="h-5 w-5" aria-hidden="true" />
              Upload {pendingCount} image{pendingCount > 1 ? "s" : ""}
            </Button>
          )}
        </div>
      )}

      <div className="border-t border-black/10 pt-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-black">
          <FolderOpen className="h-4 w-4 text-black/35" aria-hidden="true" />
          Existing images in /public/images
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {loadingExisting ? (
            <p className="col-span-full text-center text-sm text-black/40">Loading images…</p>
          ) : existing.length === 0 ? (
            <p className="col-span-full text-center text-sm text-black/40">
              No images found in public/images.
            </p>
          ) : (
            existing.map((image) => (
              <div
                key={image.filename}
                className="group relative overflow-hidden rounded-xl border border-black/10 bg-white"
              >
                <div className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-100"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-white/0 opacity-0 transition-opacity group-hover:bg-white/70 group-hover:opacity-100">
                    <span className="px-2 text-center text-[10px] font-medium uppercase tracking-wider text-black/70">
                      {image.filename.replace(/\.[^/.]+$/, "")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-black/10 p-2">
                  <span className="truncate text-[10px] text-black/50">{image.filename}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteExisting(image.filename)}
                    disabled={deletingName === image.filename}
                    aria-label={`Delete ${image.filename}`}
                    className="h-7 w-7 shrink-0 text-red-600 hover:bg-red-50"
                  >
                    {deletingName === image.filename ? (
                      <AlertCircle className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <p className="mt-4 text-center text-sm text-black/40">
          Drop files into{" "}
          <code className="rounded border border-black/10 bg-black/[0.03] px-2 py-0.5 font-mono text-xs">
            public/images/
          </code>{" "}
          or use the uploader above.
        </p>
      </div>
    </div>
  );
}
