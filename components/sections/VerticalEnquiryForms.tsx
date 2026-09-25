"use client";

import type { Vertical } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import {
  EnquirySuccess,
  PillGroupField,
  SelectField,
  STATIC_BUILD,
  TextAreaField,
  TextField,
  useEnquirySubmit,
} from "./EnquiryFormFields";

/**
 * The floating buttons each open a form scoped to what that button actually
 * is, instead of the generic multi-audience EnquiryForm - a visitor who
 * clicked "ZSkillup for Institutions" has already told us they're an
 * institution, so asking them "student or parent?" next is a contradiction,
 * not a courtesy. Field sets, copy and validation differ per vertical:
 *
 *   institutions - B2B partnership enquiry from a school/college/university.
 *   prephasz      - B2C enquiry from a student preparing for placements.
 *   commerce      - academic admissions enquiry for the B.Com + ACCA program.
 */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function requireText(data: Record<string, string>, field: string, message: string, errors: Record<string, string>) {
  if (!data[field]?.trim()) errors[field] = message;
}

function requireEmail(data: Record<string, string>, errors: Record<string, string>) {
  if (!data.email?.trim()) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(data.email)) errors.email = "Please enter a valid email address.";
}

/* -------------------------------------------------------------------------- */
/* Institutions - B2B partnership enquiry                                     */
/* -------------------------------------------------------------------------- */

const institutionTypes = [
  { value: "school", label: "School" },
  { value: "college-university", label: "College or university" },
  { value: "training-institute", label: "Coaching or training institute" },
  { value: "other", label: "Other" },
] as const;

const institutionInterests = [
  { value: "Curriculum Support", label: "Curriculum Support" },
  { value: "Skill Programs", label: "Skill Programs" },
  { value: "Placement Readiness", label: "Placement Readiness" },
] as const;

const studentStrengths = [
  { value: "under-100", label: "Under 100" },
  { value: "100-500", label: "100 – 500" },
  { value: "500-1000", label: "500 – 1,000" },
  { value: "1000-plus", label: "1,000+" },
] as const;

