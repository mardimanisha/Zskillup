import Link from "next/link";
import { contact, footerColumns, site, social } from "@/content/site";
import { ZSkillupLogoLight } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

/**
 * 12 - Footer.
 *
 * Navy closes the page, matching the master brand. The purple-to-coral gradient
 * appears only as a single hairline rule at the top - the brief's "selective
 * master-brand signature", not a fill.
 */
const socialBg: Record<"linkedin" | "instagram" | "youtube", string> = {
  linkedin: "bg-[#0A66C2]",
  instagram: "bg-gradient-to-tr from-[#FEE411] via-[#EE2A7B] to-[#7024C4]",
  youtube: "bg-[#FF0000]",
};

const socialGlyphs: Record<"linkedin" | "instagram" | "youtube", React.ReactNode> = {
  linkedin: (
    <path d="M5.3 8.3h2.9V17H5.3V8.3Zm1.45-4.6a1.68 1.68 0 1 1 0 3.36 1.68 1.68 0 0 1 0-3.36ZM9.8 8.3h2.78v1.19h.04c.39-.7 1.33-1.44 2.74-1.44 2.93 0 3.47 1.85 3.47 4.26V17h-2.9v-4.14c0-.99-.02-2.26-1.44-2.26-1.45 0-1.67 1.06-1.67 2.19V17H9.8V8.3Z" />
  ),
  instagram: (
    <path d="M8.2 4h7.6A4.2 4.2 0 0 1 20 8.2v7.6a4.2 4.2 0 0 1-4.2 4.2H8.2A4.2 4.2 0 0 1 4 15.8V8.2A4.2 4.2 0 0 1 8.2 4Zm-.15 1.7a2.35 2.35 0 0 0-2.35 2.35v7.9a2.35 2.35 0 0 0 2.35 2.35h7.9a2.35 2.35 0 0 0 2.35-2.35v-7.9a2.35 2.35 0 0 0-2.35-2.35h-7.9ZM12 8.15A3.85 3.85 0 1 1 12 15.85 3.85 3.85 0 0 1 12 8.15Zm0 1.7a2.15 2.15 0 1 0 0 4.3 2.15 2.15 0 0 0 0-4.3Zm4.03-2.9a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9Z" />
  ),
  youtube: (
    <path d="M20.5 8.4a2.4 2.4 0 0 0-1.7-1.7C17.2 6.3 12 6.3 12 6.3s-5.2 0-6.8.4A2.4 2.4 0 0 0 3.5 8.4 25 25 0 0 0 3.1 12a25 25 0 0 0 .4 3.6 2.4 2.4 0 0 0 1.7 1.7c1.6.4 6.8.4 6.8.4s5.2 0 6.8-.4a2.4 2.4 0 0 0 1.7-1.7 25 25 0 0 0 .4-3.6 25 25 0 0 0-.4-3.6ZM10.2 14.5V9.5L14.6 12l-4.4 2.5Z" />
  ),
};

function FooterLinkList({ links }: { links: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <ul className="mt-5 space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-[0.9375rem] text-white/65 transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  const quickLinks = footerColumns.find((col) => col.title === "Quick Links")?.links ?? [];
  const getInTouch = footerColumns.find((col) => col.title === "Get in touch")?.links ?? [];
  const mid = Math.ceil(quickLinks.length / 2);
  const quickLinksCol1 = quickLinks.slice(0, mid);
  const quickLinksCol2 = quickLinks.slice(mid);

  return (
    <footer className="bg-navy text-white">
      <div aria-hidden="true" className="h-1 bg-gradient-brand" />
      <Container className="py-16 lg:py-20">
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[1.1fr_0.85fr_0.85fr_1fr]">
          <div>
            <Link href="/" aria-label="ZSkillup home" className="flow-root w-fit">
              <ZSkillupLogoLight className="[--logo-h:3.25rem] sm:[--logo-h:3.75rem]" />
            </Link>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-white/65">
              {site.description}
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={item.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-opacity hover:opacity-85 ${socialBg[item.icon]}`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      {socialGlyphs[item.icon]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-[0.12em] text-white uppercase">
              Quick Links
            </h2>
            <FooterLinkList links={quickLinksCol1} />
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-[0.12em] text-white/0 uppercase select-none">
              Quick Links
            </h2>
            <FooterLinkList links={quickLinksCol2} />
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-[0.12em] text-white uppercase">
              Get in touch
            </h2>
            <FooterLinkList links={getInTouch} />

            <address className="mt-7 space-y-3 text-[0.9375rem] not-italic text-white/65">
              <p className="flex items-center gap-3">
                <Icon name="pin" className="h-4 w-4 shrink-0 text-white/40" />
                {contact.locations}
              </p>
              <a
                href={contact.phoneHref}
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Icon name="phone" className="h-4 w-4 shrink-0 text-white/40" />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Icon name="mail" className="h-4 w-4 shrink-0 text-white/40" />
                {contact.email}
              </a>
              <a
                href={contact.websiteHref}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Icon name="globe" className="h-4 w-4 shrink-0 text-white/40" />
                {contact.website}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-14 border-t border-white/12 pt-8">
          <p className="text-sm text-white/50">
            {/* legalName already ends in "Ltd." - don't add a second full stop. */}
            &copy; {year} {site.legalName} All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
