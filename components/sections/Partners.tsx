"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { partners, partnerTabs, type Partner } from "@/content/partners";
import { partnerStats, publishable } from "@/content/stats";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 08 - PARTNERS
 *
 * The brief's overriding objective: "this section needs to be scalable. We should
 * be able to go from 20 to 100+ institutions/companies later without requiring
 * any redesign of the homepage."
 *
 * How that is met:
 *   - a three-row marquee splits entries evenly across the rows, and simply
 *     absorbs more by growing each row if the source list ever grows;
 *   - every tile is the same fixed size, so logos never render at mixed scales;
 *   - the homepage communicates scale and quality of network, not a directory.
 *
 * Both tab panels are rendered into the HTML (the inactive one is `hidden`, not
 * removed), satisfying: "Carousel content for Partners, Testimonials and Events
 * must remain present in crawlable/rendered HTML."
 *
 * This is the ONLY place corporate credibility statistics appear.
 *
 * The tab is "Industry & Hiring Network" rather than "Hiring Partners", because
 * not every company shown is formally a hiring partner.
 *
 * The two rows run as a continuous marquee (top left-to-right, bottom
 * right-to-left, `.partner-track` in globals.css) rather than the earlier
 * manual snap-scroll - so the old prev/next buttons, which drove that
 * scroller's `scrollLeft` directly, no longer apply and were removed with
 * the interaction they belonged to. Hovering (or focusing) a row's tab panel
 * pauses both its rows in place; `prefers-reduced-motion` freezes them and
 * swaps in a manual scroller.
 */

