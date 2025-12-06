// db/schema/funnel.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { subAccounts } from "./subaccount";
import { funnelPages } from "./funnelPage";
import { classNames } from "./classname";

export const funnels = pgTable(
  "funnels",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    description: text("description"),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    published: boolean("published").default(false).notNull(),

    subDomainName: text("sub_domain_name").unique(),

    favicon: text("favicon"),

    // JSON stored as string
    liveProducts: text("live_products").default("[]").notNull(),

    subAccountId: uuid("sub_account_id").notNull(),
  },
  (table) => ({
    subAccountIdx: index("funnels_subaccount_idx").on(table.subAccountId),
  })
);

export const funnelRelations = relations(funnels, ({ one, many }) => ({
  subAccount: one(subAccounts, {
    fields: [funnels.subAccountId],
    references: [subAccounts.id],
  }),

  pages: many(funnelPages),
  classNames: many(classNames),
}));

