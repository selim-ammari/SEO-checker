import { z } from "zod";
import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

export const MAX_URL_LENGTH = 2048;
export const ALLOWED_PORTS = new Set([80, 443]);

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
]);

export class UrlValidationError extends Error {
  readonly code: string;

  constructor(message: string, code = "INVALID_URL") {
    super(message);
    this.name = "UrlValidationError";
    this.code = code;
  }
}

const urlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .max(MAX_URL_LENGTH, `URL must be at most ${MAX_URL_LENGTH} characters`);

function isIpv4PrivateOrReserved(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return true;
  }

  const [a, b] = parts;

  // 0.0.0.0/8
  if (a === 0) return true;
  // 10.0.0.0/8
  if (a === 10) return true;
  // 127.0.0.0/8 loopback
  if (a === 127) return true;
  // 169.254.0.0/16 link-local
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;
  // 100.64.0.0/10 CGNAT
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 192.0.0.0/24
  if (a === 192 && b === 0) return true;
  // 192.0.2.0/24 TEST-NET-1
  if (a === 192 && b === 0 && parts[2] === 2) return true;
  // 198.51.100.0/24 TEST-NET-2
  if (a === 198 && b === 51 && parts[2] === 100) return true;
  // 203.0.113.0/24 TEST-NET-3
  if (a === 203 && b === 0 && parts[2] === 113) return true;
  // 224.0.0.0/4 multicast + 240.0.0.0/4 reserved
  if (a >= 224) return true;

  return false;
}

function isIpv6PrivateOrReserved(ip: string): boolean {
  const normalized = ip.toLowerCase();

  if (normalized === "::" || normalized === "::1") return true;
  if (normalized.startsWith("fe80:")) return true; // link-local
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // unique local
  if (normalized.startsWith("ff")) return true; // multicast

  // IPv4-mapped IPv6 :ffff:x.x.x.x
  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isIpv4PrivateOrReserved(mapped[1]);

  return false;
}

export function isBlockedIpAddress(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isIpv4PrivateOrReserved(ip);
  if (version === 6) return isIpv6PrivateOrReserved(ip);
  return true;
}

function assertAllowedHostname(hostname: string): void {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  if (!host) {
    throw new UrlValidationError("URL hostname is missing", "INVALID_HOST");
  }

  if (BLOCKED_HOSTNAMES.has(host)) {
    throw new UrlValidationError("This hostname is not allowed", "BLOCKED_HOST");
  }

  if (host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new UrlValidationError("This hostname is not allowed", "BLOCKED_HOST");
  }

  const ipVersion = isIP(host);
  if (ipVersion !== 0 && isBlockedIpAddress(host)) {
    throw new UrlValidationError("Private or reserved IP addresses are not allowed", "BLOCKED_IP");
  }
}

function assertAllowedPort(parsed: URL): void {
  const port = parsed.port
    ? Number(parsed.port)
    : parsed.protocol === "https:"
      ? 443
      : 80;

  if (!ALLOWED_PORTS.has(port)) {
    throw new UrlValidationError("Only standard HTTP(S) ports (80, 443) are allowed", "BLOCKED_PORT");
  }
}

/**
 * Parse and validate a user-supplied URL string (syntax + SSRF hostname/port rules).
 * Does not resolve DNS — call assertPublicResolvedAddress for that.
 */
export function parseAndValidateUrl(rawUrl: string): URL {
  const parsedInput = urlSchema.safeParse(rawUrl);
  if (!parsedInput.success) {
    throw new UrlValidationError(parsedInput.error.issues[0]?.message ?? "Invalid URL");
  }

  let parsed: URL;
  try {
    parsed = new URL(parsedInput.data);
  } catch {
    throw new UrlValidationError("Please enter a valid URL (e.g. https://example.com)");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new UrlValidationError("Only HTTP and HTTPS URLs are allowed", "BLOCKED_PROTOCOL");
  }

  if (parsed.username || parsed.password) {
    throw new UrlValidationError("URLs with credentials are not allowed", "BLOCKED_CREDENTIALS");
  }

  assertAllowedHostname(parsed.hostname);
  assertAllowedPort(parsed);

  return parsed;
}

export async function assertPublicResolvedAddress(hostname: string): Promise<void> {
  const host = hostname.replace(/^\[|\]$/g, "");

  // Literal IPs already checked in parseAndValidateUrl
  if (isIP(host) !== 0) {
    if (isBlockedIpAddress(host)) {
      throw new UrlValidationError("Private or reserved IP addresses are not allowed", "BLOCKED_IP");
    }
    return;
  }

  let addresses: Array<{ address: string; family: number }>;
  try {
    addresses = await lookup(host, { all: true, verbatim: true });
  } catch {
    throw new UrlValidationError("Could not resolve this hostname", "DNS_FAILED");
  }

  if (!addresses.length) {
    throw new UrlValidationError("Could not resolve this hostname", "DNS_FAILED");
  }

  for (const { address } of addresses) {
    if (isBlockedIpAddress(address)) {
      throw new UrlValidationError(
        "This hostname resolves to a private or reserved address",
        "BLOCKED_IP",
      );
    }
  }
}

export async function validateUrlForFetch(rawUrl: string): Promise<URL> {
  const parsed = parseAndValidateUrl(rawUrl);
  await assertPublicResolvedAddress(parsed.hostname);
  return parsed;
}
