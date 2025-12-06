import * as schema from "./schema"
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

declare global {
  var _drizzleDb: ReturnType<typeof drizzle> | undefined;
}

const sql = neon(process.env.DATABASE_URL!);

export const db =
  global._drizzleDb ??
  drizzle(sql, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });

if (process.env.NODE_ENV !== "production") {
  global._drizzleDb = db;
}

