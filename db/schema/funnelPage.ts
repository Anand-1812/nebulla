// db/schema/funnelPage.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { funnels } from "./funnel";

export const funnelPages = pgTable(
  "funnel_pages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),

    pathName: text("path_name").default("").notNull(),

    visits: integer("visits").default(0).notNull(),

    content: text("content"),

    order: integer("order").notNull(),

    previewImage: text("preview_image"),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    funnelId: uuid("funnel_id").notNull(),
  },
  (table) => ({
    funnelIdx: index("funnel_pages_funnel_idx").on(table.funnelId),
  })
);

export const funnelPageRelations = relations(funnelPages, ({ one }) => ({
  funnel: one(funnels, {
    fields: [funnelPages.funnelId],
    references: [funnels.id],
  }),
}));

