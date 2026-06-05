---
title: "Designing a CLI people actually keep using"
description: "Good flags, sane defaults, helpful errors. The unglamorous craft of command-line tools."
pubDate: 2026-04-02
category: DevTools
tags: [devtools, cli, ux]
glyph: ">_"
readMins: 6
---

Most CLIs are designed to be featureful, not usable. The result is tools that do everything but require reading the man page to do anything. After building a few CLIs that teams actually adopted — and more that they didn't — here's what makes the difference.

## The muscle memory problem

A CLI succeeds when users internalize it. When they stop thinking about flags and just type. That happens through consistency and predictability, not through features.

The single biggest predictor of CLI adoption I've seen: can a user who ran the tool three months ago remember how to use it without consulting help text? If the answer is no, you have a discoverability problem.

## Sane defaults are the whole game

Your most common use case should require the fewest arguments. If users have to pass five flags to do the thing they do every day, they'll write an alias, which means your flags don't matter to them, which means you're effectively shipping two CLIs.

The pattern I use: defaults should reflect what a new user in a hurry would want. Advanced options go behind explicit flags. Destructive operations require explicit confirmation or a `--force` flag.

## Error messages as documentation

Most CLIs treat errors as failures to report. The best CLIs treat errors as teaching opportunities. When something goes wrong, tell the user:

1. What went wrong (specific, not generic)
2. Why it went wrong (if knowable)
3. How to fix it (the specific command or flag)

```
Error: no AWS credentials found

  thedev deploy requires AWS credentials to push to S3.
  Configure them with one of:

    export AWS_PROFILE=your-profile
    export AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=...

  Run 'thedev doctor' to check your full configuration.
```

This error message is longer than most CLIs bother to write. It's also why people don't ask me how to fix the credentials problem — they already know.

## Flags have a grammar

Long flags for explicit use (`--dry-run`). Short flags for frequent use (`-v` for verbose, `-o` for output). Don't invent short flags for infrequent operations — `-t` for something used once a week requires the user to remember a symbol table.

Follow the conventions: `-h` and `--help` always work. `-v` and `--version` always work. These aren't suggestions, they're expectations.

## The happy path is the only path most users take

Spend 80% of your design time on the happy path. Users who need the advanced options will read the docs; users who need the happy path will judge your whole CLI on how that one command feels.
