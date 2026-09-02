type FormEndpointName =
  | "PUBLIC_CONTACT_FORM_ENDPOINT"
  | "PUBLIC_VOLUNTEER_FORM_ENDPOINT"
  | "PUBLIC_AMBASSADOR_FORM_ENDPOINT"
  | "PUBLIC_JJ_FORM_ENDPOINT"
  | "PUBLIC_NEWSLETTER_FORM_ENDPOINT";

const value = (name: FormEndpointName) => (import.meta.env[name] ?? "").trim();
const fallbackToContact = (name: FormEndpointName) => value(name) || contactFormEndpoint;

// One Formspree form can receive the site's simple submissions and deliver them
// to info@bachataexplosion.com. Optional dedicated endpoints can still override
// individual forms later without requiring Cloudflare Email Sending.
export const contactFormEndpoint = value("PUBLIC_CONTACT_FORM_ENDPOINT");
export const volunteerFormEndpoint = fallbackToContact("PUBLIC_VOLUNTEER_FORM_ENDPOINT");
export const ambassadorFormEndpoint = fallbackToContact("PUBLIC_AMBASSADOR_FORM_ENDPOINT");

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
export const newsletterFormEndpoint = fallbackToContact("PUBLIC_NEWSLETTER_FORM_ENDPOINT");
