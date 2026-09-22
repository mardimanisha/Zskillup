"use client";

import { useRef } from "react";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PrephaszWordmark } from "@/components/ui/Brand";
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

export function FloatingEnquiryButtons() {
  const dialogRefs = useRef<(HTMLDialogElement | null)[]>([]);

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
            onClick={(e) => {
              if (e.target === dialogRefs.current[i]) dialogRefs.current[i]?.close();
            }}
            className="no-scrollbar m-auto max-h-[85vh] w-[92vw] max-w-[34rem] overflow-y-auto rounded-2xl border-0 bg-cloud p-0 backdrop:bg-navy-deep/70"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                    <Icon name={solutionIcons[solution.vertical]} className="h-4 w-4" />
                  </span>
                  {solution.vertical === "prephasz" ? (
                    <PrephaszWordmark className="text-xl" />
                  ) : (
                    <h2 className="text-base font-semibold text-navy">{solution.title}</h2>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dialogRefs.current[i]?.close()}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-navy transition-colors hover:bg-cloud"
                  aria-label="Close"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6">
                <VerticalEnquiryForm
                  vertical={solution.vertical}
                  idPrefix={`enquiry-${solution.vertical}`}
                />
              </div>
            </div>
          </dialog>
        </div>
      ))}
    </div>
  );
}
