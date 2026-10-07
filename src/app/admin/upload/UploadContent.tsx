"use client";

import React from "react";
import { ImageUploader } from "@/components/image-uploader";

export function UploadContent() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-950">Media</h1>
          <p className="mt-1 text-sm text-purple-950/50">
            Upload product images, athlete photos, and other assets
          </p>
        </div>
      </div>

      <ImageUploader />
    </div>
  );
}