
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";
console.log("Connecting to Neon database at", process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL as string)

export const db = drizzle({ client: sql, schema });
export type Db = typeof db;