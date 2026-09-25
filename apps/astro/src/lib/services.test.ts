import { describe, expect, it } from "vitest";
import {
  comparison,
  getAllServiceSlugs,
  getServiceBySlug,
  services,
} from "./services";

describe("services lib", () => {
  it("exposes exactly the four services with unique slugs", () => {
    expect(services).toHaveLength(4);
    expect(new Set(getAllServiceSlugs()).size).toBe(4);
  });

  it("resolves every slug exposed by getAllServiceSlugs", () => {
    for (const slug of getAllServiceSlugs()) {
      expect(getServiceBySlug(slug)).toBeDefined();
    }
  });

  it("returns undefined for unknown slugs", () => {
    expect(getServiceBySlug("nope")).toBeUndefined();
  });

  it("has a comparison table aligned with the service list", () => {
    expect(comparison).toHaveLength(services.length);
  });

  it("describes every service with the required metadata", () => {
    for (const service of services) {
      expect(service.metaDescription.length).toBeGreaterThan(0);
      expect(service.benefits.length).toBeGreaterThan(0);
      expect(service.features.length).toBeGreaterThan(0);
      expect(service.targetAudience.length).toBeGreaterThan(0);
    }
  });
});