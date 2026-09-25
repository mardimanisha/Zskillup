"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { resolveSeo, seoPages, type DbSeoPage } from "@/content/seo";
import { supabase } from "@/lib/supabase";

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!value) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/**
 * The site is a static export, so the metadata baked in at build time can't
 * follow an edit made in /admin/seo. This applies the saved values in the
 * browser (crawlers that run JS see them) for the pages listed in content/seo.ts.
 * Pages not listed there - e.g. individual blog posts - manage their own title.
 */
export function SeoSync() {
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const page = seoPages.find((p) => p.path === path);
    if (!page) return;

    let cancelled = false;
    supabase
      .from("seo_pages")
      .select("*")
      .eq("path", page.path)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const seo = resolveSeo(page, data as DbSeoPage);
        document.title = seo.metaTitle;
        setMeta("name", "description", seo.metaDescription);
        setMeta("name", "keywords", seo.keywords);
        setMeta("property", "og:title", seo.metaTitle);
        setMeta("property", "og:description", seo.metaDescription);
        setMeta("property", "og:image", seo.ogImage);
        setMeta("name", "twitter:title", seo.metaTitle);
        setMeta("name", "twitter:description", seo.metaDescription);
        setMeta("name", "twitter:image", seo.ogImage);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
