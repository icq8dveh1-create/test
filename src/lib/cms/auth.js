import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "velpaw_admin_session";
const DEV_USERNAME = "admin";
const SESSION_SECONDS = 60 * 60 * 12;

function configuredUsername() {
  return process.env.ADMIN_USERNAME || DEV_USERNAME;
}

function configuredPassword() {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD must be configured.");
  }
  return process.env.ADMIN_PASSWORD;
}

function sessionSecret() {
  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_SESSION_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET must be configured in production.");
  }
  return process.env.ADMIN_SESSION_SECRET || "velpaw-local-session-change-before-deploy";
}

function safeEqual(left, right) {
  const salt = "velpaw-admin-credentials";
  const leftHash = scryptSync(String(left), salt, 32);
  const rightHash = scryptSync(String(right), salt, 32);
  return timingSafeEqual(leftHash, rightHash);
}

function sign(payload) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function createToken(username) {
  const payload = Buffer.from(JSON.stringify({ username, expiresAt: Date.now() + SESSION_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function parseToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.expiresAt < Date.now() || data.username !== configuredUsername()) return null;
    return { username: data.username };
  } catch {
    return null;
  }
}

export function verifyCredentials(username, password) {
  return safeEqual(username, configuredUsername()) && safeEqual(password, configuredPassword());
}

export async function createAdminSession(username) {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminUser() {
  const store = await cookies();
  return parseToken(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function assertAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
