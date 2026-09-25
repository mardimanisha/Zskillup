"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contact, headerCta, nav, social } from "@/content/site";
import { PrephaszLogo, ZSkillupLogoMark } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import { SiteSearch } from "./SiteSearch";

/** Full-colour brand marks (the shared Icon set is single-colour by design). */
function SocialLogo({ name, className }: { name: (typeof social)[number]["icon"]; className?: string }) {
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
        <rect x="4.6" y="9.4" width="3" height="9.6" fill="#fff" />
        <circle cx="6.1" cy="6.2" r="1.75" fill="#fff" />
        <path d="M10.2 9.4h2.9v1.3c.5-.9 1.6-1.6 3.1-1.6 3 0 3.6 2 3.6 4.5V19h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.4V19h-3V9.4Z" fill="#fff" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#FEDA75" />
            <stop offset="0.3" stopColor="#FA7E1E" />
            <stop offset="0.55" stopColor="#D62976" />
            <stop offset="0.8" stopColor="#962FBF" />
            <stop offset="1" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6.5" fill="url(#ig-grad)" />
        <rect x="5" y="5" width="14" height="14" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.7" />
        <circle cx="16.3" cy="7.7" r="1" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path d="M9.6 7.6v8.8l7.4-4.4-7.4-4.4Z" fill="#fff" />
    </svg>
  );
}

