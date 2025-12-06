// db/schema/automationInstance.ts
import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { automations } from "./automation";

export const automationInstances = pgTable(
  "automation_instances",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    automationId: uuid("automation_id").notNull(),
    active: boolean("active").default(false).notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    automationIdx: index("automation_instances_automation_idx").on(
      table.automationId
    ),
  })
);

export const automationInstanceRelations = relations(
  automationInstances,
  ({ one }) => ({
    automation: one(automations, {
      fields: [automationInstances.automationId],
      references: [automations.id],
    }),
  })
);

