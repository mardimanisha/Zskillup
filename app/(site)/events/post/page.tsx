"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { asset } from "@/lib/asset";
import { badgeColors, badgeLabels, type Photo } from "@/content/events";
import { mapEvent } from "@/lib/db-types";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";
import { EventPhotoGrid } from "@/components/ui/EventPhotoGrid";

/**
 * Event detail page, read via ?slug= instead of a [slug] path segment - same
 * reasoning as app/blog/post/page.tsx: `output: "export"` needs every path
 * resolvable at build time, which admin-added events wouldn't be.
 */

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <Section tone="white">
          <Container>
            <p className="py-20 text-center text-[0.9375rem] text-muted">Loading event…</p>
          </Container>
        </Section>
      }
    >
      <EventDetailContent />
    </Suspense>
  );
}

function EventDetailContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [event, setEvent] = useState<Photo | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setEvent(null);
          return;
        }
        const mapped = mapEvent(data);
        setEvent(mapped);
        document.title = mapped.title;
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
            <p className="text-[0.9375rem] text-muted">This event could not be found.</p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3 text-[0.9375rem] font-semibold text-navy transition-colors hover:border-navy/40"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              All Events
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  if (event === undefined) {
    return (
      <Section tone="white">
        <Container>
          <p className="py-20 text-center text-[0.9375rem] text-muted">Loading event…</p>
        </Container>
      </Section>
    );
  }

  if (event === null) {
    return (
      <Section tone="white">
        <Container>
          <div className="py-20 text-center">
            <p className="text-[0.9375rem] text-muted">This event could not be found.</p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3 text-[0.9375rem] font-semibold text-navy transition-colors hover:border-navy/40"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              All Events
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  const badgeColor = badgeColors[event.category] ?? "bg-brand-soft text-brand";
  const badgeLabel = badgeLabels[event.category] ?? event.category;

  const articlePhotos = (event.articles ?? [])
    .filter((a) => a.image)
    .map((a) => ({ src: a.image!, alt: a.imageAlt ?? "", caption: a.heading }));
  const extraPhotos = (event.photos ?? []).map((src) => ({ src, alt: "" }));
  const allPhotos = [...articlePhotos, ...extraPhotos];

  return (
    <>
      {/* Hero image */}
      <Section tone="white" className="!py-0 !scroll-mt-0">
        <div className="p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-2xl" style={{minHeight: "clamp(320px, 52dvh, 480px)"}}>
          <Image
            src={asset(event.src)}
            alt={event.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
          {/* Back link */}
          <div className="absolute left-0 top-0 p-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[0.875rem] font-semibold text-white backdrop-blur-sm ring-1 ring-white/25 transition-colors hover:bg-white/25"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              All Events
            </Link>
          </div>
          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 px-8 pb-10 sm:px-12">
            <span className={`inline-block rounded-full px-3 py-1 text-[0.6875rem] font-semibold ${badgeColor}`}>
              {badgeLabel}
            </span>
            <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight text-white sm:text-[2.5rem]">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.9375rem] text-white/80">
              {event.date && (
                <span className="flex items-center gap-2">
                  <Icon name="calendar" className="h-4 w-4 shrink-0" />
                  {event.date}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-2">
                  <Icon name="pin" className="h-4 w-4 shrink-0" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>
        </div>
      </Section>

      {/* Articles + images */}
      <Section tone="white" className="!py-10 sm:!py-12 lg:!py-14">
        <Container>
          {/* Article text — side by side, left-aligned */}
          {event.articles && event.articles.length > 0 && (
            <div className="grid gap-10 sm:grid-cols-2 sm:gap-14">
              {event.articles.map((article) => (
                <div key={article.heading}>
                  <h2 className="text-[1.375rem] font-extrabold leading-snug text-navy sm:text-[1.625rem]">
                    {article.heading}
                  </h2>
                  <p className="mt-4 text-[1rem] leading-relaxed text-body">{article.body}</p>
                </div>
              ))}
            </div>
          )}

          {/* Photo gallery — article images + additional event photos, all together */}
          {allPhotos.length > 0 && (
            <div className="mt-10">
              <EventPhotoGrid photos={allPhotos} />
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
