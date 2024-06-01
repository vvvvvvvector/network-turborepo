import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const queryClient = postgres(process.env.DB_URL as string);

export const database = drizzle(queryClient, { schema });
