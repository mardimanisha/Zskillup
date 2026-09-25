"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Manage the content that shows up live on the site.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/blog"
          className="rounded-lg border border-neutral-200 bg-white p-5 hover:border-neutral-400"
        >
          <h2 className="font-semibold text-neutral-900">Blog</h2>
          <p className="mt-1 text-sm text-neutral-500">Add, edit or delete blog posts.</p>
        </Link>
        <Link
          href="/admin/events"
          className="rounded-lg border border-neutral-200 bg-white p-5 hover:border-neutral-400"
        >
          <h2 className="font-semibold text-neutral-900">Events</h2>
          <p className="mt-1 text-sm text-neutral-500">Manage the featured event and gallery.</p>
        </Link>
        <Link
          href="/admin/testimonials"
          className="rounded-lg border border-neutral-200 bg-white p-5 hover:border-neutral-400"
        >
          <h2 className="font-semibold text-neutral-900">Testimonials</h2>
          <p className="mt-1 text-sm text-neutral-500">Manage learner testimonials.</p>
        </Link>
      </div>
    </div>
  );
}
