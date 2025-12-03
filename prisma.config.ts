// prisma.config.ts
import path from "node:path";
import * as dotenv from "dotenv";
import type { PrismaConfig } from "prisma";

dotenv.config(); // load .env

export default {
  schema: path.join("database"), // <-- arahkan ke FOLDER, bukan file!
} satisfies PrismaConfig;
