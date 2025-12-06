// db/schema/trigger.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { subAccounts } from "./subaccount";
import { automations } from "./automation";

export const triggerTypesEnum = pgEnum("trigger_type", [
  "CONTACT_FORM",
]);

export const triggers = pgTable(
  "triggers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    type: triggerTypesEnum("type").notNull(),

    subAccountId: uuid("sub_account_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    subAccIdx: index("triggers_subaccount_idx").on(table.subAccountId),
  })
);

export const triggerRelations = relations(triggers, ({ one, many }) => ({
  subAccount: one(subAccounts, {
    fields: [triggers.subAccountId],
    references: [subAccounts.id],
  }),

  automations: many(automations),
}));

