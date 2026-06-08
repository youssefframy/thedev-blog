---
title: "Shipping a side project in a weekend without burning out"
description: "Scope ruthlessly, fake the hard parts, deploy on Friday. A playbook from five finished projects."
pubDate: 2026-03-05
category: Projects
tags: [projects, shipping, indie]
glyph: "🜂"
readMins: 5
---

I've finished five side projects that I actually shipped and use. I've abandoned about twenty. The pattern in the ones I finished is embarrassingly simple: I didn't let perfect be the enemy of shipped.

## The scope problem

Most side projects die in scope expansion. You start with "a simple tool to X" and by week two you're building authentication, a dashboard, email notifications, and a mobile app. The original thing that would have taken a weekend now takes a year and you never finish.

The fix is violent scoping. Write down exactly what your project does in one sentence. If it takes two sentences, it's too big. Then do the minimum thing that lets someone else use it in one sitting.

## Fake the hard parts first

The hard parts are: email delivery, payments, user authentication, background jobs. These take disproportionate time to set up correctly and add almost no user-facing value on day one.

My pattern: fake all of them at first. Email goes to a Google Sheet via a form. Payments are a Stripe payment link, not an integration. Auth is a hardcoded password or not implemented. Background jobs are a cron job that runs on my laptop.

Ship with the fakes. Validate that someone wants the real version. Build the real version only if they do.

## Deploy on Friday

I have a rule: if I'm building something on the weekend, I deploy it before I go to bed Sunday. Not "almost deployed," not "ready to deploy Monday morning." Actually deployed, actually usable by someone else.

The reason: if I go to bed with an undeployed project, the probability it gets deployed in the next week drops to about 20%. Real life intrudes. The moment passes. The project becomes an artifact.

Deploying Sunday night, even if it's rough, keeps the momentum. You can improve a live project. You can't improve something that never shipped.

## The maintenance trap

After shipping, resist adding features for two weeks. Watch what people actually do with it. The feature they use most is the one you should improve. The feature nobody uses is the one you were most excited to build.

The best side projects I've built now run for months with almost no maintenance. They're too simple to break. That's not an accident.
