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

export const contactFormEndpoint = value("PUBLIC_CONTACT_FORM_ENDPOINT");
export const volunteerFormEndpoint = value("PUBLIC_VOLUNTEER_FORM_ENDPOINT") || contactFormEndpoint;
export const ambassadorFormEndpoint = value("PUBLIC_AMBASSADOR_FORM_ENDPOINT") || contactFormEndpoint;

export const contactTopicEndpoints = {
  "Ticket question": value("PUBLIC_TICKETS_FORM_ENDPOINT") || contactFormEndpoint,
  "Group discount": value("PUBLIC_GROUPS_FORM_ENDPOINT") || contactFormEndpoint,
  "Partnership or ambassador": value("PUBLIC_PARTNERS_FORM_ENDPOINT") || contactFormEndpoint,
  "Media or photographer": value("PUBLIC_MEDIA_FORM_ENDPOINT") || contactFormEndpoint,
  Volunteer: volunteerFormEndpoint,
  "General question": contactFormEndpoint,
} as const;

// Jack & Jill includes a photo upload, so it must not fall back to a standard
// URL-encoded Formspark endpoint. Keep it in preview mode until its dedicated
// upload flow has been configured.
export const jjFormEndpoint = value("PUBLIC_JJ_FORM_ENDPOINT");
export const newsletterFormEndpoint = value("PUBLIC_NEWSLETTER_FORM_ENDPOINT");
