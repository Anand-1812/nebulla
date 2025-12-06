// db/schema/invitation.ts
import {
  pgTable,
  uuid,
  text,
  pgEnum,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { agencies } from "./agency";
import { roleEnum } from "./enums";

export const invitationStatusEnum = pgEnum("invitation_status", [
  "ACCEPTED",
  "REVOKED",
  "PENDING",
]);

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    email: text("email").notNull().unique(),

    status: invitationStatusEnum("status").default("PENDING").notNull(),

    role: roleEnum("role").default("SUBACCOUNT_USER").notNull(),

    agencyId: uuid("agency_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    agencyIdx: index("invitation_agency_idx").on(table.agencyId),
  })
);

export const invitationRelations = relations(invitations, ({ one }) => ({
  agency: one(agencies, {
    fields: [invitations.agencyId],
    references: [agencies.id],
  }),
}));

