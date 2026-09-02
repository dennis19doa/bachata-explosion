type AssetBinding = { fetch(request: Request): Promise<Response> };
type EmailBinding = {
  send(message: {
    to: string;
    from: string;
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string;
  }): Promise<unknown>;
};

type Env = {
  ASSETS: AssetBinding;
  EMAIL?: EmailBinding;
  TURNSTILE_SECRET?: string;
  FORM_FROM_ADDRESS?: string;
  ZOHO_CLIENT_ID?: string;
  ZOHO_CLIENT_SECRET?: string;
  ZOHO_REFRESH_TOKEN?: string;
  ZOHO_ACCOUNT_ID?: string;
  ZOHO_FROM_ADDRESS?: string;
  ZOHO_ACCOUNTS_BASE?: string;
  ZOHO_MAIL_BASE?: string;
  FORM_CONTACT_TO?: string;
  FORM_TICKETS_TO?: string;
  FORM_GROUPS_TO?: string;
  FORM_PARTNERS_TO?: string;
  FORM_MEDIA_TO?: string;
  FORM_VOLUNTEER_TO?: string;
  FORM_AMBASSADOR_TO?: string;
  FORM_NEWSLETTER_TO?: string;
};

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const MAX_FORM_BYTES = 512_000;

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  }[char] ?? char));

const plainText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();

const destinationFor = (kind: string, env: Env) => {
  // Until separate aliases are intentionally configured as Worker destinations,
  // all forms safely land in the verified general inbox. The original requested
  // destination is still included in the form payload for filtering/routing.
  const fallback = env.FORM_CONTACT_TO || "info@bachataexplosion.com";
  const destinations: Record<string, string | undefined> = {
    contact: env.FORM_CONTACT_TO,
    tickets: env.FORM_TICKETS_TO,
    groups: env.FORM_GROUPS_TO,
    partners: env.FORM_PARTNERS_TO,
    media: env.FORM_MEDIA_TO,
    volunteer: env.FORM_VOLUNTEER_TO,
    ambassador: env.FORM_AMBASSADOR_TO,
    newsletter: env.FORM_NEWSLETTER_TO,
  };
  return destinations[kind] || fallback;
};

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

async function getZohoAccessToken(env: Env) {
  if (!env.ZOHO_CLIENT_ID || !env.ZOHO_CLIENT_SECRET || !env.ZOHO_REFRESH_TOKEN) {
    throw new Error("Zoho OAuth is not configured");
  }

  const base = env.ZOHO_ACCOUNTS_BASE || "https://accounts.zoho.eu";
  const body = new URLSearchParams({
    refresh_token: env.ZOHO_REFRESH_TOKEN,
    client_id: env.ZOHO_CLIENT_ID,
    client_secret: env.ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  const response = await fetch(`${base}/oauth/v2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error("Could not refresh Zoho OAuth token");
  const data = await response.json<{ access_token?: string }>();
  if (!data.access_token) throw new Error("Zoho did not return an access token");
  return data.access_token;
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

function renderEmail(kind: string, values: Map<string, string[]>) {
  const applicant = [values.get("first_name")?.[0], values.get("last_name")?.[0]].filter(Boolean).join(" ") || values.get("name")?.[0] || values.get("full_name")?.[0] || "Website visitor";
  const rows = Array.from(values.entries()).map(([key, entries]) => {
    const label = key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    return `<tr><th style="text-align:left;vertical-align:top;padding:9px 12px;border-bottom:1px solid #e6e6e6">${escapeHtml(label)}</th><td style="padding:9px 12px;border-bottom:1px solid #e6e6e6">${entries.map(escapeHtml).join("<br>")}</td></tr>`;
  }).join("");

  return {
    subject: `[Bachata Explosion] ${kind} — ${applicant}`,
    content: `<div style="font-family:Arial,sans-serif;max-width:760px"><h2>${escapeHtml(kind)}</h2><p>Submitted through bachataexplosion.com.</p><table style="border-collapse:collapse;width:100%">${rows}</table></div>`,
  };
}

async function sendZohoMail(toAddress: string, subject: string, content: string, env: Env) {
  if (!env.ZOHO_ACCOUNT_ID || !env.ZOHO_FROM_ADDRESS) throw new Error("Zoho Mail account is not configured");
  const accessToken = await getZohoAccessToken(env);
  const mailBase = env.ZOHO_MAIL_BASE || "https://mail.zoho.eu";

  const response = await fetch(`${mailBase}/api/accounts/${encodeURIComponent(env.ZOHO_ACCOUNT_ID)}/messages`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
    body: JSON.stringify({
      fromAddress: env.ZOHO_FROM_ADDRESS,
      toAddress,
      subject,
      content,
      mailFormat: "html",
    }),
  });

  if (!response.ok) throw new Error(`Zoho Mail returned ${response.status}`);
}

async function sendFormMail(toAddress: string, subject: string, content: string, replyTo: string | undefined, env: Env) {
  if (env.EMAIL) {
    const from = env.FORM_FROM_ADDRESS || env.ZOHO_FROM_ADDRESS || "website@bachataexplosion.com";
    await env.EMAIL.send({
      to: toAddress,
      from,
      replyTo,
      subject,
      html: content,
      text: plainText(content),
    });
    return;
  }

  await sendZohoMail(toAddress, subject, content, env);
}

async function handleForm(request: Request, env: Env, kind: string) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_FORM_BYTES) return json({ ok: false, error: "Submission is too large" }, 413);

  const origin = request.headers.get("origin");
  if (origin) {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    if (originUrl.hostname !== requestUrl.hostname && !originUrl.hostname.endsWith(".bachataexplosion.com")) {
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

  const { subject, content } = renderEmail(kind, values);
  await sendFormMail(destinationFor(kind, env), subject, content, email, env);
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
