// db/schema/media.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { subAccounts } from "./subaccount";

export const media = pgTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    type: text("type"),
    name: text("name").notNull(),
    link: text("link").notNull(),

    subAccountId: uuid("sub_account_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    subAccIdx: index("media_subaccount_idx").on(table.subAccountId),
    linkIdx: index("media_link_idx").on(table.link),
  })
);

export const mediaRelations = relations(media, ({ one }) => ({
  subAccount: one(subAccounts, {
    fields: [media.subAccountId],
    references: [subAccounts.id],
  }),
}));