export function Partners() {
  const [active, setActive] = useState<string>(partnerTabs[0].id);
  const activeTab = partnerTabs.find((tab) => tab.id === active) ?? partnerTabs[0];
  const stats = publishable(partnerStats);

  return (
    <Section id="partners" tone="white" labelledBy="partners-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Eyebrow tone="gold" rule="above">
              {activeTab.eyebrow}
            </Eyebrow>
            <Heading
              id="partners-heading"
              plain={partners.headline.plain}
              accent={partners.headline.accent}
              accentTone="gold"
              className="mt-6"
            />
            <Lede className="mt-6 max-w-[40ch] text-[0.9375rem] sm:text-base">
              {partners.supporting}
            </Lede>

            {stats.length > 0 ? (
              <dl className="mt-10 grid grid-cols-3 gap-x-4">
                {stats.map((stat, i) => (
                  <div key={stat.label} className={i > 0 ? "border-l border-line pl-4" : ""}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-[1.25rem] font-extrabold tracking-tight text-gold sm:text-[1.5rem]">
                        {stat.value}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 block text-[0.75rem] leading-snug text-body"
                      >
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div role="tablist" aria-label="Partner categories" className="flex flex-wrap gap-2">
                {partnerTabs.map((tab) => {
                  const selected = tab.id === active;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-selected={selected}
                      aria-controls={`panel-${tab.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActive(tab.id)}
                      className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-[0.9375rem] font-semibold transition-colors ${
                        selected
                          ? "border-[#f0e2cf] bg-gold-soft text-navy"
                          : "border-line bg-white text-body hover:border-navy/20 hover:text-navy"
                      }`}
                    >
                      <Icon
                        name={tab.id === "institutional" ? "graduation" : "briefcase"}
                        className="h-4 w-4"
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {partnerTabs.map((tab) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={`panel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
                hidden={tab.id !== active}
                className="mt-6"
              >
                <PartnerScroller label={tab.label} partners={tab.partners} />
              </div>
            ))}

            {/* Static note, deliberately not a link or button. mt-auto pins it to
                the column's bottom so it lines up with the left column's last
                line (the grid stretches both columns to the same height by
                default) instead of trailing right after the logos with a gap
                of dead space below. */}
            <p className="mt-auto pt-6 text-right text-[0.9375rem] font-medium tracking-wide text-muted">
              {partners.more}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Slow and readable, per the brief's 30-45px/s range.
const MARQUEE_SPEED_PX_PER_SEC = 36;

/**
 * Fixed tile size (not stretchy) so items never resize during the animation.
 * Sized down from the original two-row dimensions - three rows at that size
 * ran noticeably taller than the left column's text/stats, so both are
 * scaled back to keep the two sides visually balanced.
 */
const TILE_WIDTH = "w-[9rem] sm:w-[9.75rem]";
const TILE_HEIGHT = "h-[6.25rem] sm:h-[6.75rem]";

/**
 * The marquee loop only reads as continuous if one copy of a row's tiles is
 * already wider than the visible panel - otherwise the track (original +
 * clone) is narrower than the panel and empty space shows through before it
 * loops. The panel tops out at the container's 8/12-column share of the
 * 1240px max width (~800px); at ~150px/tile that needs 6+ tiles, so short
 * rows are cycled up to this floor rather than shown at their natural length.
 */
const MIN_TILES_PER_ROW = 6;

/** Repeats a row's partners end-to-end until it reaches the minimum tile count. */
function padRow(row: readonly Partner[], min: number): Partner[] {
  if (row.length === 0) return [];
  const padded: Partner[] = [];
  while (padded.length < min) {
    padded.push(...row);
  }
  return padded;
}

/**
 * Three-row marquee: the list is split into three roughly-equal chunks, one
 * per row, alternating scroll direction (top and bottom reversed, middle
 * not) so adjacent rows never drift in lockstep. Each row is its own
 * independent track, so the rows can differ in width/duration without
 * affecting one another.
 */
function PartnerScroller({
  label,
  partners: list,
}: {
  label: string;
  partners: readonly Partner[];
}) {
  const perRow = Math.ceil(list.length / 3);
  const top = padRow(list.slice(0, perRow), MIN_TILES_PER_ROW);
  const middle = padRow(list.slice(perRow, perRow * 2), MIN_TILES_PER_ROW);
  const bottom = padRow(list.slice(perRow * 2, perRow * 3), MIN_TILES_PER_ROW);

  return (
    <div
      className="partner-marquee relative overflow-hidden"
      role="group"
      aria-label={`${label} logos`}
      tabIndex={0}
    >
      <PartnerRow partners={top} rowKey="top" reverse />
      <PartnerRow partners={middle} rowKey="middle" />
      <PartnerRow partners={bottom} rowKey="bottom" reverse />
    </div>
  );
}

function PartnerRow({
  partners: row,
  rowKey,
  reverse = false,
}: {
  partners: readonly Partner[];
  rowKey: string;
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState(40);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // The track is two copies wide; half its rendered width is exactly one
    // loop. Measuring it (rather than hard-coding a duration) keeps the
    // speed constant across breakpoints and if the partner list changes.
    const measure = () => {
      const distance = el.scrollWidth / 2;
      setDuration(distance / MARQUEE_SPEED_PX_PER_SEC);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={trackRef}
      className={`partner-track w-max flex gap-3 pb-1 ${reverse ? "partner-track-reverse" : ""} ${rowKey !== "top" ? "mt-3" : ""}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {row.map((partner, i) => (
        <li key={`${rowKey}-original-${i}-${partner.name}`} className={TILE_WIDTH}>
          <PartnerTile partner={partner} />
        </li>
      ))}
      <div aria-hidden="true" className="partner-clone contents">
        {row.map((partner, i) => (
          <li key={`${rowKey}-clone-${i}-${partner.name}`} className={TILE_WIDTH}>
            <PartnerTile partner={partner} />
          </li>
        ))}
      </div>
    </ul>
  );
}

/**
 * A single partner tile - the logo alone, centred and contained.
 *
 * Every tile is the same fixed size and the logo fills the padded box inside it
 * with `object-contain`, so wide wordmarks and near-square crests both keep their
 * own aspect ratio and read at a consistent visual weight.
 *
 * The name is no longer shown, so it lives in the image's alt text instead (the
 * crawlable/screen-reader label). When a partner has no artwork yet the tile falls
 * back to a plain wordmark of the name in the logo's place, so it never looks empty.
 */
function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <div className={`flex ${TILE_HEIGHT} items-center justify-center rounded-tile border border-line bg-white px-4 py-3 shadow-card`}>
      {partner.logo ? (
        <Image
          src={asset(partner.logo)}
          alt={partner.name}
          width={186}
          height={140}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          className={`text-center leading-tight font-extrabold tracking-tight text-navy ${
            partner.name.length <= 12 ? "text-[1.125rem]" : "line-clamp-3 text-[0.875rem]"
          }`}
        >
          {partner.name}
        </span>
      )}
    </div>
  );
}
