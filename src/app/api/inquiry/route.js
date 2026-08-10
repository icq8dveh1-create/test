import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_PATTERN = /^[+\d\s().-]+$/;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

const rateBuckets = globalThis.__velpawInquiryRateBuckets || new Map();
globalThis.__velpawInquiryRateBuckets = rateBuckets;

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function validate(payload) {
  const errors = {};
  if (!payload.name) errors.name = "Name is required.";
  if (!payload.email) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(payload.email)) errors.email = "Email format is invalid.";
  if (!payload.phone) errors.phone = "Phone is required.";
  else {
    const digits = payload.phone.replace(/\D/g, "").length;
    if (!PHONE_CHARS_PATTERN.test(payload.phone) || digits < 7 || digits > 15) {
      errors.phone = "Phone format is invalid.";
    }
  }
  return errors;
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateBuckets.get(ip) || []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  recent.push(now);
  rateBuckets.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

async function storeInquiry(inquiry) {
  const storagePath = path.join(process.cwd(), ".data", "inquiries.jsonl");
  await mkdir(path.dirname(storagePath), { recursive: true });
  await appendFile(storagePath, `${JSON.stringify(inquiry)}\n`, "utf8");
  return "local-storage";
}

async function sendEmail(inquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) return null;

  const text = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Company: ${inquiry.company || "Not provided"}`,
    `Country / Region: ${inquiry.country || "Not provided"}`,
    `Product Requirement: ${inquiry.productRequirement || "Not provided"}`,
    "",
    "Message:",
    inquiry.message || "Not provided",
    "",
    `Inquiry ID: ${inquiry.id}`,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": inquiry.id,
      "User-Agent": "VELPAW-Inquiry-Form/1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject: `New B2B inquiry from ${inquiry.name}`,
      text,
    }),
  });
  if (!response.ok) throw new Error(`Email delivery failed with status ${response.status}.`);
  return "email";
}

async function sendWebhook(inquiry) {
  const url = process.env.INQUIRY_WEBHOOK_URL;
  if (!url) return null;
  const headers = { "Content-Type": "application/json" };
  if (process.env.INQUIRY_WEBHOOK_TOKEN) {
    headers.Authorization = `Bearer ${process.env.INQUIRY_WEBHOOK_TOKEN}`;
  }
  const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(inquiry) });
  if (!response.ok) throw new Error(`Webhook delivery failed with status ${response.status}.`);
  return "webhook";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request payload." }, { status: 400 });
  }

  if (clean(body.website, 200)) {
    return Response.json({ success: true, message: "Your inquiry has been received." });
  }

  const ip = clean(request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "local", 80);
  if (isRateLimited(ip)) {
    return Response.json({ success: false, message: "Too many attempts. Please wait and try again." }, { status: 429 });
  }

  const inquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: clean(body.name, 100),
    email: clean(body.email, 160).toLowerCase(),
    phone: `${clean(body.phoneCode, 8)} ${clean(body.phone, 30)}`.trim(),
    company: clean(body.company, 160),
    country: clean(body.country, 120),
    productRequirement: clean(body.productRequirement, 160),
    message: clean(body.message, 2000),
  };
  const errors = validate(inquiry);
  if (Object.keys(errors).length) {
    return Response.json({ success: false, message: "Please correct the highlighted fields.", errors }, { status: 422 });
  }

  const deliveries = await Promise.allSettled([
    storeInquiry(inquiry),
    sendEmail(inquiry),
    sendWebhook(inquiry),
  ]);
  const completed = deliveries
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);

  if (!completed.length) {
    console.error("Inquiry delivery failed", deliveries);
    return Response.json({ success: false, message: "We could not save your inquiry. Please try again." }, { status: 500 });
  }

  return Response.json({
    success: true,
    message: "Your inquiry has been received.",
    inquiryId: inquiry.id,
    delivery: completed,
  });
}
