import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role',
  ['AGENCY_OWNER', 'AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST']
);

export const users = pgTable('users', {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  avatarUrl: text('avatar_url'),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  role: roleEnum("role").default("SUBACCOUNT_USER"),

  agencyId: uuid("agency_id"),
});

export const userRelation = relations(users, ({ one, many }) => ({
  agency: one(agency, {
    fields: [users.agencyId],
    references: [agency.id],
  }),

  permissions: many(premissions),
  tickets: many(tickets),
  notifications: many(notifactions),
}));


