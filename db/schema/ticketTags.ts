// db/schema/ticketTags.ts
import {
  pgTable,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { tickets } from "./ticket";
import { tags } from "./tag";

export const tagsOnTickets = pgTable(
  "tags_on_tickets",
  {
    ticketId: uuid("ticket_id").notNull(),
    tagId: uuid("tag_id").notNull(),
  },
  (table) => ({
    pk: primaryKey(table.ticketId, table.tagId),
  })
);

export const tagsOnTicketsRelations = relations(
  tagsOnTickets,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [tagsOnTickets.ticketId],
      references: [tickets.id],
    }),

    tag: one(tags, {
      fields: [tagsOnTickets.tagId],
      references: [tags.id],
    }),
  })
);

