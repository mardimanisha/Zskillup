"use client";

/** Small labeled wrapper used across every admin form for a consistent look. */
export function AdminFormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      <div className="mt-1 font-normal">{children}</div>
      {hint && <p className="mt-1 text-xs font-normal text-neutral-400">{hint}</p>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none";
export const textareaClass = `${inputClass} min-h-[6rem]`;
