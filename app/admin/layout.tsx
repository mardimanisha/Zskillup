/**
 * Own ROOT layout for /admin/*.
 *
 * The marketing site's root layout (SiteHeader/SiteFooter/FloatingEnquiryButtons,
 * fonts, the marketing design system) now lives at app/(site)/layout.tsx - a
 * route group, not app/layout.tsx. Since there is no layout.tsx directly above
 * app/admin in the tree, this file is itself a *root* layout for everything
 * under /admin (see "Root Layout" / "multiple root layouts" in
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md) -
 * that's what lets the admin panel skip the marketing chrome entirely, rather
 * than merely nesting inside it. It defines its own <html>/<body> and a
 * minimal, plain, internal-tool look.
 */
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: "ZSkillup Admin",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="admin-body">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
