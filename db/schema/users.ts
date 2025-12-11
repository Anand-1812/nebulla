// db/schema/users.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roleEnum } from "./enums";
import { agencies } from "./agency";
import { permissions } from "./permission";
import { tickets } from "./ticket";
import { notifications } from "./notification";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),

    name: text("name").notNull(),
    avatarUrl: text("avatar_url").notNull(),
    email: text("email").notNull().unique(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    role: roleEnum("role").default("SUBACCOUNT_USER").notNull(),

    agencyId: uuid("agency_id"),
  },
  (table) => ({
    agencyIdIdx: index("users_agency_id_idx").on(table.agencyId),
  })
);

export const userRelations = relations(users, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [users.agencyId],
    references: [agencies.id],
  }),
  permissions: many(permissions),
  tickets: many(tickets),
  notifications: many(notifications),
}));

