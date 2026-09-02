type FormEndpointName =
  | "PUBLIC_CONTACT_FORM_ENDPOINT"
  | "PUBLIC_VOLUNTEER_FORM_ENDPOINT"
  | "PUBLIC_AMBASSADOR_FORM_ENDPOINT"
  | "PUBLIC_JJ_FORM_ENDPOINT"
  | "PUBLIC_NEWSLETTER_FORM_ENDPOINT";

const value = (name: FormEndpointName) => (import.meta.env[name] ?? "").trim();
const endpoint = (name: FormEndpointName, fallback: string) => value(name) || fallback;

// Contact topics intentionally share one Formspree form. The selected topic and
// event are submitted as fields so notifications can be sorted in Zoho without
// requiring separate mailbox aliases or Cloudflare Email Sending.
export const contactFormEndpoint = value("PUBLIC_CONTACT_FORM_ENDPOINT");
export const volunteerFormEndpoint = endpoint("PUBLIC_VOLUNTEER_FORM_ENDPOINT", "/api/forms/volunteer");
export const ambassadorFormEndpoint = endpoint("PUBLIC_AMBASSADOR_FORM_ENDPOINT", "/api/forms/ambassador");

export const contactTopicEndpoints = {
  "Ticket question": contactFormEndpoint,
  "Group discount": contactFormEndpoint,
  "Partnership or ambassador": contactFormEndpoint,
  "Media or photographer": contactFormEndpoint,
  Volunteer: contactFormEndpoint,
  "General question": contactFormEndpoint,
} as const;

// Jack & Jill includes a photo upload and remains separate until its dedicated
// upload/storage flow is enabled.
export const jjFormEndpoint = value("PUBLIC_JJ_FORM_ENDPOINT");
export const newsletterFormEndpoint = endpoint("PUBLIC_NEWSLETTER_FORM_ENDPOINT", "/api/forms/newsletter");
