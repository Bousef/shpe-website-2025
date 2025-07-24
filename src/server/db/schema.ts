import type { InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTableCreator, varchar, boolean } from "drizzle-orm/pg-core";

// taken from https://supabase.com/docs/guides/auth/identities
// should probably be moved to a separate file
// and we should probably also make a providers type


//supabase db name
export const createTable = pgTableCreator(
  (name) => `shpe-website-2025_${name}`,
);

// types
export const positionEnumValues = [
  "President",
  "Internal Vice President",
  "Corporate Vice President",
  "Secretary",
  "Marketing Vice President",
  "Treasurer",
  "Technology Chair",
  "Professional Development Chair",
  "Projects Chair",
  "Mentorship Chair",
  "Outreach Chair",
  "Shpetinas Chair",
  "Social Chair",
  "Director",
  "DevTeam",
  "Committee",
  "Member",
] as const;
export type Position = typeof positionEnumValues[number];
export const positionEnum = pgEnum('position', positionEnumValues);

export type Alumni = InferSelectModel<typeof alumni>;

//--------------------  Tables --------------------

//members table
export const members = createTable(
  "members",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    ucf_id: d.integer().unique().notNull(),
    first_name: d.varchar({ length: 100 }),
    last_name: d.varchar({ length: 100 }),
    email: d.varchar({ length: 100 }).unique().notNull(),
    image: varchar({ length: 2048 }), //url
    resume: varchar({ length: 2048 }), //url
    is_member: boolean().default(false),
    position: positionEnum("position").default("Member"),
  })
);

export const alumni = createTable(
  "alumni",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    first_name: d.varchar({length: 100}),
    last_name: d.varchar({length: 100}),
    grad_year: d.varchar({length: 100}),
    image: d.varchar({length: 2048}),
    linkedIn: d.text(),
    position: positionEnum("position").default("Member"),
  })

);

export const products = createTable(
  "products",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 100 }),
    category: d.varchar({ length: 100 }).unique().notNull(),
    image: varchar({ length: 2048 }), //url
    description: varchar({ length: 2048 }), 
    price: d.real(),
    stock: d.integer(),
  })
);

/*
export type IdentityType =
  | "email"
  | "phone"
  | "oauth"
  | "saml";

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'paid', 
  'unpaid', 
  'pending'
]);

export const adminPositionEnum = pgEnum('admin_position', [
  'president',
  'vice_president',
  'secretary',
  'treasurer',
  'event_coordinator',
  'webmaster',
  'outreach_chair',
  'fundraising_chair',
  'member',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'card', 
  'cash', 
  'check', 
  'venmo', 
  'zelle'
]);*/

/*
export const usersRelations = relations(members, ({ many }) => ({
  accounts: many(accounts),
  invoices: many(invoices),
  membershipPayments: many(membershipPayments),
}));

export const invoices = pgTable("invoice", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 255 }).notNull(),
  total_amount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(members, { fields: [invoices.user_id], references: [members.id] }),
  items: many(invoiceItems),
}));

export const invoiceItems = pgTable("invoice_item", {
  id: varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  invoice_id: varchar({ length: 255 }).notNull().references(() => invoices.id),
  item_name: varchar({ length: 255 }).notNull(),
  quantity: integer().notNull(),
  unit_price: numeric({ precision: 10, scale: 2 }).notNull(),
});

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceItems.invoice_id], references: [invoices.id] }),
}));

export const membershipPayments = pgTable("membership_payment", {
  id: varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: varchar({ length: 255 }).notNull().references(() => members.id),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  paid_at: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  method: paymentMethodEnum('method'),
});

export const membershipPaymentsRelations = relations(membershipPayments, ({ one }) => ({
  user: one(members, { fields: [membershipPayments.user_id], references: [members.id] }),
}));
*/
