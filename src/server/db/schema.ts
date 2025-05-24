import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator, primaryKey, pgTable, varchar, numeric, timestamp, integer, boolean, text } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

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
]);

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `shpe-website-2025_${name}`,
);

export const users = pgTable("user", {
  id: varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  ucf_id: varchar({ length: 20 }),
  email: varchar({ length: 255 }).notNull(),
  emailVerified: timestamp({ mode: "date", withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  name: varchar({ length: 255 }),
  address: text(),
  bio: text(),
  is_member: boolean().default(false),
  admin_position: adminPositionEnum('admin_position').default('member'),
  created_at: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar({ length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
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
  user: one(users, { fields: [invoices.user_id], references: [users.id] }),
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
  user_id: varchar({ length: 255 }).notNull().references(() => users.id),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  paid_at: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  method: paymentMethodEnum('method'),
});

export const membershipPaymentsRelations = relations(membershipPayments, ({ one }) => ({
  user: one(users, { fields: [membershipPayments.user_id], references: [users.id] }),
}));


//  *---------------------------------* //
export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
