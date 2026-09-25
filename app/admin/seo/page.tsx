"use client";

import { useEffect, useState } from "react";
import { resolveSeo, seoPages, type DbSeoPage, type SeoFields, type SeoPage } from "@/content/seo";
import { supabase } from "@/lib/supabase";

const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-slate-400";
const fieldClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[15px] text-neutral-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none";

function SeoCard({ page, row }: { page: SeoPage; row?: DbSeoPage }) {
  const [form, setForm] = useState<SeoFields>(() => resolveSeo(page, row));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (key: keyof SeoFields) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus(null);
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    const { error } = await supabase.from("seo_pages").upsert({
      path: page.path,
      meta_title: form.metaTitle.trim(),
      meta_description: form.metaDescription.trim(),
      keywords: form.keywords.trim(),
      og_image: form.ogImage.trim(),
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setStatus(error ? { ok: false, text: error.message } : { ok: true, text: "Saved" });
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-neutral-900">{page.label}</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">{page.path}</span>
        </div>
        <div className="flex items-center gap-3">
          {status && (
            <span className={`text-sm ${status.ok ? "text-emerald-600" : "text-red-600"}`}>{status.text}</span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className={labelClass}>Meta title</span>
          <input
            type="text"
            value={form.metaTitle}
            onChange={(e) => set("metaTitle")(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Meta description</span>
          <textarea
            value={form.metaDescription}
            onChange={(e) => set("metaDescription")(e.target.value)}
            rows={3}
            className={`${fieldClass} rounded-3xl`}
          />
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Keywords (comma-separated)</span>
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => set("keywords")(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Social / OG image URL</span>
            <input
              type="text"
              value={form.ogImage}
              onChange={(e) => set("ogImage")(e.target.value)}
              placeholder="https://…"
              className={fieldClass}
            />
          </label>
        </div>
      </div>
    </section>
  );
}

export default function AdminSeoPage() {
  const [rows, setRows] = useState<Record<string, DbSeoPage> | null>(null);

  useEffect(() => {
    supabase
      .from("seo_pages")
      .select("*")
      .then(({ data }) => {
        setRows(Object.fromEntries((data ?? []).map((r: DbSeoPage) => [r.path, r])));
      });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-900">SEO</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Page title, description, keywords and social image for each page. Blank fields fall back to the defaults.
      </p>

      {rows === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-6">
          {seoPages.map((page) => (
            <SeoCard key={page.path} page={page} row={rows[page.path]} />
          ))}
        </div>
      )}
    </div>
  );
}
