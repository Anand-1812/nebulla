// db/schema/agency.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Import related tables
import { users } from "./users";
import { addOns } from "./addOns";
import { subAccounts } from "./subaccount";
import { agencySidebarOptions } from "./agencySidebarOption";
import { invitations } from "./invitation";
import { notifications } from "./notification";
import { subscriptions } from "./subscription";

export const agencies = pgTable("agencies", {
  id: uuid("id").defaultRandom().primaryKey(),

  connectAccountId: text("connect_account_id"), // String?
  customerId: text("customer_id").default(""), // String default ""

  name: text("name").notNull(),
  agencyLogo: text("agency_logo").notNull(),
  companyEmail: text("company_email").notNull(),
  companyPhone: text("company_phone").notNull(),

  whiteLabel: boolean("white_label").default(true).notNull(),

  address: text("address").notNull(),
  city: text("city").notNull(),
  zipCode: text("zip_code").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),

  goal: integer("goal").default(5).notNull(),

  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export const agencyRelations = relations(agencies, ({ many, one }) => ({
  // one agency → many users
  users: many(users),
  subAccounts: many(subAccounts),
  sidebarOptions: many(agencySidebarOptions),
  invitations: many(invitations),
  notifications: many(notifications),
  subscription: one(subscriptions, {
    fields: [agencies.id],
    references: [subscriptions.agencyId],
  }),

  addOns: many(addOns),
}));

