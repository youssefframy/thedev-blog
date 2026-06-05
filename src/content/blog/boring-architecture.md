---
title: "Choose boring architecture (and other expensive lessons)"
description: "We replaced a Kafka pipeline with a Postgres table and a cron job. Nobody noticed. That's the point."
pubDate: 2026-04-30
category: "Software Engineering"
tags: [architecture, postgres, simplicity]
glyph: "{}"
readMins: 9
---

In 2023 we built a real-time analytics pipeline. Kafka for ingestion, Spark Streaming for processing, Elasticsearch for query. It cost $40k a month, required two dedicated engineers to operate, and regularly woke someone up at 3am.

In 2024 we replaced it with a Postgres table and a cron job. The analytics aren't technically real-time anymore — they're 5 minutes delayed. Nobody has complained. Operations cost dropped by 85%.

## The expensive lesson

The mistake wasn't using Kafka. Kafka is fine. The mistake was treating "real-time" as a requirement when it was actually a preference. When we went back and asked the stakeholders what latency they actually needed, the answer was "fast enough to see this morning's data when I open my dashboard at 9am." That's not a streaming problem.

This is the boring architecture problem in its purest form: we chose technology that was impressive and capable, not technology that fit the actual requirements.

## What boring architecture means

Dan McKinley's essay on choosing boring technology is the canonical reference here. The core idea is that every organization has a finite number of "innovation tokens." Spending one on Kafka means you have one less for something that actually needs to be novel.

For most applications, the boring stack — Postgres, Redis, a job queue, a web framework — solves 95% of problems well. The other 5% probably needs something different, but you should hit the 95% ceiling before you reach for the exotic solution.

## The Postgres ceiling is higher than you think

Postgres with decent indexing handles tens of thousands of writes per second on reasonable hardware. Read replicas scale reads. Partitioning handles time-series data cleanly. TimescaleDB extends it for analytics workloads. Before you reach for DynamoDB or Cassandra, ask whether you've actually hit the Postgres ceiling or whether you're just worried you might.

## Operability is a feature

The cron job replacement for our Kafka pipeline runs on a $50/month VM. When it breaks (which it does, occasionally), the error is obvious and the fix is usually obvious. There's no topology to understand, no offset to reset, no consumer group to debug. A new engineer can understand the entire system in an afternoon.

That operability has a real dollar value. Engineering time is expensive. On-call incidents are expensive. Simple systems are systematically cheaper to maintain.

The lesson: choose the boring thing until you have concrete evidence the boring thing isn't working.
