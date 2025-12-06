import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { funnels } from "./funnel";

export const classNames = pgTable(
  "class_names",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    color: text("color").notNull(),

    customData: text("custom_data"),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    funnelId: uuid("funnel_id").notNull(),
  },
  (table) => ({
    funnelIdx: index("class_names_funnel_idx").on(table.funnelId),
  })
);

export const classNameRelations = relations(classNames, ({ one }) => ({
  funnel: one(funnels, {
    fields: [classNames.funnelId],
    references: [funnels.id],
  }),
}));

