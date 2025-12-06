// db/schema/permissions.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./users";
import { subAccounts } from "./subaccount";

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    email: text("email").notNull(), // relationship via email (unique)
    access: boolean("access").default(false).notNull(),

    subAccountId: uuid("sub_account_id").notNull(),
  },
  (table) => ({
    subAccountIdx: index("permissions_subaccount_idx").on(
      table.subAccountId
    ),
    emailIdx: index("permissions_email_idx").on(table.email),
  })
);

export const permissionsRelations = relations(
  permissions,
  ({ one }) => ({
    user: one(users, {
      fields: [permissions.email],
      references: [users.email],
    }),

    subAccount: one(subAccounts, {
      fields: [permissions.subAccountId],
      references: [subAccounts.id],
    }),
  })
);

