// db/schema/lane.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { pipelines } from "./pipeline";
import { tickets } from "./ticket";

export const lanes = pgTable(
  "lanes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    order: integer("order").default(0).notNull(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    pipelineId: uuid("pipeline_id").notNull(),
  },
  (table) => ({
    pipelineIdx: index("lanes_pipeline_idx").on(table.pipelineId),
  })
);

export const laneRelations = relations(lanes, ({ one, many }) => ({
  pipeline: one(pipelines, {
    fields: [lanes.pipelineId],
    references: [pipelines.id],
  }),

  tickets: many(tickets),
}));

