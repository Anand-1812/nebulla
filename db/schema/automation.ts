// db/schema/automation.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { triggers } from "./trigger";
import { subAccounts } from "./subaccount";
import { automationInstances } from "./automationInstance";
import { actions } from "./action";

export const automations = pgTable(
  "automations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    published: boolean("published").default(false).notNull(),

    triggerId: uuid("trigger_id"),
    subAccountId: uuid("sub_account_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    triggerIdx: index("automations_trigger_idx").on(table.triggerId),
    subAccIdx: index("automations_subaccount_idx").on(table.subAccountId),
  })
);

export const automationRelations = relations(automations, ({ one, many }) => ({
  trigger: one(triggers, {
    fields: [automations.triggerId],
    references: [triggers.id],
  }),

  subAccount: one(subAccounts, {
    fields: [automations.subAccountId],
    references: [subAccounts.id],
  }),

  instances: many(automationInstances),

  actions: many(actions),
}));

