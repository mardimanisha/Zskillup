"use client";

import { useEffect, useState } from "react";
import type { Vertical } from "@/content/homepage";
import { mapTestimonial, type AdminTestimonial } from "@/lib/db-types";
import { supabase } from "@/lib/supabase";
import { AdminFormField, inputClass, textareaClass } from "@/components/admin/AdminFormField";
import { AdminListTable } from "@/components/admin/AdminList";
import { ImageUrlField } from "@/components/admin/ImageUrlField";

const verticals: { id: Vertical; label: string }[] = [
  { id: "commerce", label: "Commerce" },
  { id: "institutions", label: "Institutions" },
  { id: "prephasz", label: "Prephasz" },
];

type FormState = {
  slug: string;
  name: string;
  role: string;
  institution: string;
  category: string;
  vertical: Vertical;
  quote: string;
  photoUrl: string;
  sortOrder: number;
};

const emptyForm: FormState = {
  slug: "",
  name: "",
  role: "",
  institution: "",
  category: "",
  vertical: "commerce",
  quote: "",
  photoUrl: "",
  sortOrder: 0,
};

function toForm(t: AdminTestimonial): FormState {
  return {
    slug: t.slug,
    name: t.name,
    role: t.role,
    institution: t.institution,
    category: t.category,
    vertical: t.vertical,
    quote: t.quote,
    photoUrl: t.photoUrl ?? "",
    sortOrder: t.sortOrder,
  };
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (!fetchError && data) setItems(data.map(mapTestimonial));
        setLoading(false);
      });

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm({ ...emptyForm, sortOrder: items.length });
    setEditingId("new");
    setError(null);
  };

  const startEdit = (t: AdminTestimonial) => {
    setForm(toForm(t));
    setEditingId(t.id);
    setError(null);
  };

  const cancel = () => {
    setEditingId(null);
    setError(null);
  };

  const handleDelete = async (t: AdminTestimonial) => {
    if (!window.confirm(`Delete testimonial from "${t.name}"? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", t.id);
    if (deleteError) {
      window.alert(deleteError.message);
      return;
    }
    await load();
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const row = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      role: form.role.trim(),
      institution: form.institution.trim(),
      category: form.category.trim(),
      vertical: form.vertical,
      quote: form.quote.trim(),
      photo_url: form.photoUrl.trim() || null,
      sort_order: Number(form.sortOrder) || 0,
    };

    const result =
      editingId === "new"
        ? await supabase.from("testimonials").insert(row)
        : await supabase.from("testimonials").update(row).eq("id", editingId);

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setEditingId(null);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Testimonials</h1>
        {editingId === null && (
          <button
            type="button"
            onClick={startNew}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            New testimonial
          </button>
        )}
      </div>

      {editingId === null ? (
        loading ? (
          <p className="mt-6 text-sm text-neutral-400">Loading…</p>
        ) : (
          <div className="mt-6">
            <AdminListTable
              items={items}
              keyField={(t) => t.id}
              onEdit={startEdit}
              onDelete={handleDelete}
              columns={[
                { header: "Name", render: (t) => <span className="font-medium text-neutral-900">{t.name}</span> },
                { header: "Institution", render: (t) => t.institution },
                { header: "Vertical", render: (t) => t.vertical },
                { header: "Order", render: (t) => t.sortOrder },
              ]}
            />
          </div>
        )
      ) : (
        <div className="mt-6 max-w-2xl space-y-5 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="font-semibold text-neutral-900">{editingId === "new" ? "New testimonial" : "Edit testimonial"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Slug">
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="learner-slug"
              />
            </AdminFormField>
            <AdminFormField label="Sort order" hint="Lower numbers appear first.">
              <input
                type="number"
                className={inputClass}
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              />
            </AdminFormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Name">
              <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </AdminFormField>
            <AdminFormField label="Role">
              <input className={inputClass} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
            </AdminFormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Institution">
              <input
                className={inputClass}
                value={form.institution}
                onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
              />
            </AdminFormField>
            <AdminFormField label="Category label" hint='e.g. "Institutional Program"'>
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Vertical">
            <select
              className={inputClass}
              value={form.vertical}
              onChange={(e) => setForm((f) => ({ ...f, vertical: e.target.value as Vertical }))}
            >
              {verticals.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Quote">
            <textarea className={textareaClass} value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} />
          </AdminFormField>

          <AdminFormField label="Photo (optional)" hint="Falls back to a monogram avatar when empty.">
            <ImageUrlField value={form.photoUrl} onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))} />
          </AdminFormField>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
