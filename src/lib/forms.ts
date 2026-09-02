type FormEndpointName =
  | "PUBLIC_CONTACT_FORM_ENDPOINT"
  | "PUBLIC_TICKETS_FORM_ENDPOINT"
  | "PUBLIC_GROUPS_FORM_ENDPOINT"
  | "PUBLIC_PARTNERS_FORM_ENDPOINT"
  | "PUBLIC_MEDIA_FORM_ENDPOINT"
  | "PUBLIC_VOLUNTEER_FORM_ENDPOINT"
  | "PUBLIC_AMBASSADOR_FORM_ENDPOINT"
  | "PUBLIC_JJ_FORM_ENDPOINT"
  | "PUBLIC_NEWSLETTER_FORM_ENDPOINT";

const value = (name: FormEndpointName) => (import.meta.env[name] ?? "").trim();
const endpoint = (name: FormEndpointName, fallback: string) => value(name) || fallback;

// Production uses the same Cloudflare Worker that serves the site. Public
// endpoint variables can still override these paths for staging or migration.
export const contactFormEndpoint = endpoint("PUBLIC_CONTACT_FORM_ENDPOINT", "/api/forms/contact");
export const volunteerFormEndpoint = endpoint("PUBLIC_VOLUNTEER_FORM_ENDPOINT", "/api/forms/volunteer");
export const ambassadorFormEndpoint = endpoint("PUBLIC_AMBASSADOR_FORM_ENDPOINT", "/api/forms/ambassador");

export const contactTopicEndpoints = {
  "Ticket question": endpoint("PUBLIC_TICKETS_FORM_ENDPOINT", "/api/forms/tickets"),
  "Group discount": endpoint("PUBLIC_GROUPS_FORM_ENDPOINT", "/api/forms/groups"),
  "Partnership or ambassador": endpoint("PUBLIC_PARTNERS_FORM_ENDPOINT", "/api/forms/partners"),
  "Media or photographer": endpoint("PUBLIC_MEDIA_FORM_ENDPOINT", "/api/forms/media"),
  Volunteer: volunteerFormEndpoint,
  "General question": contactFormEndpoint,
} as const;

// Jack & Jill includes a photo upload and remains separate until its dedicated
// upload/storage flow is enabled.
export const jjFormEndpoint = value("PUBLIC_JJ_FORM_ENDPOINT");
export const newsletterFormEndpoint = endpoint("PUBLIC_NEWSLETTER_FORM_ENDPOINT", "/api/forms/newsletter");