export function InstitutionEnquiryForm({ idPrefix }: { idPrefix: string }) {
  const { status, errors, message, onSubmit, reset } = useEnquirySubmit({
    multiFields: ["interest"],
    validate: (data) => {
      const errors: Record<string, string> = {};
      requireText(data, "institutionName", "Please enter your institution's name.", errors);
      requireText(data, "contactName", "Please enter a contact person.", errors);
      requireEmail(data, errors);
      requireText(data, "phone", "Please enter a phone number.", errors);
      requireText(data, "institutionType", "Please select an institution type.", errors);
      return errors;
    },
    subject: (data) => `Institution partnership enquiry - ${data.institutionName}`,
    bodyLines: (data) => [
      `Institution: ${data.institutionName}`,
      `Contact person: ${data.contactName}${data.designation ? ` (${data.designation})` : ""}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "-"}`,
      `Institution type: ${institutionTypes.find((t) => t.value === data.institutionType)?.label ?? "-"}`,
      `Approx. student strength: ${studentStrengths.find((s) => s.value === data.studentStrength)?.label ?? "-"}`,
      `Area of interest: ${data.interest || "-"}`,
      "",
      data.message || "(no message)",
    ],
  });

  if (status === "success") return <EnquirySuccess message={message} onReset={reset} />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <input type="hidden" name="audience" value="institution" />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          idPrefix={idPrefix}
          name="institutionName"
          label="Institution name"
          autoComplete="organization"
          required
          error={errors.institutionName}
        />
        <TextField
          idPrefix={idPrefix}
          name="contactName"
          label="Contact person"
          autoComplete="name"
          required
          error={errors.contactName}
        />
        <TextField idPrefix={idPrefix} name="designation" label="Designation" optional />
        <TextField
          idPrefix={idPrefix}
          name="email"
          label="Official email"
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
          required
          error={errors.phone}
        />
        <SelectField
          idPrefix={idPrefix}
          name="institutionType"
          label="Institution type"
          options={institutionTypes}
          required
          error={errors.institutionType}
        />
      </div>

      <div className="mt-6">
        <SelectField
          idPrefix={idPrefix}
          name="studentStrength"
          label="Approx. student strength"
          options={studentStrengths}
          optional
        />
      </div>

      <div className="mt-6">
        <PillGroupField
          idPrefix={idPrefix}
          name="interest"
          legend="Area of interest"
          options={institutionInterests}
          optional
          kind="checkbox"
        />
      </div>

      <div className="mt-6">
        <TextAreaField
          idPrefix={idPrefix}
          name="message"
          label="Tell us about your institution's needs"
          optional
        />
      </div>

      <SubmitRow status={status} message={message} tone="institutions" />
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* prephasz - B2C placement-preparation enquiry                               */
/* -------------------------------------------------------------------------- */

const prephaszRoles = [
  { value: "student", label: "Student" },
  { value: "recent-graduate", label: "Recent graduate" },
  { value: "working-professional", label: "Working professional" },
] as const;

const prephaszFocus = [
  { value: "Practice", label: "Practice" },
  { value: "Assessments", label: "Assessments" },
  { value: "Interview Prep", label: "Interview Prep" },
  { value: "Recruitment Readiness", label: "Recruitment Readiness" },
] as const;

export function PrephaszEnquiryForm({ idPrefix }: { idPrefix: string }) {
  const { status, errors, message, onSubmit, reset } = useEnquirySubmit({
    multiFields: ["focus"],
    validate: (data) => {
      const errors: Record<string, string> = {};
      requireText(data, "name", "Please enter your name.", errors);
      requireEmail(data, errors);
      requireText(data, "phone", "Please enter a phone number.", errors);
      requireText(data, "role","Please tell us who you are.", errors);
      return errors;
    },
    subject: (data) => `prephasz enquiry - ${data.name}`,
    bodyLines: (data) => [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "-"}`,
      `I am a: ${prephaszRoles.find((r) => r.value === data.role)?.label ?? "-"}`,
      `Looking for help with: ${data.focus || "-"}`,
      "",
      data.message || "(no message)",
    ],
  });

  if (status === "success") return <EnquirySuccess message={message} onReset={reset} />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <input type="hidden" name="audience" value="student" />

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
          required
          error={errors.phone}
        />
        <SelectField
          idPrefix={idPrefix}
          name="role"
          label="I am a"
          options={prephaszRoles}
          required
          error={errors.role}
        />
      </div>

      <div className="mt-6">
        <PillGroupField
          idPrefix={idPrefix}
          name="focus"
          legend="What would you like help with?"
          options={prephaszFocus}
          optional
          kind="checkbox"
        />
      </div>

      <div className="mt-6">
        <TextAreaField
          idPrefix={idPrefix}
          name="message"
          label="Anything specific you'd like us to know?"
          optional
        />
      </div>

      <SubmitRow status={status} message={message} tone="prephasz" />
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Global Finance Program (B.Com + ACCA) - academic admissions enquiry        */
/* -------------------------------------------------------------------------- */

const financeEnquirerTypes = [
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent or guardian" },
] as const;

const financeQualifications = [
  { value: "class-11", label: "Class 11" },
  { value: "class-12", label: "Class 12" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "other", label: "Other" },
] as const;

export function GlobalFinanceEnquiryForm({ idPrefix }: { idPrefix: string }) {
  const { status, errors, message, onSubmit, reset } = useEnquirySubmit({
    validate: (data) => {
      const errors: Record<string, string> = {};
      requireText(data, "name", "Please enter your name.", errors);
      requireEmail(data, errors);
      requireText(data, "phone", "Please enter a phone number so a counsellor can call you back.", errors);
      requireText(data, "enquirerType", "Please tell us who you are enquiring as.", errors);
      requireText(data, "qualification", "Please select your current qualification.", errors);
      return errors;
    },
    subject: (data) => `Global Finance Program enquiry - ${data.name}`,
    bodyLines: (data) => [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Enquiring as: ${financeEnquirerTypes.find((t) => t.value === data.enquirerType)?.label ?? "-"}`,
      `Qualification: ${financeQualifications.find((q) => q.value === data.qualification)?.label ?? "-"}`,
      `City: ${data.city || "-"}`,
      "",
      data.message || "(no message)",
    ],
  });

  if (status === "success") return <EnquirySuccess message={message} onReset={reset} />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <input type="hidden" name="audience" value="student" />

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
          required
          error={errors.phone}
        />
        <TextField idPrefix={idPrefix} name="city" label="City" autoComplete="address-level2" optional />
      </div>

      <div className="mt-6">
        <PillGroupField
          idPrefix={idPrefix}
          name="enquirerType"
          legend="I am enquiring as"
          options={financeEnquirerTypes}
          required
          error={errors.enquirerType}
        />
      </div>

      <div className="mt-6">
        <SelectField
          idPrefix={idPrefix}
          name="qualification"
          label="Currently studying / highest qualification"
          options={financeQualifications}
          required
          error={errors.qualification}
        />
      </div>

      <div className="mt-6">
        <TextAreaField idPrefix={idPrefix} name="message" label="Questions about the program?" optional />
      </div>

      <SubmitRow status={status} message={message} tone="commerce" />
    </form>
  );
}

/* -------------------------------------------------------------------------- */

function SubmitRow({ status, message, tone }: { status: string; message: string; tone: Vertical }) {
  return (
    <>
      {status === "error" ? (
        <p role="alert" className="mt-5 text-[0.875rem] text-[#c0392b]">
          {message}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="vertical" tone={tone}>
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
    </>
  );
}

export function VerticalEnquiryForm({ vertical, idPrefix }: { vertical: Vertical; idPrefix: string }) {
  switch (vertical) {
    case "institutions":
      return <InstitutionEnquiryForm idPrefix={idPrefix} />;
    case "prephasz":
      return <PrephaszEnquiryForm idPrefix={idPrefix} />;
    case "commerce":
      return <GlobalFinanceEnquiryForm idPrefix={idPrefix} />;
  }
}
