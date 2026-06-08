---
title: "What I learned reading 50 public postmortems"
description: "Patterns in how systems fail — and the boring fixes that keep showing up."
pubDate: 2026-02-04
category: Notes
tags: [notes, reliability, sre]
glyph: "✷"
readMins: 8
---

Over the last six months I read 50 public postmortems — from the usual suspects (Google, AWS, Cloudflare, Stripe) to smaller engineering blogs that don't get cited as often. A few patterns kept appearing.

## The cascade is always a surprise

Every postmortem I read involved a cascade that surprised the team. Not "we knew this could happen and it did," but "we would never have predicted this failure mode." This is structural: complex systems fail in complex ways, and the failure modes that actually occur are disproportionately those that weren't anticipated.

The practical implication: your runbooks are mostly useless for novel incidents. The value of runbooks is in reducing toil for known incidents, not in handling the ones that wake you up at 3am.

## The "fix" is usually load shedding

The most common recovery pattern across the 50 postmortems: start rejecting requests aggressively. Rate limiting, circuit breakers, graceful degradation — whatever it takes to reduce load below the knee of the capacity curve.

Systems that recovered quickly had load shedding in place before the incident. Systems that recovered slowly were scrambling to add it during the incident. This is the strongest argument for building load shedding before you need it.

## Human error isn't the root cause

About a third of postmortems listed "human error" as a contributing factor. The better-written ones went further: they asked why the system made that human action dangerous. Pushing the wrong button in a well-designed system should be recoverable. If it isn't, the root cause isn't the human, it's the design.

Amazon's internal postmortem culture reportedly bans "human error" as a root cause for exactly this reason. I find this framing useful even when I disagree with it — it forces a more useful question.

## The detection lag problem

The median time-to-detection in the postmortems I read was about 8 minutes. The median time between the actual failure starting and detection was about 22 minutes. That 14-minute gap is almost universally an alerting problem: alerts set too high, wrong signal being monitored, or dashboards that require someone to look at them.

The best postmortems I read included specific changes to monitoring thresholds and alert routing. The worst listed "improve monitoring" as an action item.

## What I actually changed

Reading postmortems changed two things about how I design systems: I now budget for circuit breakers on every external dependency at the design stage, not as a retrofit. And I write my alerting for the failure modes that matter to users, not the failure modes that are easiest to measure.
