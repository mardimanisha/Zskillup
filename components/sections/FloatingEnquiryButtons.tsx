"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PrephaszLogo } from "@/components/ui/Brand";
import { VerticalEnquiryForm } from "./VerticalEnquiryForms";

/**
 * Replaces the old three enquiry cards (formerly at the foot of the
 * education-to-career section) with a stack of icon buttons pinned to the
 * bottom-right corner of the viewport. Each is a pill that expands on
 * hover/focus to reveal its own name - not a separate tooltip - then
 * collapses back to a plain circle, WhatsApp-widget style. Each opens its
 * own native <dialog> with the enquiry form built for that vertical (see
 * VerticalEnquiryForms) - one form per button, not one shared form, so
 * opening one never resets another's in-progress input.
 */

const solutionIcons: Record<string, IconName> = {
  institutions: "building",
  prephasz: "target",
  commerce: "landmark",
};

/** How far each pill expands on hover/focus - sized per label so "prephasz"
    doesn't drag a trail of empty pill behind it the way a single shared
    width would. Literal class names (not built from a template string) so
    Tailwind's build-time scanner can actually find them. */
const solutionExpandedWidth: Record<string, string> = {
  institutions: "hover:w-56 focus-visible:w-56",
  prephasz: "hover:w-40 focus-visible:w-40",
  commerce: "hover:w-56 focus-visible:w-56",
};

/** Per-vertical branding. The dialog sets --form-* variables that the shared
    field primitives read (focus rings, required asterisks, selected pills),
    so each form picks up its own colour without prop-drilling. Prephasz's
    yellow is too light for text, so its ink is the darker gold. */
const solutionBrand: Record<string, { vars: Record<string, string>; iconChip: string }> = {
  institutions: {
    vars: {
      "--form-accent": "var(--color-inst)",
      "--form-ink": "var(--color-inst-ink)",
      "--form-soft": "var(--color-inst-soft)",
      "--form-line": "var(--color-inst-line)",
    },
    iconChip: "bg-inst-soft text-inst",
  },
  prephasz: {
    vars: {
      "--form-accent": "var(--color-prep)",
      "--form-ink": "var(--color-prep-ink)",
      "--form-soft": "var(--color-prep-soft)",
      "--form-line": "var(--color-prep-line)",
    },
    iconChip: "bg-prep-soft text-prep-ink",
  },
  commerce: {
    vars: {
      "--form-accent": "var(--color-com)",
      "--form-ink": "var(--color-com-ink)",
      "--form-soft": "var(--color-com-soft)",
      "--form-line": "var(--color-com-line)",
    },
    iconChip: "bg-com-soft text-com",
  },
};

export function FloatingEnquiryButtons() {
  const dialogRefs = useRef<(HTMLDialogElement | null)[]>([]);

  // Any link to "#enquire-<vertical>" (e.g. the hero cards' "Partner With Us")
  // opens that vertical's dialog, same as its floating button. Delegated so
  // server-rendered links need no client wrapper, and it works on every click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#enquire-"]');
      if (!link) return;
      const vertical = link.getAttribute("href")!.slice("#enquire-".length);
      const i = journey.solutions.findIndex((s) => s.vertical === vertical);
      if (i === -1) return;
      e.preventDefault();
      dialogRefs.current[i]?.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="fixed right-4 bottom-6 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-8">
      {journey.solutions.map((solution, i) => (
        <div key={solution.vertical}>
          <button
            type="button"
            onClick={() => dialogRefs.current[i]?.showModal()}
            aria-haspopup="dialog"
            className={`group flex h-12 w-12 items-center overflow-hidden rounded-full bg-brand text-white shadow-lift transition-[width] duration-300 ease-out hover:bg-brand-deep ${solutionExpandedWidth[solution.vertical]}`}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center">
              <Icon name={solutionIcons[solution.vertical]} className="h-5 w-5" />
            </span>
            <span className="truncate pr-5 text-[0.875rem] font-semibold whitespace-nowrap">
              {solution.title}
            </span>
          </button>

          <dialog
            ref={(el) => {
              dialogRefs.current[i] = el;
            }}
            aria-label={`Enquire about ${solution.title}`}
            style={solutionBrand[solution.vertical].vars as React.CSSProperties}
            onClick={(e) => {
              if (e.target === dialogRefs.current[i]) dialogRefs.current[i]?.close();
            }}
            className="no-scrollbar m-auto max-h-[85vh] w-[92vw] max-w-[34rem] overflow-y-auto rounded-2xl border-0 bg-white p-0 shadow-lift backdrop:bg-navy-deep/70"
          >
            {/* Branded header: tinted band, solid accent bar on top, hairline
                below. Sticky so the close button stays reachable while the
                form scrolls. Light tint (not a solid fill) so the prephasz
                logo - navy word, yellow arrow - stays legible. */}
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-t-4 border-b border-t-[var(--form-accent)] border-b-[var(--form-line)] bg-[var(--form-soft)] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-sm ${solutionBrand[solution.vertical].iconChip}`}>
                  <Icon name={solutionIcons[solution.vertical]} className="h-[1.125rem] w-[1.125rem]" />
                </span>
                {solution.vertical === "prephasz" ? (
                  <PrephaszLogo className="h-8" />
                ) : (
                  <h2 className="text-base font-semibold text-navy">{solution.title}</h2>
                )}
              </div>
              <button
                type="button"
                onClick={() => dialogRefs.current[i]?.close()}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--form-line)] bg-white text-navy transition-colors hover:bg-[var(--form-line)]"
                aria-label="Close"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </header>

            <div className="p-5 sm:p-6">
              <VerticalEnquiryForm
                vertical={solution.vertical}
                idPrefix={`enquiry-${solution.vertical}`}
              />
            </div>
          </dialog>
        </div>
      ))}
    </div>
  );
}
