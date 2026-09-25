/**
 * Editable SEO metadata, per public page.
 *
 * The values below are the defaults. Anything saved from /admin/seo lives in
 * the `seo_pages` Supabase table and overrides these field-by-field (an empty
 * field in the table falls back to the default here). Add a page to this list
 * to make it show up in the admin panel.
 */

export type SeoFields = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
};

export type SeoPage = { path: string; label: string; defaults: SeoFields };

export const seoPages: SeoPage[] = [
  {
    path: "/",
    label: "Home",
    defaults: {
      metaTitle: "ZSkillup | Industry-Ready Careers for Students & Institutions",
      metaDescription:
        "Degrees create graduates. ZSkillup helps create industry-ready professionals - through employability programs for institutions, the prephasz placement-preparation platform and the Global Finance Program career pathway.",
      keywords: "",
      ogImage: "",
    },
  },
  {
    path: "/blog",
    label: "Blog",
    defaults: {
      metaTitle: "Blog | ZSkillup",
      metaDescription: "Career tips, industry trends and guides from ZSkillup.",
      keywords: "",
      ogImage: "",
    },
  },
  {
    path: "/events",
    label: "Events",
    defaults: {
      metaTitle: "Events | ZSkillup",
      metaDescription: "Webinars, workshops and campus visits from ZSkillup.",
      keywords: "",
      ogImage: "",
    },
  },
];

export type DbSeoPage = {
  path: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  og_image: string;
};

/** Overlay a saved row on a page's defaults; blank saved fields keep the default. */
export function resolveSeo(page: SeoPage, row?: DbSeoPage | null): SeoFields {
  const d = page.defaults;
  return {
    metaTitle: row?.meta_title.trim() || d.metaTitle,
    metaDescription: row?.meta_description.trim() || d.metaDescription,
    keywords: row?.keywords.trim() || d.keywords,
    ogImage: row?.og_image.trim() || d.ogImage,
  };
}
