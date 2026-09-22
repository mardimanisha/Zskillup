"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { Icon } from "./Icon";

export type EventPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

/**
 * Captioned photo grid for the event detail page. Every tile opens the same
 * native <dialog> lightbox on click, with prev/next stepping through the
 * whole set - keeps the grid itself free of any per-tile modal state.
 */
const INITIAL_LIMIT = 10;

export function EventPhotoGrid({ photos }: { photos: EventPhoto[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? photos : photos.slice(0, INITIAL_LIMIT);

  const open = (i: number) => {
    setIndex(i);
    ref.current?.showModal();
  };

  const step = (delta: number) => {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    el.addEventListener("keydown", onKeydown);
    return () => el.removeEventListener("keydown", onKeydown);
  }, [photos.length]);

  const current = photos[index];
  const hasMore = photos.length > INITIAL_LIMIT && !expanded;
  const remaining = photos.length - INITIAL_LIMIT;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
        {visible.map((photo, i) => {
          const isLoadMoreTile = hasMore && i === visible.length - 1;
          return (
            <button
              key={photo.src + i}
              type="button"
              onClick={() => (isLoadMoreTile ? setExpanded(true) : open(i))}
              className="group relative aspect-square overflow-hidden text-left"
            >
              <Image
                src={asset(photo.src)}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 20vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {isLoadMoreTile ? (
                <div className="absolute inset-0 grid place-items-center bg-navy-deep/60 transition-colors group-hover:bg-navy-deep/70">
                  <span className="flex flex-col items-center gap-1 text-white">
                    <Icon name="arrowDown" className="h-4 w-4" />
                    <span className="text-[0.75rem] font-semibold sm:text-[0.8125rem]">
                      +{remaining} more
                    </span>
                  </span>
                </div>
              ) : (
                photo.caption && (
                  <>
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[0.6875rem] font-medium text-white sm:text-[0.75rem]">
                      {photo.caption}
                    </span>
                  </>
                )
              )}
            </button>
          );
        })}
      </div>

      <dialog
        ref={ref}
        aria-label={current?.caption ?? current?.alt}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-navy-deep/85"
      >
        {current && (
          <div className="grid h-full w-full place-items-center">
            <div className="flex flex-col items-center">
              <div className="relative aspect-square h-[80vmin] w-[80vmin] max-h-[820px] max-w-[820px]">
                <Image
                  src={asset(current.src)}
                  alt={current.alt}
                  fill
                  sizes="80vmin"
                  className="object-cover"
                />
              </div>

              {current.caption && (
                <p className="mt-4 text-center text-[0.9375rem] font-medium text-white">
                  {current.caption}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="fixed right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-navy shadow-lift transition-colors hover:bg-cloud sm:right-8 sm:top-8"
              aria-label="Close"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="fixed left-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white text-navy shadow-lift transition-colors hover:bg-cloud sm:left-8"
                  aria-label="Previous image"
                >
                  <Icon name="chevronLeft" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="fixed right-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white text-navy shadow-lift transition-colors hover:bg-cloud sm:right-8"
                  aria-label="Next image"
                >
                  <Icon name="chevronRight" className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
