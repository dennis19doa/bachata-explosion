type FormEndpointName =
  | "PUBLIC_CONTACT_FORM_ENDPOINT"
  | "PUBLIC_VOLUNTEER_FORM_ENDPOINT"
  | "PUBLIC_AMBASSADOR_FORM_ENDPOINT"
  | "PUBLIC_JJ_FORM_ENDPOINT"
  | "PUBLIC_NEWSLETTER_FORM_ENDPOINT";

const value = (name: FormEndpointName) => (import.meta.env[name] ?? "").trim();
const endpoint = (name: FormEndpointName, fallback: string) => value(name) || fallback;

// Website forms post to the same Cloudflare Worker that serves the site.
// The Worker delivers notifications directly through the studio's Zoho SMTP
// account, so no Formspree, Brevo, or Cloudflare Email Sending service is needed.
export const contactFormEndpoint = endpoint("PUBLIC_CONTACT_FORM_ENDPOINT", "/api/forms/contact");
export const volunteerFormEndpoint = endpoint("PUBLIC_VOLUNTEER_FORM_ENDPOINT", "/api/forms/volunteer");
export const ambassadorFormEndpoint = endpoint("PUBLIC_AMBASSADOR_FORM_ENDPOINT", "/api/forms/ambassador");

export const contactTopicEndpoints = {
  "Ticket question": "/api/forms/tickets",
  "Group discount": "/api/forms/groups",
  "Partnership or ambassador": "/api/forms/partners",
  "Media or photographer": "/api/forms/media",
  Volunteer: volunteerFormEndpoint,
  "General question": contactFormEndpoint,
} as const;

// Jack & Jill includes a photo upload and remains separate until its dedicated
// upload/storage flow is enabled.
export const jjFormEndpoint = value("PUBLIC_JJ_FORM_ENDPOINT");
export const newsletterFormEndpoint = endpoint("PUBLIC_NEWSLETTER_FORM_ENDPOINT", "/api/forms/newsletter");
