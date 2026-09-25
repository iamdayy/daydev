export const ALLOWED_ADMIN_PATHS = [
  "/admin/stats",
  "/admin/stats/:key",
  "/admin/team",
  "/admin/team/:id",
  "/admin/portfolio",
  "/admin/portfolio/:id",
  "/admin/blog",
  "/admin/blog/:id",
  "/admin/pricing",
  "/admin/pricing/categories",
  "/admin/pricing/categories/:id",
  "/admin/pricing/packages",
  "/admin/pricing/packages/:id",
  "/admin/testimonials",
  "/admin/testimonials/:id",
  "/admin/uploads/presign",
];

export function validateAdminPath(path: string): boolean {
  return ALLOWED_ADMIN_PATHS.some((pattern) => {
    const regex = new RegExp(`^${pattern.replace(/:[a-zA-Z]+/g, "[^/]+")}$`);
    return regex.test(path);
  });
}