// db/schema/notification.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./users";
import { agencies } from "./agency";
import { subAccounts } from "./subaccount";

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    notification: text("notification").notNull(),

    agencyId: uuid("agency_id").notNull(),
    subAccountId: uuid("sub_account_id"),
    userId: uuid("user_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    agencyIdx: index("notifications_agency_idx").on(table.agencyId),
    subAccountIdx: index("notifications_subaccount_idx").on(
      table.subAccountId
    ),
    userIdx: index("notifications_user_idx").on(table.userId),
  })
);

export const notificationRelations = relations(
  notifications,
  ({ one }) => ({
    user: one(users, {
      fields: [notifications.userId],
      references: [users.id],
    }),

    agency: one(agencies, {
      fields: [notifications.agencyId],
      references: [agencies.id],
    }),

    subAccount: one(subAccounts, {
      fields: [notifications.subAccountId],
      references: [subAccounts.id],
    }),
  })
);

