import { connect } from "cloudflare:sockets";

type AssetBinding = { fetch(request: Request): Promise<Response> };

type Env = {
  ASSETS: AssetBinding;
  TURNSTILE_SECRET?: string;
  ZOHO_SMTP_HOST?: string;
  ZOHO_SMTP_PORT?: string;
  ZOHO_SMTP_USER?: string;
  ZOHO_SMTP_PASSWORD?: string;
  ZOHO_SMTP_FROM?: string;
  ZOHO_SMTP_FROM_NAME?: string;
  FORM_CONTACT_TO?: string;
};

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const MAX_FORM_BYTES = 512_000;

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

function utf8Base64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function wrapBase64(value: string) {
  return value.match(/.{1,76}/g)?.join("\r\n") || "";
}

function mimeHeader(value: string) {
  return `=?UTF-8?B?${utf8Base64(value)}?=`;
}

async function sendZohoSmtpMail(
  toAddress: string,
  replyTo: string,
  subject: string,
  content: string,
  env: Env,
) {
  const username = env.ZOHO_SMTP_USER?.trim();
  const password = env.ZOHO_SMTP_PASSWORD?.trim();
  if (!username || !password) throw new Error("Zoho SMTP credentials are not configured");

  const host = env.ZOHO_SMTP_HOST?.trim() || "smtp.zoho.eu";
  const port = Number(env.ZOHO_SMTP_PORT || "465");
  const fromAddress = env.ZOHO_SMTP_FROM?.trim() || username;
  const fromName = env.ZOHO_SMTP_FROM_NAME?.trim() || "Bachata Explosion Website";

  const socket = connect({ hostname: host, port }, { secureTransport: "on" });
  await socket.opened;

  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  const readReply = async () => {
    const lines: string[] = [];
    while (true) {
      let separator = buffer.indexOf("\r\n");
      while (separator >= 0) {
        const line = buffer.slice(0, separator);
        buffer = buffer.slice(separator + 2);
        lines.push(line);
        if (/^\d{3} /.test(line)) {
          return { code: Number(line.slice(0, 3)), text: lines.join("\n") };
        }
        separator = buffer.indexOf("\r\n");
      }

      const { value, done } = await reader.read();
      if (done) throw new Error("Zoho SMTP connection closed unexpectedly");
      buffer += decoder.decode(value, { stream: true });
    }
  };

  const writeLine = async (line: string) => {
    await writer.write(encoder.encode(`${line}\r\n`));
  };

  const command = async (line: string, accepted: number[]) => {
    await writeLine(line);
    const reply = await readReply();
    if (!accepted.includes(reply.code)) {
      throw new Error(`Zoho SMTP returned ${reply.code}: ${reply.text.slice(0, 300)}`);
    }
    return reply;
  };

  try {
    const greeting = await readReply();
    if (greeting.code !== 220) throw new Error(`Zoho SMTP greeting failed: ${greeting.text.slice(0, 300)}`);

    await command("EHLO bachataexplosion.com", [250]);
    await command("AUTH LOGIN", [334]);
    await command(btoa(username), [334]);
    await command(btoa(password), [235]);
    await command(`MAIL FROM:<${fromAddress}>`, [250]);
    await command(`RCPT TO:<${toAddress}>`, [250, 251]);
    await command("DATA", [354]);

    const message = [
      `From: ${mimeHeader(fromName)} <${fromAddress}>`,
      `To: <${toAddress}>`,
      `Reply-To: <${replyTo}>`,
      `Subject: ${mimeHeader(subject)}`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(utf8Base64(content)),
      "",
    ].join("\r\n");

    await writer.write(encoder.encode(`${message}.\r\n`));
    const accepted = await readReply();
    if (accepted.code !== 250) {
      throw new Error(`Zoho SMTP rejected the message: ${accepted.text.slice(0, 300)}`);
    }

    await writeLine("QUIT");
    await readReply().catch(() => undefined);
  } finally {
    reader.releaseLock();
    writer.releaseLock();
    await socket.close().catch(() => undefined);
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

  const { subject, content } = renderEmail(kind, values);
  const destination = env.FORM_CONTACT_TO || "info@bachataexplosion.com";
  await sendZohoSmtpMail(destination, email, subject, content, env);
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
        const detail = error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : { name: "UnknownError", message: String(error) };
        console.error("Form delivery failed detail", JSON.stringify(detail));
        return json({ ok: false, error: "We could not deliver the form right now. Please try again shortly." }, 502);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
