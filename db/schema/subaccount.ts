// db/schema/subaccount.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { agencies } from "./agency";

export const subAccounts = pgTable(
  "sub_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    connectAccountId: text("connect_account_id"),
    name: text("name").notNull(),
    subAccountLogo: text("sub_account_logo").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    companyEmail: text("company_email").notNull(),
    companyPhone: text("company_phone").notNull(),

    goal: integer("goal").default(5).notNull(),

    address: text("address").notNull(),
    city: text("city").notNull(),
    zipCode: text("zip_code").notNull(),
    state: text("state").notNull(),
    country: text("country").notNull(),

    agencyId: uuid("agency_id").notNull(),
  },
  (table) => ({
    agencyIdx: index("sub_accounts_agency_idx").on(table.agencyId),
  })
);

export const subAccountRelations = relations(subAccounts, ({ one }) => ({
  agency: one(agencies, {
    fields: [subAccounts.agencyId],
    references: [agencies.id],
  }),

  // Next steps (later when we generate files):
  // permissions
  // funnels
  // contacts
  // pipelines
  // notifications
}));

