// db/schema/ticket.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { lanes } from "./lane";
import { users } from "./users";
import { contacts } from "./contact";
import { tagsOnTickets } from "./ticketTags";

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    description: text("description"),

    order: integer("order").default(0).notNull(),

    value: numeric("value", { precision: 12, scale: 2 }),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    laneId: uuid("lane_id").notNull(),

    customerId: uuid("customer_id"),
    assignedUserId: uuid("assigned_user_id"),
  },
  (table) => ({
    laneIdx: index("tickets_lane_idx").on(table.laneId),
    customerIdx: index("tickets_customer_idx").on(table.customerId),
    assignedIdx: index("tickets_assigned_idx").on(table.assignedUserId),
  })
);

export const ticketRelations = relations(tickets, ({ one, many }) => ({
  lane: one(lanes, {
    fields: [tickets.laneId],
    references: [lanes.id],
  }),

  customer: one(contacts, {
    fields: [tickets.customerId],
    references: [contacts.id],
  }),

  assignedUser: one(users, {
    fields: [tickets.assignedUserId],
    references: [users.id],
  }),

  tags: many(tagsOnTickets),
}));

