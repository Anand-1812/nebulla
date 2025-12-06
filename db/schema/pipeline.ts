import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { subAccounts } from "./subaccount";
import { lanes } from "./lane";

export const pipelines = pgTable(
  "pipelines",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    subAccountId: uuid("sub_account_id").notNull(),
  },
  (table) => ({
    subAccountIdx: index("pipelines_subaccount_idx").on(table.subAccountId),
  })
);

export const pipelineRelations = relations(pipelines, ({ one, many }) => ({
  subAccount: one(subAccounts, {
    fields: [pipelines.subAccountId],
    references: [subAccounts.id],
  }),

  lanes: many(lanes),
}));

