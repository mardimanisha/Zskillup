"use client";

import { useEffect, useState } from "react";
import { badgeLabels, galleryFilters, type Article, type GalleryCategory } from "@/content/events";
import { mapEvent, type AdminEvent } from "@/lib/db-types";
import { supabase } from "@/lib/supabase";
import { AdminFormField, inputClass, textareaClass } from "@/components/admin/AdminFormField";
import { AdminListTable } from "@/components/admin/AdminList";
import { ImageUrlField } from "@/components/admin/ImageUrlField";

type EventCategory = Exclude<GalleryCategory, "all">;
const categoryOptions = galleryFilters.filter((f) => f.id !== "all") as { id: EventCategory; label: string }[];

type FormState = {
  slug: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: EventCategory;
  date: string;
  location: string;
  isFeatured: boolean;
  articles: Article[];
  photos: string[];
};

const emptyForm: FormState = {
  slug: "",
  src: "",
  alt: "",
  title: "",
  caption: "",
  category: categoryOptions[0].id,
  date: "",
  location: "",
  isFeatured: false,
  articles: [],
  photos: [],
};

function toForm(event: AdminEvent): FormState {
  return {
    slug: event.slug,
    src: event.src,
    alt: event.alt,
    title: event.title,
    caption: event.caption,
    category: event.category,
    date: event.date ?? "",
    location: event.location ?? "",
    isFeatured: event.isFeatured,
    articles: event.articles ?? [],
    photos: [...(event.photos ?? [])],
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!fetchError && data) setEvents(data.map(mapEvent));
        setLoading(false);
      });

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm(emptyForm);
    setEditingId("new");
    setError(null);
  };

  const startEdit = (event: AdminEvent) => {
    setForm(toForm(event));
    setEditingId(event.id);
    setError(null);
  };

  const cancel = () => {
    setEditingId(null);
    setError(null);
  };

  const handleDelete = async (event: AdminEvent) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from("events").delete().eq("id", event.id);
    if (deleteError) {
      window.alert(deleteError.message);
      return;
    }
    await load();
  };

  // Articles
  const updateArticle = (i: number, patch: Partial<Article>) => {
    setForm((f) => ({ ...f, articles: f.articles.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) }));
  };
  const addArticle = () => {
    setForm((f) => ({ ...f, articles: [...f.articles, { heading: "", body: "", image: "", imageAlt: "" }] }));
  };
  const removeArticle = (i: number) => {
    setForm((f) => ({ ...f, articles: f.articles.filter((_, idx) => idx !== i) }));
  };

  // Photos (plain URL list)
  const updatePhoto = (i: number, url: string) => {
    setForm((f) => ({ ...f, photos: f.photos.map((p, idx) => (idx === i ? url : p)) }));
  };
  const addPhoto = () => setForm((f) => ({ ...f, photos: [...f.photos, ""] }));
  const removePhoto = (i: number) => setForm((f) => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const row = {
      slug: form.slug.trim(),
      src: form.src.trim(),
      alt: form.alt.trim(),
      title: form.title.trim(),
      caption: form.caption.trim(),
      category: form.category,
      date: form.date.trim() || null,
      location: form.location.trim() || null,
      is_featured: form.isFeatured,
      articles: form.articles
        .filter((a) => a.heading.trim() || a.body.trim())
        .map((a) => ({
          heading: a.heading.trim(),
          body: a.body.trim(),
          ...(a.image?.trim() ? { image: a.image.trim() } : {}),
          ...(a.imageAlt?.trim() ? { imageAlt: a.imageAlt.trim() } : {}),
        })),
      photos: form.photos.map((p) => p.trim()).filter(Boolean),
    };

    const result =
      editingId === "new"
        ? await supabase.from("events").insert(row)
        : await supabase.from("events").update(row).eq("id", editingId);

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
        <h1 className="text-xl font-bold text-neutral-900">Events</h1>
        {editingId === null && (
          <button
            type="button"
            onClick={startNew}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            New event
          </button>
        )}
      </div>

      {editingId === null ? (
        loading ? (
          <p className="mt-6 text-sm text-neutral-400">Loading…</p>
        ) : (
          <div className="mt-6">
            <AdminListTable
              items={events}
              keyField={(e) => e.id}
              onEdit={startEdit}
              onDelete={handleDelete}
              columns={[
                { header: "Title", render: (e) => <span className="font-medium text-neutral-900">{e.title}</span> },
                { header: "Slug", render: (e) => <span className="text-neutral-500">{e.slug}</span> },
                { header: "Category", render: (e) => badgeLabels[e.category] ?? e.category },
                {
                  header: "Featured",
                  render: (e) =>
                    e.isFeatured ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        Featured
                      </span>
                    ) : (
                      ""
                    ),
                },
              ]}
            />
          </div>
        )
      ) : (
        <div className="mt-6 max-w-2xl space-y-5 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="font-semibold text-neutral-900">{editingId === "new" ? "New event" : "Edit event"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Slug">
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="my-event-slug"
              />
            </AdminFormField>
            <AdminFormField label="Category">
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as EventCategory }))}
              >
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </AdminFormField>
          </div>

          <AdminFormField label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </AdminFormField>

          <AdminFormField label="Caption">
            <textarea
              className={textareaClass}
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
            />
          </AdminFormField>

          <AdminFormField label="Main image" hint="Shown on the hero/gallery tile.">
            <ImageUrlField value={form.src} onChange={(url) => setForm((f) => ({ ...f, src: url }))} />
          </AdminFormField>

          <AdminFormField label="Image alt text">
            <input className={inputClass} value={form.alt} onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))} />
          </AdminFormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Date" hint='Free text, e.g. "Mar 15, 2024"'>
              <input className={inputClass} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </AdminFormField>
            <AdminFormField label="Location">
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </AdminFormField>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
            />
            Featured (shown in the homepage / events-page hero carousel)
          </label>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-800">Articles</h3>
              <button type="button" onClick={addArticle} className="text-sm font-medium text-neutral-700 hover:underline">
                + Add article
              </button>
            </div>

            <div className="mt-3 space-y-4">
              {form.articles.map((article, i) => (
                <div key={i} className="rounded-md border border-neutral-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Article {i + 1}
                    </span>
                    <button type="button" onClick={() => removeArticle(i)} className="text-xs text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>

                  <AdminFormField label="Heading">
                    <input
                      className={inputClass}
                      value={article.heading}
                      onChange={(e) => updateArticle(i, { heading: e.target.value })}
                    />
                  </AdminFormField>

                  <div className="mt-3">
                    <AdminFormField label="Body">
                      <textarea
                        className={textareaClass}
                        value={article.body}
                        onChange={(e) => updateArticle(i, { body: e.target.value })}
                      />
                    </AdminFormField>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <AdminFormField label="Image (optional)">
                      <ImageUrlField value={article.image ?? ""} onChange={(url) => updateArticle(i, { image: url })} />
                    </AdminFormField>
                    <AdminFormField label="Image alt text">
                      <input
                        className={inputClass}
                        value={article.imageAlt ?? ""}
                        onChange={(e) => updateArticle(i, { imageAlt: e.target.value })}
                      />
                    </AdminFormField>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-800">Additional photos</h3>
              <button type="button" onClick={addPhoto} className="text-sm font-medium text-neutral-700 hover:underline">
                + Add photo
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {form.photos.map((photo, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-1">
                    <ImageUrlField value={photo} onChange={(url) => updatePhoto(i, url)} />
                  </div>
                  <button type="button" onClick={() => removePhoto(i)} className="mt-2 text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

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
