# Database

The site currently runs on a local data sheet: **Prisma ORM + SQLite** (`prisma/dev.db`).
Supabase (PostgreSQL) is the production target and will be swapped in at the end of the build.

The schema is written to be portable — it uses plain `String` columns instead of enums and no
SQLite-only features, so no model changes are needed for Supabase.

## Switching to Supabase later

1. Change the provider in `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Point `DATABASE_URL` in `.env` at Supabase. Use the **pooled** connection string
   (port `6543`) for the running app and the **direct** string (port `5432`) for migrations.

3. Install the driver adapter and enable it in `src/lib/prisma.ts`:

   ```bash
   npm i @prisma/adapter-pg pg
   ```

   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";

   export const prisma = new PrismaClient({
     adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
   });
   ```

4. Apply the schema to Supabase:

   ```bash
   npx prisma db push
   ```

5. Re-seed if you want the demo products, athletes, size guide and marquee messages.