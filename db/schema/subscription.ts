// db/schema/subscription.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { agencies } from "./agency";

export const planEnum = pgEnum("plan", [
  "price_1Ppo69RwpqMc2iheOHp2rbzA",
  "price_1Ppo73RwpqMc2ihef4jfoTTc",
]);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    plan: planEnum("plan"),

    price: text("price"),
    active: boolean("active").default(false).notNull(),

    priceId: text("price_id").notNull(),
    customerId: text("customer_id").notNull(),
    currentPeriodEndDate: timestamp("current_period_end_date", {
      mode: "date",
    }).notNull(),

    subscritiptionId: text("subscription_id").unique().notNull(),

    agencyId: uuid("agency_id").unique(),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    customerIdx: index("subscriptions_customer_idx").on(table.customerId),
  })
);

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  agency: one(agencies, {
    fields: [subscriptions.agencyId],
    references: [agencies.id],
  }),
}));

