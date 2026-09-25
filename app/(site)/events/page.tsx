"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { badgeColors, badgeLabels, inAction, type Photo } from "@/content/events";
import { mapEvent } from "@/lib/db-types";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";

export default function EventsPage() {
  const [featured, setFeatured] = useState<Photo | null>(null);
  const [gallery, setGallery] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setLoading(false);
          return;
        }
        const rows = data.map(mapEvent);
        const featuredRows = rows.filter((r) => r.isFeatured);
        const galleryRows = rows.filter((r) => !r.isFeatured);
        setFeatured(featuredRows[0] ?? rows[0] ?? null);
        setGallery(galleryRows.length > 0 ? galleryRows : rows.slice(1));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Section tone="white">
        <Container>
          <p className="py-20 text-center text-[0.9375rem] text-muted">Loading events…</p>
        </Container>
      </Section>
    );
  }

  if (!featured) {
    return (
      <Section tone="white">
        <Container>
          <p className="py-20 text-center text-[0.9375rem] text-muted">No events yet. Check back soon.</p>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Hero: Featured Event */}
      <Section tone="lavender" className="!py-0 !scroll-mt-0">
        <Container className="!max-w-none !px-4 py-4 sm:!px-5 sm:py-5">
          {/* Featured card — image fades into white left panel */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-navy/5" style={{minHeight: "clamp(360px, 55dvh, 520px)"}}>
            {/* Image fills the right ~65%, absolutely positioned */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-[65%]">
              <Image
                src={asset(featured.src)}
                alt={featured.alt}
                fill
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-cover object-center"
                priority
              />
              {/* White fade gradient — left edge blends into card background */}
              <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-white via-white/80 to-transparent" />
              {/* Handwritten overlay */}
              <p
                aria-hidden="true"
                className="handwritten absolute top-6 right-7 -rotate-[8deg] text-right text-[1.1rem] leading-snug text-white/90 drop-shadow"
              >
                Ideas<br />People<br />Opportunities
              </p>
              {/* Large circular play button, centered on visible image area */}
              <button
                type="button"
                aria-label="Watch highlights video"
                className="absolute right-[28%] top-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm ring-2 ring-white/50 transition-colors hover:bg-white/35"
              >
                <Icon name="play" className="h-6 w-6 translate-x-0.5" />
              </button>
            </div>

            {/* Text content — breaks out to full viewport width (independent of the card's own inset) so its inner gutter lines up exactly with the page Container below. Inline styles used for the breakout so it doesn't depend on a transform utility being composed correctly. */}
            <div className="absolute inset-y-0 z-10 h-full" style={{ left: "50%", width: "100vw", transform: "translateX(-50%)" }}>
            <div className="mx-auto flex h-full w-full max-w-[1240px] items-center px-5 sm:px-8">
            <div className="flex w-full flex-col justify-center py-10 lg:w-[44%] lg:py-14">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-[0.8125rem] font-semibold uppercase tracking-wide text-brand">
                <Icon name="star" className="h-3.5 w-3.5" />
                {inAction.featuredBadge}
              </span>

              <h2 className="mt-5 text-[1.75rem] font-extrabold leading-tight text-navy sm:text-[2.25rem]">
                {featured.title}
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.9375rem] text-body">
                {featured.date && (
                  <span className="flex items-center gap-2">
                    <Icon name="calendar" className="h-4 w-4 shrink-0 text-brand" />
                    {featured.date}
                  </span>
                )}
                {featured.location && (
                  <span className="flex items-center gap-2">
                    <Icon name="pin" className="h-4 w-4 shrink-0 text-brand" />
                    {featured.location}
                  </span>
                )}
              </div>

              <p className="mt-4 max-w-[32ch] text-[0.9375rem] leading-relaxed text-body">
                {featured.caption}
              </p>

              <div className="mt-7 flex flex-nowrap items-center gap-3 sm:gap-4">
                <a
                  href="#all-events"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 text-[0.875rem] font-semibold text-white transition-opacity hover:opacity-90 sm:px-7 sm:text-[0.9375rem]"
                >
                  View Full Album
                  <Icon name="arrowRight" className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-navy/25 px-4 py-3 text-[0.875rem] font-semibold text-navy transition-colors hover:border-navy/50 sm:px-6 sm:text-[0.9375rem]"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-navy/30">
                    <Icon name="play" className="h-3.5 w-3.5 translate-x-px" />
                  </span>
                  Watch Highlights
                </button>
              </div>
            </div>
            </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Gallery grid */}
      <Section id="all-events" tone="white" labelledBy="all-events-heading" className="!pt-10 sm:!pt-12 lg:!pt-14">
        <Container>
          <h2 id="all-events-heading" className="text-[1.375rem] font-extrabold text-navy sm:text-2xl">
            More Events &amp; Moments
          </h2>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((photo) => {
              const badgeColor = badgeColors[photo.category] ?? "bg-brand-soft text-brand";
              const badgeLabel = badgeLabels[photo.category] ?? photo.category;
              return (
                <li key={photo.slug}>
                  <article className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-navy/5 transition-shadow hover:shadow-md">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={asset(photo.src)}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-5 pb-5 pt-4">
                      {photo.date && (
                        <p className="flex items-center gap-1.5 text-[0.75rem] text-muted">
                          <Icon name="calendar" className="h-3 w-3 shrink-0" />
                          {photo.date}
                        </p>
                      )}
                      <h3 className="mt-1.5 text-[1rem] font-bold leading-snug text-navy">
                        {photo.title}
                      </h3>
                      <p className="mt-1 text-[0.8125rem] leading-snug text-body">
                        {photo.caption}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-[0.6875rem] font-semibold ${badgeColor}`}>
                          {badgeLabel}
                        </span>
                        <a
                          href={`/events/post?slug=${photo.slug}`}
                          className="flex items-center gap-1 text-[0.8125rem] font-semibold text-brand hover:underline"
                        >
                          View Album
                          <Icon name="arrowRight" className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
    </>
  );
}
