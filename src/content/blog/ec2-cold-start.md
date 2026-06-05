---
title: "Killing cold starts: how I cut Lambda latency by 70%"
description: "Provisioned concurrency is the lazy answer. Here's what actually moved the needle across 40 functions."
pubDate: 2026-05-28
category: AWS
tags: [aws, lambda, performance]
glyph: "λ"
readMins: 8
---

Provisioned concurrency is the first thing everyone reaches for when they hit a cold start problem. It works, but it costs money and it's a band-aid. After profiling 40 Lambda functions across three production services, I found the real culprits — and most of them weren't what I expected.

## What actually causes cold starts

The JVM startup time gets blamed constantly, but in 2026 most serious teams have already moved to either GraalVM native images or switched runtimes entirely. The real cold start killers I found were:

1. **Oversized deployment packages** — shipping 80MB ZIPs because nobody audited the dependency tree
2. **Lazy initialization inside handlers** — database connection pools opened on first request
3. **Secrets Manager calls at boot** — adding 300ms every single cold start
4. **VPC attachment** — still the biggest single killer by far

## The 40-function audit

I wrote a small script that analyzed CloudWatch Logs for Init Duration across all our functions over a 30-day window. The distribution was shocking: 12 functions accounted for 80% of total cold start time, and all 12 had the same pattern — they were attached to a VPC they didn't actually need.

The fix for those 12 was to remove the VPC attachment entirely. Cold start median dropped from 2.4s to 340ms overnight. No code changes. No architectural heroics.

## The secrets problem

For functions that genuinely need VPC (RDS access, ElastiCache), the next biggest win was moving secrets retrieval out of the Lambda handler. Instead of calling Secrets Manager on every cold start, I pre-bake environment variables at deploy time using a custom CDK construct that fetches secrets and passes them as encrypted environment variables.

The tradeoff: secret rotation requires a redeploy. For most applications, that's acceptable.

## What provisioned concurrency is actually good for

After the above changes, I only used provisioned concurrency for two cases: functions that are genuinely latency-sensitive for users (sub-100ms SLA) and functions with unavoidable expensive initialization (ML model loading). Everything else, the cold starts were acceptable after fixing the real problems.

The lesson: before throwing money at provisioned concurrency, audit your package sizes, remove unnecessary VPC attachments, and move initialization work out of the hot path.
