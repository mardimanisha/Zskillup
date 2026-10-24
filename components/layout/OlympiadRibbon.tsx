"use client";

import { useSyncExternalStore } from "react";

// Landing page is proxied from the Olympiad project (see rewrites in vercel.json).
const OLYMPIAD_HREF = "/National-Commerce-Olympiad-2026";
// Start time is not confirmed yet; 10:00 IST is a placeholder for the countdown.
const TARGET = new Date("2026-12-20T10:00:00+05:30").getTime();

const UNITS = ["d", "h", "m", "s"] as const;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000);

function Headline({ hidden }: { hidden?: boolean }) {
  return (
    <p
      aria-hidden={hidden || undefined}
      className="shrink-0 pr-10 text-xs font-semibold whitespace-nowrap sm:pr-16 sm:text-[0.8125rem]"
    >
      National Commerce Olympiad 2026 ·{" "}
      <span className="text-sm font-extrabold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5),0_0_6px_rgba(245,158,11,0.45)] sm:text-[0.9375rem]">
        20 December 2026
      </span>
    </p>
  );
}

/**
 * Announcement ribbon above the header. The headline scrolls right to left while the
 * live countdown and the register CTA stay fixed on the right.
 */
export function OlympiadRibbon() {
  // `null` on the server and during hydration, so the markup matches before ticking.
  const now = useSyncExternalStore(subscribe, nowInSeconds, () => null);
  const remaining = now === null ? null : Math.floor(TARGET / 1000) - now;

  if (remaining !== null && remaining <= 0) return null;

  let s = remaining ?? 0;
  const values = [86400, 3600, 60, 1].map((size) => {
    const v = Math.floor(s / size);
    s %= size;
    return remaining === null ? "--" : String(v).padStart(2, "0");
  });

  return (
    <div className="flex w-full items-center gap-3 bg-gradient-to-br from-[#2f6b5e] to-[#5fae9f] py-1 pl-4 text-white sm:gap-6 sm:pl-8">
      {/* Scrolling headline: two identical halves so sliding exactly -50% loops seamlessly. */}
      <div className="olympiad-marquee min-w-0 flex-1 overflow-hidden">
        <div className="olympiad-track flex w-max">
          <div className="flex shrink-0">
            <Headline />
            <Headline hidden />
            <Headline hidden />
          </div>
          <div className="olympiad-copy flex shrink-0" aria-hidden="true">
            <Headline hidden />
            <Headline hidden />
            <Headline hidden />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-xs font-bold whitespace-nowrap text-white min-[480px]:inline sm:text-[0.8125rem]">
          Starts in
        </span>
        <span
          role="timer"
          aria-label="Time until the National Commerce Olympiad"
          className="inline-flex gap-1"
        >
          {UNITS.map((unit, i) => (
            <span
              key={unit}
              className="inline-flex items-baseline rounded-md bg-white/15 px-1.5 py-px text-xs font-extrabold tabular-nums sm:px-2 sm:text-sm"
            >
              {values[i]}
              <i className="ml-0.5 text-[0.75em] font-bold text-[#aab0dc] not-italic">{unit}</i>
            </span>
          ))}
        </span>
      </div>

      <a
        href={OLYMPIAD_HREF}
        className="mr-4 shrink-0 rounded-full bg-[#f59e0b] px-3.5 py-0.5 text-xs font-bold whitespace-nowrap text-[#1f2937] transition-colors hover:bg-[#fbb02f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:mr-8 sm:px-4 sm:text-[0.8125rem]"
      >
        Register Now →
      </a>
    </div>
  );
}
