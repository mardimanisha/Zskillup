"use client";

import { useState } from "react";
import { contact } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

/**
 * Shared field primitives and submit logic for every enquiry form on the
 * site - the generic multi-audience form (EnquiryForm, used by FinalCta) and
 * the three vertical-specific forms (VerticalEnquiryForms, used by the
 * floating buttons) both build on these instead of each rolling their own
 * input styling and mailto/fetch plumbing.
 */

export type Status = "idle" | "submitting" | "success" | "error";

/** True on the GitHub Pages build, where there is no server to POST to. */
export const STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

/** Google Apps Script web app that appends enquiries to a Google Sheet. */
const SHEET_URL = process.env.NEXT_PUBLIC_SHEET_URL;

/** Checkbox groups repeat the same `name` for every option, so a plain
    `Object.fromEntries(new FormData(form))` would silently drop all but the
    last one - `multiFields` tells the extractor to collect and join those. */
export function extractFormData(form: HTMLFormElement, multiFields: string[] = []) {
  const fd = new FormData(form);
  const data: Record<string, string> = {};
  for (const key of new Set(fd.keys())) {
    data[key] = multiFields.includes(key)
      ? fd.getAll(key).map(String).join(", ")
      : String(fd.get(key) ?? "");
  }
  return data;
}

export function useEnquirySubmit({
  multiFields,
  validate,
  subject,
  bodyLines,
}: {
  /** Field names backed by multiple checkboxes rather than one input. */
  multiFields?: string[];
  validate: (data: Record<string, string>) => Record<string, string>;
  /** The mailto subject line, used only on the static build. */
  subject: (data: Record<string, string>) => string;
  /** The mailto body, used only on the static build. */
  bodyLines: (data: Record<string, string>) => string[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = extractFormData(form, multiFields);

    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      if (STATIC_BUILD) {
        // GitHub Pages serves files only, so there is no /api/enquiry to POST
        // to. With a Google Sheets web app URL configured, post there (no-cors:
        // Apps Script sends no CORS headers, so the response is unreadable);
        // otherwise hand the enquiry to the visitor's mail client.
        if (SHEET_URL) {
          await fetch(SHEET_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(data),
          });
          setStatus("success");
          setMessage("Thanks — we'll be in touch shortly.");
          form.reset();
          return;
        }
        window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
          subject(data),
        )}&body=${encodeURIComponent(bodyLines(data).join("\n"))}`;
        setStatus("success");
        setMessage(
          `Your email app should now be open with this enquiry ready to send to ${contact.email}. If nothing happened, email us directly.`,
        );
        form.reset();
        return;
      }

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !body.ok) throw new Error(body.message ?? "Something went wrong.");
      setStatus("success");
      setMessage(body.message ?? "Thanks — we'll be in touch shortly.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  return { status, errors, message, onSubmit, reset: () => setStatus("idle") };
}

const labelCls = "flex items-end text-[0.9375rem] font-semibold text-navy sm:min-h-[2.5rem]";
const inputCls =
  "mt-2 w-full rounded-tile border bg-cloud px-4 py-3 text-[0.9375rem] text-navy outline-none focus:border-[var(--form-accent,var(--color-brand))]";
const errorCls = "mt-1.5 text-[0.8125rem] text-[#c0392b]";

function RequiredOrOptional({ required, optional }: { required?: boolean; optional?: boolean }) {
  if (required) return <span className="text-[var(--form-ink,var(--color-brand))]">*</span>;
  if (optional) return <span className="font-normal text-muted">(optional)</span>;
  return null;
}

export function TextField({
  idPrefix,
  name,
  label,
  type = "text",
  required,
  optional,
  autoComplete,
  error,
}: {
  idPrefix: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  const id = `${idPrefix}-${name}`;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={labelCls}>
        {label} <RequiredOrOptional required={required} optional={optional} />
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={`${inputCls} ${error ? "border-[#c0392b]" : "border-line"}`}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className={errorCls}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  idPrefix,
  name,
  label,
  options,
  placeholder = "Select an option",
  required,
  optional,
  error,
}: {
  idPrefix: string;
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
}) {
  const id = `${idPrefix}-${name}`;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={labelCls}>
        {label} <RequiredOrOptional required={required} optional={optional} />
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={`${inputCls} ${error ? "border-[#c0392b]" : "border-line"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} role="alert" className={errorCls}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextAreaField({
  idPrefix,
  name,
  label,
  optional,
  rows = 4,
}: {
  idPrefix: string;
  name: string;
  label: string;
  optional?: boolean;
  rows?: number;
}) {
  const id = `${idPrefix}-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-navy">
        {label} <RequiredOrOptional optional={optional} />
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        className={`${inputCls} border-line`}
      />
    </div>
  );
}

/** A single-choice pill group (radio inputs styled as pills). */
export function PillGroupField({
  idPrefix,
  name,
  legend,
  options,
  required,
  optional,
  defaultValue,
  error,
  kind = "radio",
}: {
  idPrefix: string;
  name: string;
  legend: string;
  options: readonly { value: string; label: string }[];
  required?: boolean;
  optional?: boolean;
  defaultValue?: string;
  error?: string;
  /** "radio" for single choice, "checkbox" for multi-select. */
  kind?: "radio" | "checkbox";
}) {
  const errorId = `${idPrefix}-${name}-error`;
  return (
    <fieldset>
      <legend className="text-[0.9375rem] font-semibold text-navy">
        {legend} <RequiredOrOptional required={required} optional={optional} />
      </legend>
      <div
        className="mt-3 flex flex-wrap gap-2"
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="cursor-pointer rounded-full border border-line px-4 py-2.5 text-[0.9375rem] text-body transition-colors has-[:checked]:border-[var(--form-accent,var(--color-brand))] has-[:checked]:bg-[var(--form-soft,var(--color-brand-soft))] has-[:checked]:font-semibold has-[:checked]:text-navy"
          >
            <input
              type={kind}
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} role="alert" className={`mt-2 ${errorCls}`}>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function EnquirySuccess({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--form-soft,var(--color-com-soft))] text-[var(--form-ink,var(--color-com))]">
        <Icon name="check" className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-navy">Enquiry received</h3>
      <p className="mt-2 text-[0.9375rem] text-body">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 text-[0.9375rem] font-semibold text-[var(--form-ink,var(--color-brand))] hover:underline"
      >
        Send another enquiry
      </button>
    </div>
  );
}
