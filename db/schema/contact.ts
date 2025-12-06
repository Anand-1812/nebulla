// db/schema/contact.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { subAccounts } from "./subaccount";
import { tickets } from "./ticket";

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    email: text("email").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    subAccountId: uuid("sub_account_id").notNull(),
  },
  (table) => ({
    subAccIdx: index("contacts_subaccount_idx").on(table.subAccountId),
  })
);

export const contactRelations = relations(contacts, ({ one, many }) => ({
  subAccount: one(subAccounts, {
    fields: [contacts.subAccountId],
    references: [subAccounts.id],
  }),

  tickets: many(tickets),
}));

