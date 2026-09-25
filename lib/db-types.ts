/**
 * TypeScript types mirroring the Supabase table columns 1:1 (snake_case, as
 * SQL returns them), plus small mapper functions that turn a DB row into the
 * existing app-facing shape (`BlogPost`, `Photo`, `Testimonial` from
 * content/*.ts) so downstream rendering components need no changes beyond
 * their data source. Each mapper also keeps the row `id` (not part of the
 * original content/*.ts types) because the admin panel needs it for
 * update/delete - it rides alongside the app type via an intersection.
 *
 * See supabase/schema.sql for the table definitions these mirror.
 */
import type { BlogCategory, BlogPost, BlogSection } from "@/content/blog";
import type { Article, GalleryCategory, Photo } from "@/content/events";
import type { Testimonial } from "@/content/testimonials";
import type { Vertical } from "@/content/homepage";

export type DbBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  category_label: string;
  date: string;
  read_time: number;
  author_name: string;
  author_avatar: string | null;
  cover_image: string | null;
  images: string[] | null;
  featured: boolean;
  sections: BlogSection[];
  created_at: string;
  updated_at: string;
};

export type DbEvent = {
  id: string;
  slug: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: string;
  date: string | null;
  location: string | null;
  is_featured: boolean;
  articles: Article[];
  photos: string[];
  created_at: string;
  updated_at: string;
};

export type DbTestimonial = {
  id: string;
  slug: string;
  name: string;
  role: string;
  institution: string;
  category: string;
  vertical: string;
  quote: string;
  photo_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminBlogPost = BlogPost & { id: string };
export type AdminEvent = Photo & { id: string; isFeatured: boolean };
export type AdminTestimonial = Testimonial & { id: string; sortOrder: number };

export function mapBlogPost(row: DbBlogPost): AdminBlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category as BlogCategory,
    categoryLabel: row.category_label,
    date: row.date,
    readTime: row.read_time,
    author: { name: row.author_name, avatar: row.author_avatar ?? undefined },
    coverImage: row.cover_image ?? undefined,
    images: row.images ?? [],
    featured: row.featured,
    sections: row.sections ?? [],
  };
}

export function mapEvent(row: DbEvent): AdminEvent {
  return {
    slug: row.slug,
    src: row.src,
    alt: row.alt,
    title: row.title,
    caption: row.caption,
    category: row.category as Exclude<GalleryCategory, "all">,
    date: row.date ?? undefined,
    location: row.location ?? undefined,
    articles: row.articles ?? [],
    photos: row.photos ?? [],
    id: row.id,
    isFeatured: row.is_featured,
  };
}

export function mapTestimonial(row: DbTestimonial): AdminTestimonial {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    institution: row.institution,
    category: row.category,
    vertical: row.vertical as Vertical,
    quote: row.quote,
    photoUrl: row.photo_url ?? undefined,
    sortOrder: row.sort_order,
  };
}
