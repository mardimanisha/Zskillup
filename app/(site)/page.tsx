import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { resolveSeo, seoPages, type DbSeoPage } from "@/content/seo";
import { contact, site } from "@/content/site";
import { supabase } from "@/lib/supabase";
import { Hero } from "@/components/sections/Hero";
import { HomepageStats } from "@/components/sections/HomepageStats";
import { Leadership } from "@/components/sections/Leadership";
import { ChooseRoute } from "@/components/sections/ChooseRoute";
import { Institutions } from "@/components/sections/Institutions";
import { Prephasz } from "@/components/sections/Prephasz";
import { BcomAcca } from "@/components/sections/BcomAcca";
import { Partners } from "@/components/sections/Partners";
import { Testimonials } from "@/components/sections/Testimonials";
import { InAction } from "@/components/sections/InAction";
import { Faqs } from "@/components/sections/Faqs";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * Build-time metadata, so the exported HTML already carries whatever was saved
 * in /admin/seo when the site was last built (SeoSync applies later edits live).
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = seoPages[0];
  let row: DbSeoPage | null = null;
  try {
    const { data } = await supabase.from("seo_pages").select("*").eq("path", page.path).maybeSingle();
    row = data as DbSeoPage | null;
  } catch {
    // Supabase unreachable at build time - fall back to the defaults.
  }
  const seo = resolveSeo(page, row);
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords || undefined,
    alternates: { canonical: "/" },
    ...(seo.ogImage && {
      openGraph: { title: seo.metaTitle, description: seo.metaDescription, images: [seo.ogImage] },
      twitter: { card: "summary_large_image", title: seo.metaTitle, description: seo.metaDescription, images: [seo.ogImage] },
    }),
  };
}

/**
 * Homepage.
 *
 * Section order is locked by the brief's Final Homepage Flow, and the narrative
 * logic behind it is:
 *
 *   Brand -> Choice -> Offerings -> Philosophy -> Proof -> People -> Activity
 *   -> Questions -> Conversion
 *
 * Heading hierarchy: the Hero headline is the page's only H1; every section
 * headline is an H2; cards and sub-sections use H3.
 *
 * HomepageStats sits between Hero and Leadership as a later, explicit addition -
 * a compact credibility strip, not part of the original locked flow above.
 * It carries no heading of its own, so it doesn't participate in the H1/H2
 * hierarchy.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HomepageStats />
      <Leadership />
      <ChooseRoute />
      <Institutions />
      <Prephasz />
      <BcomAcca />
      <Partners />
      <Testimonials />
      <InAction />
      <Faqs />
      <FinalCta />

      <StructuredData />
    </>
  );
}

/**
 * Structured data.
 *
 * The brief: "Use structured data only where it accurately represents visible
 * page content and is appropriate for the page type."
 *
 * So there are exactly two blocks, and nothing speculative:
 *   - Organization, describing ZSkillup itself.
 *   - FAQPage, covering ONLY the general question set - the questions actually
 *     visible when the page loads. Category-filtered questions are deliberately
 *     excluded rather than stuffed in.
 *
 * No aggregateRating, no review markup, no course/offer markup: none of those
 * could be stated accurately from verified data today.
 */
function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    telephone: contact.phone,
    email: contact.email,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => f.category === "general")
      .map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
