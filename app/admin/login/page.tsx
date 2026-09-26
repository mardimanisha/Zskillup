"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * Password-only login. The admin account's email is fixed (shahu.shinde@zskillup.com, or NEXT_PUBLIC_ADMIN_EMAIL if set); the password
 * itself is checked by Supabase Auth (set it in Dashboard -> Authentication ->
 * Users), never stored in env - in a static export every NEXT_PUBLIC_* value
 * ships to the browser, and Supabase needs a real session to allow writes.
 */
const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "shahu.shinde@zskillup.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: adminEmail, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.replace("/admin");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#f8f6f4] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 text-[#730d3d]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="10" width="16" height="11" rx="3" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <h1 className="text-xl font-bold text-neutral-900">Admin access</h1>
        </div>

        <label className="mt-6 block text-[15px] font-medium text-neutral-800">
          Password
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border-2 border-[#730d3d] bg-[#e8f0fe] px-4 py-3 text-base text-neutral-900 focus:outline-none"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">Incorrect password.</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-[#730d3d] px-4 py-3.5 text-base font-semibold text-white hover:bg-[#5c0a31] disabled:opacity-60"
        >
          {loading ? "Unlocking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
