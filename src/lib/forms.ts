const value = (name: "PUBLIC_CONTACT_FORM_ENDPOINT" | "PUBLIC_NEWSLETTER_FORM_ENDPOINT") =>
  (import.meta.env[name] ?? "").trim();

export const contactFormEndpoint = value("PUBLIC_CONTACT_FORM_ENDPOINT");
export const newsletterFormEndpoint = value("PUBLIC_NEWSLETTER_FORM_ENDPOINT");
