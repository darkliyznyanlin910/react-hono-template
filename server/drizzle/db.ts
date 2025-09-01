import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "../env";
import * as schema from "./schema";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  schema,
});
