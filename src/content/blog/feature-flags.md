---
title: "Rolling my own feature flags before reaching for a SaaS"
description: "200 lines, one database table, zero monthly bill. When DIY beats the vendor."
pubDate: 2026-02-19
category: Projects
tags: [projects, feature-flags, backend]
glyph: "⚑"
readMins: 7
---

The SaaS feature flag market has consolidated around a handful of vendors that charge between $500 and $2000/month for what is, at its core, a database table and some boolean logic. I built a replacement in a weekend and have been running it in production for eight months.

## What feature flags actually are

At the simplest level, a feature flag is a named boolean stored somewhere your code can read it. Your code checks the flag; if true, it takes the new path; if false, it takes the old path.

The interesting parts: targeting (show this flag to 10% of users, or only to users in the US, or only to your internal team), rollback (flip the flag and the bug disappears without a deploy), and audit trail (who changed what and when).

## The schema

```sql
CREATE TABLE feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         VARCHAR(128) UNIQUE NOT NULL,
  enabled     BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  rules       JSONB DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flag_evaluations (
  flag_key  VARCHAR(128) REFERENCES feature_flags(key),
  entity_id VARCHAR(256),
  result    BOOLEAN NOT NULL,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);
```

The `rules` JSON array holds targeting rules: percentage rollouts, user cohort lists, attribute matchers. Evaluations are logged for debugging and analytics.

## The evaluation function

```typescript
function evaluate(flag: Flag, context: EvalContext): boolean {
  if (!flag.enabled) return false;
  if (!flag.rules.length) return true;
  
  for (const rule of flag.rules) {
    if (rule.type === 'percentage') {
      const hash = murmurhash(context.userId + flag.key) % 100;
      if (hash < rule.percentage) return true;
    }
    if (rule.type === 'allowlist') {
      if (rule.ids.includes(context.userId)) return true;
    }
  }
  return false;
}
```

Murmurhash ensures consistent bucketing — the same user always gets the same experience for a given flag percentage. This is the one non-trivial algorithmic choice.

## When to use the vendor

My DIY version handles 95% of what I need. But I'd use a vendor if I needed: A/B test statistical analysis built in, multi-environment flag management with approvals, SDK support for mobile apps, or a non-technical product team making flag decisions without engineer involvement.

The build-vs-buy decision is simpler than it looks: if you need the flag in a week and the vendor charges less than an engineer's time to build it, buy. Otherwise, build.
