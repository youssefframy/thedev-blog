---
title: "Type-safe environment variables in TypeScript, end to end"
description: "Stop reading process.env like it's 2015. A small schema turns config into a compile-time contract."
pubDate: 2026-04-18
category: "Software Engineering"
tags: [typescript, config, dx]
glyph: "TS"
readMins: 7
---

Every TypeScript project I've worked on has the same bug waiting to happen: someone adds an environment variable, forgets to document it, and two weeks later someone deploys to production without it set. The app crashes at runtime in the worst possible way.

The fix is boring but effective: validate your environment at startup and surface schema errors immediately.

## The problem with process.env

`process.env` in TypeScript returns `string | undefined` for every key. You get no compile-time information about which variables are required, what their types are, or what valid values look like. This forces either defensive runtime checks scattered everywhere or silent failures.

```typescript
// This is fine for 5 minutes then causes a production incident
const timeout = parseInt(process.env.REQUEST_TIMEOUT);
fetch(url, { signal: AbortSignal.timeout(timeout) });
```

## The Zod approach

Define your environment schema with Zod and parse at startup:

```typescript
import { z } from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  REQUEST_TIMEOUT_MS: z.coerce.number().min(100).max(30000).default(5000),
  AWS_REGION: z.string().regex(/^[a-z]+-[a-z]+-\d$/),
});

export const env = EnvSchema.parse(process.env);
```

Now `env.PORT` is typed as `number`, not `string | undefined`. If `DATABASE_URL` is missing, you get a clear error at startup with exactly which variables are wrong and why.

## Making it fail loudly at build time

The parse at startup is good, but you can go further with a build-time check. Using `ts-node` or Bun in a pre-build script:

```bash
node -e "require('./src/env').env" || exit 1
```

This runs before your actual build. If the environment is wrong, the build fails before it can produce a broken artifact. CI catches it before deployment.

## The .env.example pattern

Once your schema is the source of truth, generate your `.env.example` automatically:

```typescript
// scripts/gen-env-example.ts
const shape = EnvSchema.shape;
Object.keys(shape).forEach(key => {
  const field = shape[key];
  const comment = field.description ? `# ${field.description}\n` : '';
  console.log(`${comment}${key}=`);
});
```

The example file is always in sync with the schema. New variables appear in the example automatically.

## When to reach for something more

For complex config (feature flags, secrets rotation, environment-specific overrides), this pattern reaches its limits. That's when you want a proper config service. But for most applications, a Zod schema at startup is 80% of the benefit with 10% of the complexity.
