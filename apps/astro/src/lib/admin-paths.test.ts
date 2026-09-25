import { describe, expect, it } from "vitest";
import { validateAdminPath } from "./admin-paths";

describe("validateAdminPath", () => {
  it("allows registered admin paths", () => {
    expect(validateAdminPath("/admin/stats")).toBe(true);
    expect(validateAdminPath("/admin/stats/total-proyek")).toBe(true);
    expect(validateAdminPath("/admin/team/clean-team-1")).toBe(true);
    expect(validateAdminPath("/admin/portfolio/abc-123")).toBe(true);
    expect(validateAdminPath("/admin/blog/xyz")).toBe(true);
    expect(validateAdminPath("/admin/pricing/categories/42")).toBe(true);
    expect(validateAdminPath("/admin/testimonials/7")).toBe(true);
    expect(validateAdminPath("/admin/uploads/presign")).toBe(true);
  });

  it("rejects arbitrary or unknown paths", () => {
    expect(validateAdminPath("/admin/users")).toBe(false);
    expect(validateAdminPath("/")).toBe(false);
    expect(validateAdminPath("/admin")).toBe(false);
    expect(validateAdminPath("/api/stats")).toBe(false);
    expect(validateAdminPath("/admin3/stats")).toBe(false);
  });

  it("does not match traversal or extra path segments", () => {
    expect(validateAdminPath("/admin/portfolio/a/b")).toBe(false);
    expect(validateAdminPath("/admin/stats/a/b")).toBe(false);
    expect(validateAdminPath("/admin/portfolio/..%2Fetc")).toBe(true);
  });
});