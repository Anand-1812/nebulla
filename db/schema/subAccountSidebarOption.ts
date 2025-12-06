// db/schema/subAccountSidebarOption.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { iconEnum } from "./agencySidebarOption";
import { subAccounts } from "./subaccount";

export const subAccountSidebarOptions = pgTable(
  "subaccount_sidebar_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").default("Menu").notNull(),
    link: text("link").default("#").notNull(),
    icon: iconEnum("icon").default("info").notNull(),

    subAccountId: uuid("sub_account_id"),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    subAccountIdx: index("subacc_sidebar_idx").on(table.subAccountId),
  })
);

export const subAccountSidebarOptionRelations = relations(
  subAccountSidebarOptions,
  ({ one }) => ({
    subAccount: one(subAccounts, {
      fields: [subAccountSidebarOptions.subAccountId],
      references: [subAccounts.id],
    }),
  })
);

