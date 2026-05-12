import 'dotenv/config';

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'schema/prisma/schema.prisma',
  migrations: {
    path: 'schema/prisma/migrations',
  },
});
