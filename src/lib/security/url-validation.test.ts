import { describe, expect, it } from "vitest";
import {
  isBlockedIpAddress,
  parseAndValidateUrl,
  UrlValidationError,
} from "@/lib/security/url-validation";

describe("parseAndValidateUrl", () => {
  it("accepts https URLs", () => {
    const url = parseAndValidateUrl("https://example.com/path");
    expect(url.hostname).toBe("example.com");
    expect(url.protocol).toBe("https:");
  });

  it("rejects non-http protocols", () => {
    expect(() => parseAndValidateUrl("ftp://example.com")).toThrow(UrlValidationError);
    expect(() => parseAndValidateUrl("javascript:alert(1)")).toThrow(UrlValidationError);
  });

  it("rejects localhost and loopback", () => {
    expect(() => parseAndValidateUrl("http://localhost")).toThrow(UrlValidationError);
    expect(() => parseAndValidateUrl("http://127.0.0.1")).toThrow(UrlValidationError);
    expect(() => parseAndValidateUrl("http://0.0.0.0")).toThrow(UrlValidationError);
    expect(() => parseAndValidateUrl("http://[::1]/")).toThrow(UrlValidationError);
  });

  it("rejects private IPs", () => {
    expect(() => parseAndValidateUrl("http://192.168.1.1")).toThrow(UrlValidationError);
    expect(() => parseAndValidateUrl("http://10.0.0.5")).toThrow(UrlValidationError);
    expect(() => parseAndValidateUrl("http://172.16.0.1")).toThrow(UrlValidationError);
    expect(() => parseAndValidateUrl("http://169.254.10.1")).toThrow(UrlValidationError);
  });

  it("rejects non-standard ports", () => {
    expect(() => parseAndValidateUrl("https://example.com:8443")).toThrow(UrlValidationError);
  });

  it("rejects credentials in URL", () => {
    expect(() => parseAndValidateUrl("https://user:pass@example.com")).toThrow(
      UrlValidationError,
    );
  });

  it("rejects overly long URLs", () => {
    const long = `https://example.com/${"a".repeat(3000)}`;
    expect(() => parseAndValidateUrl(long)).toThrow(UrlValidationError);
  });
});

describe("isBlockedIpAddress", () => {
  it("blocks reserved ranges", () => {
    expect(isBlockedIpAddress("127.0.0.1")).toBe(true);
    expect(isBlockedIpAddress("10.1.2.3")).toBe(true);
    expect(isBlockedIpAddress("192.168.0.1")).toBe(true);
    expect(isBlockedIpAddress("169.254.1.1")).toBe(true);
    expect(isBlockedIpAddress("::1")).toBe(true);
    expect(isBlockedIpAddress("fc00::1")).toBe(true);
  });

  it("allows public IPs", () => {
    expect(isBlockedIpAddress("8.8.8.8")).toBe(false);
    expect(isBlockedIpAddress("1.1.1.1")).toBe(false);
  });
});
