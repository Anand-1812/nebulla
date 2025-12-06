import {
  pgTable,
  text,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./schema";
import { subAccounts } from "./subaccounts";
import { sidebarOptions } from "./sidebarOptions";
import { invitations } from "./invitations";
import { notifications } from "./notifications";
import { subscriptions } from "./subscriptions";
import { addOns } from "./addons";

export const agency = pgTable("agency", {
  id: uuid("id").defaultRandom().primaryKey(),

  connectAccountId: text("connect_account_id"),
  customerId: text("customer_id").default(""),

  name: text("name"),
  agencyLogo: text("agency_logo"),
  companyEmail: text("company_email"),
  companyPhone: text("company_phone"),

  whiteLabel: boolean("white_label").default(true),

  address: text("address"),
  city: text("city"),
  zipCode: text("zip_code"),
  state: text("state"),
  country: text("country"),

  goal: integer("goal").default(5),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agencyRelations = relations(agency, ({ many, one }) => ({
  users: many(users),

  subAccounts: many(subAccounts),
  sidebarOptions: many(sidebarOptions),
  invitations: many(invitations),
  notifications: many(notifications),
  addOns: many(addOns),

  subscription: one(subscriptions, {
    fields: [agency.id],
    references: [subscriptions.agencyId],
  }),
}));


