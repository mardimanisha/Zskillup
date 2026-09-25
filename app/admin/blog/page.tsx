"use client";

import { useEffect, useState } from "react";
import { allCategories, type BlogCategory, type BlogSection } from "@/content/blog";
import { mapBlogPost, type AdminBlogPost } from "@/lib/db-types";
import { supabase } from "@/lib/supabase";
import { AdminFormField, inputClass, textareaClass } from "@/components/admin/AdminFormField";
import { AdminListTable } from "@/components/admin/AdminList";
import { ImageUrlField } from "@/components/admin/ImageUrlField";

type FormState = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  date: string;
  readTime: number;
  authorName: string;
  authorAvatar: string;
  coverImage: string;
  featured: boolean;
  sections: BlogSection[];
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  category: allCategories[0].value,
  categoryLabel: allCategories[0].label,
  date: new Date().toISOString().slice(0, 10),
  readTime: 5,
  authorName: "",
  authorAvatar: "",
  coverImage: "",
  featured: false,
  sections: [],
};

function toForm(post: AdminBlogPost): FormState {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    categoryLabel: post.categoryLabel,
    date: post.date,
    readTime: post.readTime,
    authorName: post.author.name,
    authorAvatar: post.author.avatar ?? "",
    coverImage: post.coverImage ?? "",
    featured: post.featured ?? false,
    sections: post.sections ?? [],
  };
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!fetchError && data) setPosts(data.map(mapBlogPost));
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

  const startEdit = (post: AdminBlogPost) => {
    setForm(toForm(post));
    setEditingId(post.id);
    setError(null);
  };

  const cancel = () => {
    setEditingId(null);
    setError(null);
  };

  const handleDelete = async (post: AdminBlogPost) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (deleteError) {
      window.alert(deleteError.message);
      return;
    }
    await load();
  };

  const updateSection = (i: number, patch: Partial<BlogSection>) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  };

  const addSection = () => {
    setForm((f) => ({
      ...f,
      sections: [...f.sections, { heading: "", body: "", image: "", imageAlt: "" }],
    }));
  };

  const removeSection = (i: number) => {
    setForm((f) => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));
  };

  const moveSection = (i: number, dir: -1 | 1) => {
    setForm((f) => {
      const target = i + dir;
      if (target < 0 || target >= f.sections.length) return f;
      const sections = [...f.sections];
      [sections[i], sections[target]] = [sections[target], sections[i]];
      return { ...f, sections };
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const row = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category,
      category_label: form.categoryLabel,
      date: form.date,
      read_time: Number(form.readTime) || 0,
      author_name: form.authorName.trim(),
      author_avatar: form.authorAvatar.trim() || null,
      cover_image: form.coverImage.trim() || null,
      featured: form.featured,
      sections: form.sections
        .filter((s) => s.heading.trim() || s.body.trim())
        .map((s) => ({
          heading: s.heading.trim(),
          body: s.body.trim(),
          ...(s.image?.trim() ? { image: s.image.trim() } : {}),
          ...(s.imageAlt?.trim() ? { imageAlt: s.imageAlt.trim() } : {}),
        })),
    };

    const result =
      editingId === "new"
        ? await supabase.from("blog_posts").insert(row)
        : await supabase.from("blog_posts").update(row).eq("id", editingId);

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
        <h1 className="text-xl font-bold text-neutral-900">Blog posts</h1>
        {editingId === null && (
          <button
            type="button"
            onClick={startNew}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            New post
          </button>
        )}
      </div>

      {editingId === null ? (
        loading ? (
          <p className="mt-6 text-sm text-neutral-400">Loading…</p>
        ) : (
          <div className="mt-6">
            <AdminListTable
              items={posts}
              keyField={(p) => p.id}
              onEdit={startEdit}
              onDelete={handleDelete}
              columns={[
                { header: "Title", render: (p) => <span className="font-medium text-neutral-900">{p.title}</span> },
                { header: "Slug", render: (p) => <span className="text-neutral-500">{p.slug}</span> },
                { header: "Date", render: (p) => p.date },
                {
                  header: "Featured",
                  render: (p) =>
                    p.featured ? (
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
          <h2 className="font-semibold text-neutral-900">{editingId === "new" ? "New post" : "Edit post"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Slug">
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="my-post-slug"
              />
            </AdminFormField>
            <AdminFormField label="Date">
              <input
                type="date"
                className={inputClass}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </AdminFormField>

          <AdminFormField label="Excerpt">
            <textarea
              className={textareaClass}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            />
          </AdminFormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Category">
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => {
                  const value = e.target.value as BlogCategory;
                  const label = allCategories.find((c) => c.value === value)?.label ?? value;
                  setForm((f) => ({ ...f, category: value, categoryLabel: label }));
                }}
              >
                {allCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormField label="Read time (minutes)">
              <input
                type="number"
                min={1}
                className={inputClass}
                value={form.readTime}
                onChange={(e) => setForm((f) => ({ ...f, readTime: Number(e.target.value) }))}
              />
            </AdminFormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Author name">
              <input
                className={inputClass}
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              />
            </AdminFormField>
            <AdminFormField label="Author avatar (optional)">
              <ImageUrlField value={form.authorAvatar} onChange={(url) => setForm((f) => ({ ...f, authorAvatar: url }))} />
            </AdminFormField>
          </div>

          <AdminFormField label="Cover image">
            <ImageUrlField value={form.coverImage} onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))} />
          </AdminFormField>

          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Featured
          </label>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-800">Sections</h3>
              <button type="button" onClick={addSection} className="text-sm font-medium text-neutral-700 hover:underline">
                + Add section
              </button>
            </div>

            <div className="mt-3 space-y-4">
              {form.sections.map((section, i) => (
                <div key={i} className="rounded-md border border-neutral-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Section {i + 1}
                    </span>
                    <div className="flex gap-2 text-xs">
                      <button type="button" onClick={() => moveSection(i, -1)} className="text-neutral-500 hover:underline">
                        Up
                      </button>
                      <button type="button" onClick={() => moveSection(i, 1)} className="text-neutral-500 hover:underline">
                        Down
                      </button>
                      <button type="button" onClick={() => removeSection(i)} className="text-red-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>

                  <AdminFormField label="Heading">
                    <input
                      className={inputClass}
                      value={section.heading}
                      onChange={(e) => updateSection(i, { heading: e.target.value })}
                    />
                  </AdminFormField>

                  <div className="mt-3">
                    <AdminFormField label="Body" hint="Separate paragraphs with a blank line.">
                      <textarea
                        className={textareaClass}
                        value={section.body}
                        onChange={(e) => updateSection(i, { body: e.target.value })}
                      />
                    </AdminFormField>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <AdminFormField label="Image (optional)">
                      <ImageUrlField value={section.image ?? ""} onChange={(url) => updateSection(i, { image: url })} />
                    </AdminFormField>
                    <AdminFormField label="Image alt text">
                      <input
                        className={inputClass}
                        value={section.imageAlt ?? ""}
                        onChange={(e) => updateSection(i, { imageAlt: e.target.value })}
                      />
                    </AdminFormField>
                  </div>
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
