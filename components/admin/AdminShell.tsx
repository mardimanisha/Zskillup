"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/**
 * Wraps every /admin/* page. Handles the one shared-admin-login auth check
 * (redirect to /admin/login when there is no session) and renders the
 * sign-out button + simple nav on every authenticated admin page.
 *
 * /admin/login itself renders through here too, but is exempted from the
 * redirect/guard so a logged-out visitor can actually reach the login form.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoginPage) return;
    if (session === null) router.replace("/admin/login");
  }, [session, isLoginPage, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Session not resolved yet, or resolved to null and about to redirect.
  if (session === undefined || session === null) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-neutral-500">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold tracking-tight text-neutral-900">ZSkillup Admin</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/blog" className="text-neutral-600 hover:text-neutral-900">
              Blog
            </Link>
            <Link href="/admin/events" className="text-neutral-600 hover:text-neutral-900">
              Events
            </Link>
            <Link href="/admin/testimonials" className="text-neutral-600 hover:text-neutral-900">
              Testimonials
            </Link>
            <Link href="/admin/seo" className="text-neutral-600 hover:text-neutral-900">
              SEO
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-400">{session.user.email}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
