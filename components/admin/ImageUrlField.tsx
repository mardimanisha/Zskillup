"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { inputClass } from "./AdminFormField";

/**
 * A URL text input plus a file-upload alternative. Uploading sends the file
 * to the public `media` Storage bucket (see supabase/schema.sql) and fills
 * the URL field with the resulting public URL; pasting a URL directly works
 * too, for images already hosted elsewhere.
 */
export function ImageUrlField({
  value,
  onChange,
  placeholder = "https://... or upload below",
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
  };

  return (
    <div className="space-y-1.5">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
          className="text-xs text-neutral-500"
        />
        {uploading && <span className="text-xs text-neutral-400">Uploading…</span>}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview only, arbitrary remote URLs
        <img src={value} alt="" className="h-20 w-20 rounded object-cover ring-1 ring-neutral-200" />
      )}
    </div>
  );
}
