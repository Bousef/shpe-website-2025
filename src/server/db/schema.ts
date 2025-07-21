import { pgEnum, pgTableCreator, varchar, boolean, unique } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";


// taken from https://supabase.com/docs/guides/auth/identities
// should probably be moved to a separate file
// and we should probably also make a providers type


//supabase db name
export const createTable = pgTableCreator(
  (name) => `shpe-website-2025_${name}`,
);
export const active_status_enum = pgEnum("active_status", ["Active", "Inactive"]);
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
export type Member = InferSelectModel<typeof members>;

//--------------------  Tables --------------------

//members table
export const members = createTable(
  "members",
  (d) => ({
    // id has to mirror the id from Supabase's auth.users table
    // at the moment it isn't possible to reference it directly due to the way drizzle-orm works
    // so we have to assert it in the code that creates the members
    uuid: d.uuid().primaryKey().notNull(),
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
    first_name: d.varchar({ length: 100 }),
    last_name: d.varchar({ length: 100 }),
    grad_year: d.varchar({ length: 100 }),
    image: d.varchar({ length: 2048 }),
    linkedIn: d.text(),
    position: positionEnum("position").default("Member"),
  })

);

export const products = createTable(
  "products",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 100 }).notNull(),
    price: d.real().notNull(),
    image: d.varchar({ length: 500 }).notNull(),
    stock: d.integer().notNull(),
    category: varchar("category", { length: 255 }).notNull().default("Accessories"),
    status: active_status_enum("status").notNull().default("Active"),
    created_at: d.timestamp({ withTimezone: true }).defaultNow(),
  })

);

export const clothes_sizes = createTable(
  "clothes_sizes",
  (d) => ({
    id: d.integer().primaryKey().references(() => products.id, {
      onDelete: "cascade",
    }),
    S: d.integer().default(0),
    M: d.integer().default(0),
    L: d.integer().default(0),
    XL: d.integer().default(0),
    XXL: d.integer().default(0),
    XXXL: d.integer().default(0),
  })
);


export const cart = createTable(
  "cart",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    created_at: d.timestamp({ withTimezone: true }).defaultNow(),
    member_uuid: d.uuid().notNull().references(() => members.uuid),
    product_id: d.integer().notNull().references(() => products.id),
    quantity: d.integer().notNull(),
  }), (table) => [
    unique().on(table.member_uuid, table.product_id),
    unique("cart_member_product_unique").on(table.member_uuid, table.created_at),
  ]
);

export const reset_codes = createTable(
  "reset_codes",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    email: d.varchar({ length: 100 }).notNull().unique(),
    code: d.varchar({ length: 6 }).notNull(),
    created_at: d.timestamp({ withTimezone: true }).defaultNow(),
    expires_at: d.timestamp({ withTimezone: true }).notNull(),
    used: d.boolean().default(false),
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
