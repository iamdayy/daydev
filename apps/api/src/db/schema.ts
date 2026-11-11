import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// sat sumber kebenaran untuk semua angka yang dulu tidak konsisten antar halaman
export const siteStats = pgTable("site_stats", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// hanya tampil kalau ada data real
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  photoUrl: text("photo_url"),
  linkedinUrl: text("linkedin_url"),
  displayOrder: integer("display_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
});

export const siteContent = pgTable("site_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: text("kind").notNull(),
  key: text("key").notNull(),
  title: text("title").notNull(),
  value: text("value").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
  displayOrder: integer("display_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [uniqueIndex("site_content_kind_key_idx").on(table.kind, table.key)]);

export const guestbookEntries = pgTable("guestbook_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role"),
  message: text("message").notNull(),
  rating: integer("rating").notNull().default(5),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  isPublished: boolean("is_published").notNull().default(false),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  category: text("category").notNull(), // web | mobile | bot-telegram | undangan-digital
  segment: text("segment"), // startup | umkm | mahasiswa
  description: text("description").notNull(),
  resultHighlight: text("result_highlight"),
  coverImageUrl: text("cover_image_url").notNull(),
  galleryImageUrls: jsonb("gallery_image_urls").$type<string[]>(),
  demoUrl: text("demo_url"),
  techStack: jsonb("tech_stack").$type<string[]>(),
  clientName: text("client_name"),
  displayOrder: integer("display_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    coverImageUrl: text("cover_image_url"),
    author: text("author").notNull(),
    readingMinutes: integer("reading_minutes").notNull().default(5),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    isPublished: boolean("is_published").notNull().default(false),
  },
  (table) => [uniqueIndex("blog_posts_slug_idx").on(table.slug)],
);

export const pricingCategories = pgTable(
  "pricing_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    segment: text("segment").notNull(), // undangan-digital | bot-telegram | mahasiswa | umkm | startup
    label: text("label").notNull(),
    startingPriceLabel: text("starting_price_label").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (table) => [uniqueIndex("pricing_categories_segment_idx").on(table.segment)],
);

export const pricingPackages = pgTable("pricing_packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => pricingCategories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: integer("price").notNull(), // IDR
  features: jsonb("features").$type<string[]>(),
  isRecommended: boolean("is_recommended").notNull().default(false),
  demoUrl: text("demo_url"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientName: text("client_name").notNull(),
  clientRole: text("client_role"),
  segment: text("segment"), // startup | umkm | mahasiswa | undangan-digital | bot-telegram
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  avatarUrl: text("avatar_url"),
  displayOrder: integer("display_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
});

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("admin_users_email_idx").on(table.email)],
);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminUserId: uuid("admin_user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SiteStat = typeof siteStats.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type PricingCategory = typeof pricingCategories.$inferSelect;
export type PricingPackage = typeof pricingPackages.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type GuestbookEntry = typeof guestbookEntries.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export const schema = {
  siteStats,
  teamMembers,
  portfolioItems,
  blogPosts,
  pricingCategories,
  pricingPackages,
  testimonials,
  siteContent,
  guestbookEntries,
  adminUsers,
  sessions,
};