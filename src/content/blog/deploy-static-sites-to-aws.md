---
title: "I automated the secure way to deploy static sites to AWS"
description: "The right way to host a static site on AWS is a twelve-step ritual. So I turned it into one command."
pubDate: 2026-06-08
category: Projects
tags: [projects, aws, cli]
glyph: "⚑"
readMins: 4
---

I've deployed enough static sites to AWS that I can do it with my eyes closed — and that's exactly the problem. Every single time, I run the same twelve-step ritual: create a private S3 bucket, block public access, wire up an Origin Access Control, stand up a CloudFront distribution, set cache headers, add the SPA error-routing rules, wait fifteen minutes, and pray I didn't fat-finger a policy.

None of it is hard. All of it is boring. And boring, repetitive work that touches security policies is exactly the kind of thing humans get wrong.

## The secure-by-default tax

The "right" way to host a static site on AWS isn't the obvious way. The obvious way is a public S3 bucket with website hosting switched on — and it works, right up until you realize you've got an open bucket, no HTTPS, and no CDN. The actually-recommended setup is private S3 + CloudFront + Origin Access Control, so the bucket is never publicly reachable and everything is served over HTTPS at the edge.

That's more secure. It's also five more services to configure correctly, every time. Most tutorials stop at the public-bucket version because the secure version has too many moving parts to fit in a blog post. So people ship the insecure one.

## So I wrapped the boring parts in a CLI

I built [`aws-deploy-static-site`](https://github.com/youssefframy/aws-deploy-static-site) — a small Go CLI that does the whole secure setup from one interactive prompt. You point it at your build folder, answer a few questions, and it provisions the private bucket, the OAC, the CloudFront distribution, the cache headers, and the SPA fallback routing for you.

```bash
git clone https://github.com/youssefframy/aws-deploy-static-site.git
cd aws-deploy-static-site
go run main.go
```

It asks whether you're deploying a plain static site or an SPA, where your files live, and which region — then it handles the rest. No Terraform to learn, no console clicking, no half-remembered policy JSON. Ten to fifteen minutes later (that's CloudFront propagating, not me) you've got a live HTTPS URL. Prefer not to install Go? There are pre-built binaries for macOS, Linux, and Windows on the releases page.

## What it actually sets up

Behind the prompts, every deploy gets the secure-by-default treatment:

- **Private S3 bucket** with public access fully blocked
- **CloudFront + Origin Access Control** so the bucket is only reachable through the CDN
- **HTTPS-only** access at the edge
- **Sensible cache headers** on your assets
- **SPA error routing** so client-side routes stop 404-ing

The defaults are the secure ones. You'd have to go out of your way to ship something open.

## Who it's for

This isn't for the AWS wizard who already has a CDK stack they love. It's for the developer who knows their way around a terminal, has credentials configured, and just wants their site live without becoming a part-time cloud architect first. Basic AWS knowledge and the right IAM permissions — that's the whole bar.

## It's open — come break it

Issues and pull requests are genuinely welcome. The repo is intentionally small: around 400 lines of Go, no frameworks, no magic. If you want to add support for custom CloudFront behaviors, WAF integration, or your own deploy workflow — the surface area is easy to navigate. If it breaks on your setup, open an issue with your region and bucket name (minus any credentials, obviously). I'll look at it.

## The lesson

I built this because I was tired of doing it by hand. I open-sourced it because I still remember how opaque AWS felt the first time I opened the console. If it saves you an afternoon of reading CloudFront docs — or stops you from shipping an open bucket — then it did its job.

There's more to do. The next post covers what I'm building next to make this tool genuinely production-ready — better error messages, teardown support, and a few things that came up in the first round of real-world use. If that sounds useful, [subscribe via RSS](/rss) or check back soon.
