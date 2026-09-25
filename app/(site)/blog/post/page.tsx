"use client";

import { Fragment, Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { blogPosts as dummyPosts, categoryColors, type BlogPost } from "@/content/blog";
import { mapBlogPost } from "@/lib/db-types";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";

/**
 * Blog detail page, read via ?slug= instead of a [slug] path segment.
 *
 * `output: "export"` requires every path segment to be resolvable at build
 * time (generateStaticParams). Admin-added posts don't exist at build time,
 * so a dynamic path segment is incompatible with "no rebuild to publish a
 * new post" - hence a static route reading the slug from the query string
 * and fetching client-side instead. See AGENTS.md / the admin panel brief.
 */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function slugifyHeading(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** First sentence of each section's body, used as a short key-highlight bullet. */
function firstSentence(body: string) {
  const match = body.match(/^[^.!?]*[.!?]/);
  return (match ? match[0] : body).trim();
}

export default function BlogPostPage() {
  return (
    <Suspense
      fallback={
        <Section tone="white">
          <Container>
            <p className="py-20 text-center text-[0.9375rem] text-muted">Loading article…</p>
          </Container>
        </Section>
      }
    >
      <BlogPostContent />
    </Suspense>
  );
}

function BlogPostContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  // Dummy posts are the fallback until the admin adds real ones.
  const dummyPost = dummyPosts.find((p) => p.slug === slug) ?? null;
  const dummyRelated = dummyPost
    ? dummyPosts.filter((p) => p.slug !== dummyPost.slug && p.category === dummyPost.category).slice(0, 3)
    : [];
  const [dbPost, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [dbRelated, setRelated] = useState<BlogPost[] | null>(null);
  const post = dbPost ?? (dummyPost ?? dbPost);
  const related = dbRelated ?? dummyRelated;

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setPost(dummyPost ? undefined : null);
          return;
        }
        const mapped = mapBlogPost(data);
        setPost(mapped);
        document.title = mapped.title;

        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("category", mapped.category)
          .neq("slug", mapped.slug)
          .limit(3);
        if (!cancelled) {
          setRelated((relatedData ?? []).map(mapBlogPost));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) {
    return (
      <Section tone="white">
        <Container>
          <div className="py-20 text-center">
            <p className="text-[0.9375rem] text-muted">This article could not be found.</p>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3 text-[0.9375rem] font-semibold text-navy transition-colors hover:border-navy/40"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              Back to All Insights
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  if (post === undefined) {
    return (
      <Section tone="white">
        <Container>
          <p className="py-20 text-center text-[0.9375rem] text-muted">Loading article…</p>
        </Container>
      </Section>
    );
  }

  if (post === null) {
    return (
      <Section tone="white">
        <Container>
          <div className="py-20 text-center">
            <p className="text-[0.9375rem] text-muted">This article could not be found.</p>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3 text-[0.9375rem] font-semibold text-navy transition-colors hover:border-navy/40"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              Back to All Insights
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  const pillStyle = categoryColors[post.category] ?? "bg-brand-soft text-brand";

  const sections = post.sections ?? [];
  const toc = sections.map((s) => ({ heading: s.heading, id: slugifyHeading(s.heading) }));
  const keyHighlights = sections.map((s) => firstSentence(s.body));

  /* A single horizontal row of 2-3 images, pooled from the sections' own
     images, placed once part-way through the article instead of on every section. */
  const imageRow = sections
    .filter((s) => s.image)
    .slice(0, 3)
    .map((s) => ({ src: s.image!, alt: s.imageAlt ?? s.heading }));

  return (
    <>
      {/* Hero */}
      <Section tone="white" className="!py-0 !scroll-mt-0">
        <div className="p-4 sm:p-5">
          <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-navy">
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent" />

            {/* Back link */}
            <div className="absolute left-0 top-0 p-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[0.875rem] font-semibold text-white backdrop-blur-sm ring-1 ring-white/25 transition-colors hover:bg-white/25"
              >
                <Icon name="chevronLeft" className="h-4 w-4" />
                All Insights
              </Link>
            </div>

            {/* Title overlay */}
            <div className="absolute inset-x-0 bottom-0 px-8 pb-10 sm:px-12">
              <span className={`inline-block rounded-full px-3 py-1 text-[0.6875rem] font-semibold ${pillStyle}`}>
                {post.categoryLabel}
              </span>
              <h1 className="mt-3 max-w-3xl text-[1.75rem] font-extrabold leading-tight text-white sm:text-[2.5rem]">
                {post.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.9375rem] text-white/75">
                <span className="flex items-center gap-2">
                  <Icon name="users" className="h-4 w-4 shrink-0" />
                  {post.author.name}
                </span>
                <span>{formatDate(post.date)}</span>
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Article body */}
      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-muted">
              <Link href="/" className="hover:text-navy">
                Home
              </Link>
              <span>&gt;</span>
              <Link href="/blog" className="hover:text-navy">
                Blog
              </Link>
              <span>&gt;</span>
              <span className="font-semibold text-navy">{post.categoryLabel}</span>
            </nav>

            {(toc.length > 0 || keyHighlights.length > 0) && (
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Table of contents */}
                {toc.length > 0 && (
                  <div className="rounded-2xl border border-line bg-cloud/60 p-5">
                    <h2 className="text-[0.9375rem] font-extrabold text-navy">Table of Contents</h2>
                    <ul className="mt-3 space-y-2">
                      {toc.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="text-[0.875rem] text-brand transition-colors hover:text-brand-deep hover:underline"
                          >
                            {item.heading}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key highlights */}
                {keyHighlights.length > 0 && (
                  <div className="rounded-2xl border border-line bg-cloud/60 p-5">
                    <h2 className="text-[0.9375rem] font-extrabold text-navy">Key Highlights</h2>
                    <ul className="mt-3 space-y-2">
                      {keyHighlights.map((point, i) => (
                        <li key={i} className="flex gap-2 text-[0.875rem] leading-relaxed text-body">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Intro excerpt */}
            <p className="mt-8 text-[1.0625rem] leading-relaxed text-body">{post.excerpt}</p>
          </div>

          {/* Content sections — article text, then a full-width image row, repeating */}
          {sections.length > 0 && (
            <div className="mx-auto mt-14 max-w-3xl space-y-12">
              {sections.map((section, i) => (
                <Fragment key={section.heading}>
                  <div id={slugifyHeading(section.heading)} className="scroll-mt-24">
                    <h2 className="text-[1.375rem] font-extrabold leading-snug text-navy sm:text-[1.625rem]">
                      {section.heading}
                    </h2>
                    {section.body.split("\n\n").map((paragraph, j) => (
                      <p key={j} className="mt-4 text-[1rem] leading-relaxed text-body">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* One horizontal row of images, part-way through the article */}
                  {i === 0 && imageRow.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-3">
                      {imageRow.map((img) => (
                        <div key={img.src} className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          )}

          {/* Additional images added in the admin panel */}
          {(post.images?.length ?? 0) > 0 && (
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {post.images!.map((src, i) => (
                  <div key={`${src}-${i}`} className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={src}
                      alt={`${post.title} — image ${i + 1}`}
                      fill
                      sizes="(min-width: 768px) 384px, 100vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back CTA */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3 text-[0.9375rem] font-semibold text-navy transition-colors hover:border-navy/40"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              Back to All Insights
            </Link>
          </div>
        </Container>
      </Section>

      {/* Related posts */}
      {related.length > 0 && (
        <Section tone="cloud">
          <Container>
            <h2 className="text-[1.125rem] font-extrabold text-navy">More in {post.categoryLabel}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/post?slug=${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-[#eef0fc]">
                    {p.coverImage && (
                      <Image
                        src={p.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <h3 className="text-[1rem] font-bold leading-[1.3] text-navy transition-colors group-hover:text-brand">
                      {p.title}
                    </h3>
                    <p className="text-[0.8125rem] leading-relaxed text-body line-clamp-2">{p.excerpt}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[0.75rem] text-muted">
                        {formatDate(p.date)} · {p.readTime} min read
                      </p>
                      <span className="text-[0.8125rem] font-semibold text-brand transition-colors group-hover:text-brand-deep">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
