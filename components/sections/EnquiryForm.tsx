"use client";

import { Button } from "@/components/ui/Button";
import {
  EnquirySuccess,
  PillGroupField,
  STATIC_BUILD,
  TextAreaField,
  TextField,
  useEnquirySubmit,
} from "./EnquiryFormFields";

/**
 * The general-purpose enquiry route behind the site-wide "Partner With Us"
 * CTA (FinalCta): "I am enquiring as" is what routes the enquiry, so one
 * form can serve a B2B institution lead and a B2C student without either
 * seeing irrelevant fields.
 *
 * The three floating buttons instead open a form scoped to that specific
 * vertical - see VerticalEnquiryForms - since a visitor who already clicked
 * "ZSkillup for Institutions" shouldn't be asked whether they're a student
 * or a parent.
 *
 * Accessibility: every field has a real <label>, errors are announced through
 * aria-describedby + role="alert", the submit state is announced politely, and
 * nothing depends on placeholder text to convey meaning.
 */

const audiences = [
  { value: "institution", label: "An institution" },
  { value: "student", label: "A student or parent" },
  { value: "industry", label: "An industry partner" },
] as const;

export type Audience = (typeof audiences)[number]["value"];

const audienceLabel = (value: string) =>
  audiences.find((a) => a.value === value)?.label ?? value;

export function EnquiryForm({
  idPrefix = "enquiry",
  defaultAudience,
}: {
  idPrefix?: string;
  defaultAudience?: Audience;
} = {}) {
  const { status, errors, message, onSubmit, reset } = useEnquirySubmit({
    validate: (data) => {
      const next: Record<string, string> = {};
      if (!data.name?.trim()) next.name = "Please enter your name.";
      if (!data.email?.trim()) next.email = "Please enter your email address.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email))
        next.email = "Please enter a valid email address.";
      if (!data.audience) next.audience = "Please tell us who you are enquiring as.";
      return next;
    },
    subject: (data) => `Website enquiry - ${data.name}`,
    bodyLines: (data) => [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "-"}`,
      `Institution or organisation: ${data.organisation || "-"}`,
      `Enquiring as: ${audienceLabel(data.audience)}`,
      "",
      data.message || "(no message)",
    ],
  });

  if (status === "success") {
    return (
      <div className="rounded-card border border-line bg-white p-8">
        <EnquirySuccess message={message} onReset={reset} />
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          idPrefix={idPrefix}
          name="name"
          label="Full name"
          autoComplete="name"
          required
          error={errors.name}
        />
        <TextField
          idPrefix={idPrefix}
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
        <TextField
          idPrefix={idPrefix}
          name="phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          optional
        />
        <TextField
          idPrefix={idPrefix}
          name="organisation"
          label="Institution or organisation"
          autoComplete="organization"
          optional
        />
      </div>

      <div className="mt-6">
        <PillGroupField
          idPrefix={idPrefix}
          name="audience"
          legend="I am enquiring as"
          options={audiences}
          required
          defaultValue={defaultAudience}
          error={errors.audience}
        />
      </div>

      <div className="mt-6">
        <TextAreaField idPrefix={idPrefix} name="message" label="How can we help?" optional />
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-5 text-[0.875rem] text-[#c0392b]">
          {message}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="brand">
          {status === "submitting" ? "Sending…" : STATIC_BUILD ? "Send Enquiry by Email" : "Send Enquiry"}
        </Button>
        <p className="text-[0.8125rem] text-muted">
          {STATIC_BUILD
            ? "Opens in your email app. We'll only use your details to respond."
            : "We'll only use your details to respond to this enquiry."}
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {status === "submitting" ? "Sending your enquiry" : ""}
      </p>
    </form>
  );
}
