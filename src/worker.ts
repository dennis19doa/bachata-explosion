type AssetBinding = { fetch(request: Request): Promise<Response> };

type Env = {
  ASSETS: AssetBinding;
  TURNSTILE_SECRET?: string;
  BREVO_API_KEY?: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_SENDER_NAME?: string;
  FORM_CONTACT_TO?: string;
};

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const MAX_FORM_BYTES = 512_000;
const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });

const escapeHtml = (value: string) =>
  value.replace(/[&<>'\"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '\"': "&quot;",
  }[char] ?? char));

const kindLabel = (kind: string) => ({
  contact: "General contact",
  tickets: "Ticket question",
  groups: "Group discount",
  partners: "Partnership / ambassador",
  media: "Media request",
  volunteer: "Volunteer application",
  ambassador: "Ambassador application",
  newsletter: "Newsletter signup",
}[kind] || kind);

async function verifyTurnstile(request: Request, form: FormData, env: Env) {
  if (!env.TURNSTILE_SECRET) return true;
  const token = String(form.get("cf-turnstile-response") || "");
  if (!token) return false;

  const payload = new FormData();
  payload.append("secret", env.TURNSTILE_SECRET);
  payload.append("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) payload.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: payload,
  });
  if (!response.ok) return false;
  const result = await response.json<{ success?: boolean }>();
  return Boolean(result.success);
}

function serialiseForm(form: FormData) {
  const values = new Map<string, string[]>();
  for (const [key, raw] of form.entries()) {
    if (key === "cf-turnstile-response" || key === "_gotcha") continue;
    if (typeof raw !== "string") continue;
    const value = raw.trim();
    if (!value) continue;
    const existing = values.get(key) || [];
    existing.push(value);
    values.set(key, existing);
  }
  return values;
}

function applicantName(values: Map<string, string[]>) {
  return [values.get("first_name")?.[0], values.get("last_name")?.[0]]
    .filter(Boolean)
    .join(" ") || values.get("name")?.[0] || values.get("full_name")?.[0] || "Website visitor";
}

function renderEmail(kind: string, values: Map<string, string[]>) {
  const label = kindLabel(kind);
  const applicant = applicantName(values);
  const rows = Array.from(values.entries()).map(([key, entries]) => {
    const fieldLabel = key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    return `<tr><th style="text-align:left;vertical-align:top;padding:9px 12px;border-bottom:1px solid #e6e6e6">${escapeHtml(fieldLabel)}</th><td style="padding:9px 12px;border-bottom:1px solid #e6e6e6">${entries.map(escapeHtml).join("<br>")}</td></tr>`;
  }).join("");

  return {
    applicant,
    subject: `[Bachata Explosion] ${label} — ${applicant}`,
    content: `<div style="font-family:Arial,sans-serif;max-width:760px"><h2>${escapeHtml(label)}</h2><p>Submitted through bachataexplosion.com.</p><table style="border-collapse:collapse;width:100%">${rows}</table></div>`,
  };
}

async function sendBrevoMail(
  toAddress: string,
  replyTo: string,
  replyToName: string,
  subject: string,
  content: string,
  env: Env,
) {
  if (!env.BREVO_API_KEY) throw new Error("BREVO_API_KEY is not configured");

  const senderEmail = env.BREVO_SENDER_EMAIL || "info@bachataexplosion.com";
  const senderName = env.BREVO_SENDER_NAME || "Bachata Explosion Website";

  const response = await fetch(BREVO_SEND_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: toAddress, name: "Bachata Explosion" }],
      replyTo: { email: replyTo, name: replyToName },
      subject,
      htmlContent: content,
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`Brevo returned ${response.status}: ${detail}`);
  }
}

async function handleForm(request: Request, env: Env, kind: string) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_FORM_BYTES) return json({ ok: false, error: "Submission is too large" }, 413);

  const origin = request.headers.get("origin");
  if (origin) {
    const originUrl = new URL(origin);
    if (originUrl.hostname !== "bachataexplosion.com" && originUrl.hostname !== "www.bachataexplosion.com") {
      return json({ ok: false, error: "Origin not allowed" }, 403);
    }
  }

  const form = await request.formData();
  if (String(form.get("_gotcha") || "").trim()) return json({ ok: true });

  const turnstileValid = await verifyTurnstile(request, form, env);
  if (!turnstileValid) return json({ ok: false, error: "Please confirm that you are human and try again." }, 400);

  const values = serialiseForm(form);
  const email = values.get("email")?.[0];
  if (!email || !email.includes("@")) {
    return json({ ok: false, error: "A valid email address is required." }, 400);
  }

  const { applicant, subject, content } = renderEmail(kind, values);
  const destination = env.FORM_CONTACT_TO || "info@bachataexplosion.com";
  await sendBrevoMail(destination, email, applicant, subject, content, env);
  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/api\/forms\/(contact|tickets|groups|partners|media|volunteer|ambassador|newsletter)\/?$/);
    if (match) {
      try {
        return await handleForm(request, env, match[1]);
      } catch (error) {
        console.error("Form delivery failed", error);
        return json({ ok: false, error: "We could not deliver the form right now. Please try again shortly." }, 502);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
