// db/schema/addons.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { agencies } from "./agency";

export const addOns = pgTable(
  "addons",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    active: boolean("active").default(false).notNull(),

    priceId: text("price_id").unique().notNull(),

    agencyId: uuid("agency_id"),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    agencyIdx: index("addons_agency_idx").on(table.agencyId),
  })
);

export const addOnsRelations = relations(addOns, ({ one }) => ({
  agency: one(agencies, {
    fields: [addOns.agencyId],
    references: [agencies.id],
  }),
}));

