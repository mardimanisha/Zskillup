"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Section";
import { allCategories, blogPosts as dummyPosts, categoryColors, type BlogCategory, type BlogPost } from "@/content/blog";
import { mapBlogPost } from "@/lib/db-types";
import { supabase } from "@/lib/supabase";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CategoryPill({ category, label }: { category: BlogCategory; label: string }) {
  return (
    <span
      className={`inline-block w-fit self-start rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide ${categoryColors[category]}`}
    >
      {label}
    </span>
  );
}

function BlogGridCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/post?slug=${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card"
    >
      <div className="relative h-36 w-full overflow-hidden bg-[#eef0fc]">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <CategoryPill category={post.category} label={post.categoryLabel} />
        <h3 className="text-[0.9375rem] font-bold leading-[1.3] text-navy transition-colors group-hover:text-brand">
          {post.title}
        </h3>
        <p className="text-[0.75rem] text-muted">By {post.author.name}</p>
        <p className="text-[0.75rem] text-muted">
          {formatDate(post.date)} &nbsp;|&nbsp; {post.readTime} min read
        </p>
      </div>
    </Link>
  );
}

function InsightsHero({ blogPosts }: { blogPosts: readonly BlogPost[] }) {
  const slides = blogPosts.slice(0, 5);
  const [active, setActive] = useState(0);

  const goPrev = () => setActive((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setActive((i) => (i + 1) % slides.length);

  return (
    <div className="border-b border-line bg-gradient-to-b from-cloud to-white">
      <Container className="py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[0.8125rem] text-muted">
          <Link href="/" className="hover:text-navy">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-navy">Blog</span>
        </nav>

        <h1 className="mb-3 text-[1.5rem] font-extrabold tracking-tight text-navy sm:text-[1.875rem]">
          ZSkillup Blogs
        </h1>

        {slides.length > 0 && (
          <>
            {/* Carousel card */}
            <div className="relative">
              {/* Prev arrow */}
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous post"
                className="absolute -left-14 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card transition-colors hover:border-brand hover:text-brand sm:flex"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="10,3 5,8 10,13" />
                </svg>
              </button>

              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {slides.map((post) => (
                    <div key={post.slug} className="grid w-full shrink-0 gap-5 p-4 sm:grid-cols-2 sm:items-center sm:gap-6 sm:p-4">
                      <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-cloud sm:h-[200px]">
                        {post.coverImage && (
                          <Image
                            src={post.coverImage}
                            alt=""
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        )}
                      </div>

                      <div className="flex flex-col justify-center gap-1.5">
                        <p className="text-[0.8125rem] text-muted">
                          {post.categoryLabel} &nbsp;|&nbsp; {formatDate(post.date)} &nbsp;|&nbsp; {post.readTime} min read
                        </p>
                        <Link href={`/blog/post?slug=${post.slug}`} className="group">
                          <h2 className="text-[1.375rem] font-extrabold leading-[1.25] text-navy transition-colors group-hover:text-brand sm:text-[1.625rem]">
                            {post.title}
                          </h2>
                        </Link>
                        <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-body">
                          {post.excerpt}
                        </p>

                        <div className="mt-1 flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-[0.75rem] font-bold text-brand">
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <span className="text-[0.9375rem] font-semibold text-navy">{post.author.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next arrow */}
              <button
                type="button"
                onClick={goNext}
                aria-label="Next post"
                className="absolute -right-14 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card transition-colors hover:border-brand hover:text-brand sm:flex"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="6,3 11,8 6,13" />
                </svg>
              </button>
            </div>

            {/* Pagination dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-6 bg-navy" : "w-2 bg-line"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

function CategorySidebarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.875rem] font-semibold transition-colors ${
        active
          ? "border-brand/30 bg-brand/5 text-brand"
          : "border-line bg-white text-navy hover:border-brand/30 hover:text-brand"
      }`}
    >
      {label}
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <polyline points="6,3 11,8 6,13" />
      </svg>
    </button>
  );
}

export default function InsightsPage() {
  const [activeFilter, setActiveFilter] = useState<BlogCategory | "all">("all");
  const [blogPosts, setBlogPosts] = useState<readonly BlogPost[]>(dummyPosts); // dummy until admin adds real posts
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Failed to load blog posts", error);
        } else if (data && data.length > 0) {
          setBlogPosts(data.map(mapBlogPost));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPosts =
    activeFilter === "all"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeFilter);

  return (
    <>
      <InsightsHero blogPosts={blogPosts} />

      <div className="bg-white py-8 sm:py-10">
        <Container>
          <h2 className="text-[1.25rem] font-extrabold text-navy sm:text-[1.5rem]">
            Discover Blogs by <span className="text-brand">Categories</span>
          </h2>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row">
            {/* Sidebar */}
            <aside className="flex shrink-0 flex-col gap-2.5 lg:w-64">
              <CategorySidebarButton
                label="Latest Articles"
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              />
              {allCategories.map((c) => (
                <CategorySidebarButton
                  key={c.value}
                  label={c.label}
                  active={activeFilter === c.value}
                  onClick={() => setActiveFilter(c.value)}
                />
              ))}
            </aside>

            {/* Post grid */}
            <div className="flex-1">
              {loading ? (
                <div className="rounded-2xl border border-line bg-cloud py-14 text-center">
                  <p className="text-[0.9375rem] text-muted">Loading posts…</p>
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredPosts.map((p) => (
                    <BlogGridCard key={p.slug} post={p} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-line bg-cloud py-14 text-center">
                  <p className="text-[0.9375rem] text-muted">
                    No posts yet in this topic. Check back soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
