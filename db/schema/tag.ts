import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { subAccounts } from "./subaccount";
import { tagsOnTickets } from "./ticketTags";

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    color: text("color").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    subAccountId: uuid("sub_account_id").notNull(),
  },
  (table) => ({
    subAccIdx: index("tags_subaccount_idx").on(table.subAccountId),
  })
);

export const tagRelations = relations(tags, ({ one, many }) => ({
  subAccount: one(subAccounts, {
    fields: [tags.subAccountId],
    references: [subAccounts.id],
  }),

  tickets: many(tagsOnTickets),
}));

