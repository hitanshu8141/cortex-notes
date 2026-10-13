import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Load .env.local the same way Next.js does.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection.
    url: process.env.DIRECT_URL,
  },
});