function ContactList() {
  const rows = [
    { icon: "pin", text: contact.locations, href: undefined },
    { icon: "phone", text: contact.phone, href: contact.phoneHref },
    { icon: "mail", text: contact.email, href: `mailto:${contact.email}` },
    { icon: "globe", text: contact.website, href: contact.websiteHref },
  ] as const;
  return (
    <ul className="flex flex-col gap-1">
      {rows.map((r) => {
        const inner = (
          <>
            <Icon name={r.icon} className="h-4.5 w-4.5 shrink-0 text-brand" />
            <span className="text-sm text-navy">{r.text}</span>
          </>
        );
        return (
          <li key={r.icon}>
            {r.href ? (
              <a href={r.href} className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-brand-soft">
                {inner}
              </a>
            ) : (
              <div className="flex items-center gap-3 px-2 py-2">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Final navigation, exactly as the brief locks it:
 *   Institutions | Prephasz | B.Com + ACCA | Why ZSkillup | Insights | About
 * with "Partner With Us" as the prominent top-right CTA.
 *
 * "Programs" was deliberately removed - it is no longer a top-level website
 * architecture term, which is also why the hero CTA says "Explore What We Offer"
 * rather than "Explore Our Programs".
 *
 * The comp's search control is kept (see SiteSearch) - it finds sections,
 * offerings and FAQs on the page and jumps to them.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile panel, and close it on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          {/* Aligns the logo's left edge with the Hero's own left grid line.
              Both this header's <Container> and the Hero's text wrapper share
              the identical px-5/sm:px-8 padding - they only diverge once the
              viewport passes Container's own max-w-[1240px] cap, where
              Container starts centering (adding growing left margin) while
              the Hero (deliberately uncapped, see Hero.tsx) does not. That
              growing margin is exactly `max(0px, (100vw - 1240px) / 2)` -
              pulling the logo left by that same computed amount cancels it
              out and lands the logo back on the Hero's edge at every width,
              rather than a guessed fixed offset. Below 1240px the margin is
              already 0, so this is a no-op there. A transform (not a
              margin) so it only moves the logo visually - it does not
              re-flow or shift the nav links/CTA/search/menu button, which
              keep their exact current position and spacing. */}
          <Link
            href="/"
            aria-label="ZSkillup home"
            className="shrink-0 [transform:translateX(min(0px,(1240px_-_100vw)/2))]"
          >
            <ZSkillupLogoMark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block xl:-translate-x-10">
            {/* Divider pipes between items, as in the design. */}
            <ul className="flex items-center">
              {nav.map((item, i) => {
                const hasChildren = "children" in item && item.children.length > 0;
                return (
                  <li key={item.label} className={`relative flex items-center${hasChildren ? " group" : ""}`}>
                    {i > 0 ? (
                      <span aria-hidden="true" className="h-4 w-px bg-navy/15" />
                    ) : null}
                    {hasChildren ? (
                      <span className="flex items-center gap-1 cursor-default rounded-full whitespace-nowrap px-2 py-2 text-sm font-medium xl:px-4 xl:text-[0.9375rem] text-navy/85 transition-colors group-hover:text-navy">
                        {item.label}
                        <svg
                          className="h-3.5 w-3.5 transition-transform group-hover:rotate-180"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        aria-label={item.label === "prephasz" ? "prephasz, Powered by ZSkillup" : undefined}
                        className="rounded-full whitespace-nowrap px-2 py-2 text-sm font-medium xl:px-4 xl:text-[0.9375rem] text-navy/85 transition-colors hover:text-navy"
                      >
                        {item.label === "prephasz" ? <PrephaszLogo className="h-6" /> : item.label}
                      </Link>
                    )}
                    {hasChildren && (
                      // The pt-2 here (not a margin on the card below) is deliberate: a margin
                      // would leave a gap between the trigger and the card that isn't part of
                      // this element's own box, so the pointer exits the hoverable area and the
                      // card closes before the mouse ever reaches it. Padding keeps that space
                      // inside the box - still invisible, but still hoverable - so the card
                      // stays open while crossing it.
                      <div className="pointer-events-none absolute left-1/2 top-full w-72 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                        <div className="rounded-2xl border border-line bg-white p-2 shadow-xl shadow-navy/[0.08]">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="group/card flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-brand-soft"
                            >
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition-colors group-hover/card:bg-white">
                                <Icon name={"icon" in child ? child.icon : "file"} className="h-5 w-5" />
                              </span>
                              <span className="flex flex-col gap-0.5 pt-0.5">
                                <span className="text-sm font-semibold text-navy">{child.label}</span>
                                {"description" in child ? (
                                  <span className="text-[0.8125rem] leading-snug text-muted">
                                    {child.description}
                                  </span>
                                ) : null}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Mirrors the logo's own alignment fix (see the transform note on
                the logo <Link> above), but on the right edge: Container
                recentres past its 1240px cap, growing this side's margin at
                the same rate the logo's growing left margin gets cancelled
                on its side - so without this, the CTA/search drift away from
                the Hero's right edge (which is uncapped, see pageGutter in
                Hero.tsx) as the viewport widens past 1240px. The flat -16px
                cancels the constant gap between Container's own px padding
                and the Hero's effective right padding (pr minus its own
                16px nudge), which holds at every width below 1240px too. */}
            <div className="flex items-center gap-2 [transform:translateX(calc(max(0px,(100vw_-_1240px)/2)_-_16px))]">
              <div className="group relative hidden lg:block">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="flex cursor-default items-center gap-1 rounded-full whitespace-nowrap px-2 py-2 text-sm font-medium xl:px-4 xl:text-[0.9375rem] text-navy/85 transition-colors group-hover:text-navy group-focus-within:text-navy"
                >
                  Contact
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {/* pt-2 (not a margin) keeps the gap hoverable - see the Insights dropdown. */}
                <div className="pointer-events-none absolute right-0 top-full w-80 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-line bg-white p-4 shadow-xl shadow-navy/[0.08]">
                    <ContactList />
                    <div className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3">
                      {social.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-110"
                        >
                          <SocialLogo name={s.icon} className="h-7 w-7" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button href={headerCta.href} variant="primary" size="sm" className="hidden sm:inline-flex">
                {headerCta.label}
              </Button>

              <div className="hidden sm:block">
                <SiteSearch />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile panel. Content order matches the desktop navigation exactly -
          the brief asks that mobile preserve hierarchy, not just visual order. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-white lg:hidden"
      >
        <Container className="py-5">
          <nav aria-label="Primary (mobile)">
            <ul className="flex flex-col">
              {nav.map((item) => {
                const hasChildren = "children" in item && item.children.length > 0;
                return (
                  <li key={item.label}>
                    {hasChildren ? (
                      <>
                        <span className="block border-b border-line-soft py-3.5 text-lg font-semibold text-navy">
                          {item.label}
                        </span>
                        <ul className="flex flex-col gap-1.5 py-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl p-2.5 transition-colors active:bg-brand-soft"
                              >
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                                  <Icon name={"icon" in child ? child.icon : "file"} className="h-4.5 w-4.5" />
                                </span>
                                <span className="flex flex-col">
                                  <span className="text-base font-medium text-navy">{child.label}</span>
                                  {"description" in child ? (
                                    <span className="text-sm text-muted">{child.description}</span>
                                  ) : null}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-label={item.label === "prephasz" ? "prephasz, Powered by ZSkillup" : undefined}
                        className="block border-b border-line-soft py-3.5 text-lg font-semibold text-navy"
                      >
                        {item.label === "prephasz" ? <PrephaszLogo className="h-7" /> : item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-5 border-b border-line-soft pb-5">
            <span className="block py-2 text-lg font-semibold text-navy">Contact</span>
            <ContactList />
            <div className="mt-3 flex items-center gap-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full"
                >
                  <SocialLogo name={s.icon} className="h-8 w-8" />
                </a>
              ))}
            </div>
          </div>
          <Button
            href={headerCta.href}
            variant="brand"
            className="mt-6 w-full"
          >
            {headerCta.label}
          </Button>
        </Container>
      </div>
    </header>
  );
}
