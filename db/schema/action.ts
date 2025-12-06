// db/schema/action.ts
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { automations } from "./automation";

export const actionTypeEnum = pgEnum("action_type", ["CREATE_CONTACT"]);

export const actions = pgTable(
  "actions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    type: actionTypeEnum("type").notNull(),

    order: integer("order").default(0).notNull(),
    laneId: text("lane_id").default("0").notNull(),

    automationId: uuid("automation_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    automationIdx: index("actions_automation_idx").on(table.automationId),
  })
);

export const actionRelations = relations(actions, ({ one }) => ({
  automation: one(automations, {
    fields: [actions.automationId],
    references: [automations.id],
  }),
}));

