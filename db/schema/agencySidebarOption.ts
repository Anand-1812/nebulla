// db/schema/agencySidebarOption.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { agencies } from "./agency";

export const iconEnum = pgEnum("icon", [
  "settings",
  "chart",
  "calendar",
  "check",
  "chip",
  "compass",
  "database",
  "flag",
  "home",
  "info",
  "link",
  "lock",
  "messages",
  "notification",
  "payment",
  "power",
  "receipt",
  "shield",
  "star",
  "tune",
  "videorecorder",
  "wallet",
  "warning",
  "headphone",
  "send",
  "pipelines",
  "person",
  "category",
  "contact",
  "clipboardIcon",
]);

export const agencySidebarOptions = pgTable(
  "agency_sidebar_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").default("Menu").notNull(),
    link: text("link").default("#").notNull(),
    icon: iconEnum("icon").default("info").notNull(),

    agencyId: uuid("agency_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    agencyIdx: index("agency_sidebar_idx").on(table.agencyId),
  })
);

export const agencySidebarOptionRelations = relations(
  agencySidebarOptions,
  ({ one }) => ({
    agency: one(agencies, {
      fields: [agencySidebarOptions.agencyId],
      references: [agencies.id],
    }),
  })
);

