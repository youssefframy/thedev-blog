---
title: "Notes: the rubber duck is a real debugging tool"
description: "A short field note on why explaining the bug out loud fixes it before you finish the sentence."
pubDate: 2026-01-22
category: Notes
tags: [notes, debugging]
glyph: "¬"
readMins: 3
---

I keep a rubber duck on my desk. Not ironically. I use it.

The rubber duck debugging technique — explaining your problem to an inanimate object as if it were a patient listener — sounds like a joke until you actually try it. Then it becomes one of the most reliable debugging tools you have.

## Why it works

When you're debugging silently, you're pattern-matching against your existing mental model of the code. Your brain fills in gaps and skips over assumptions because you "know" how the code works. The act of articulating the problem forces you to be explicit about those assumptions.

The moment you say "so the function receives the user object and then... wait, actually it receives an ID and looks up the user... no wait, let me check..." you've already found the bug. You didn't need the rubber duck to say anything. You needed to not be able to skip past the ambiguity.

## The threshold problem

Most engineers reach for rubber duck debugging too late, after they've been stuck for an hour. The technique is most effective when you do it at the first sign of confusion, not as a last resort.

My heuristic: if I've read the same block of code three times and I'm not sure what it does, I explain it out loud. Not "I'll figure it out in a minute," but stop and explain it now. The three-read threshold is empirically where the time investment flips from "faster to keep reading" to "faster to explain."

## On asking for help

The rubber duck is also a rehearsal for asking for help. If you've explained the problem clearly enough that a rubber duck could understand it, you've explained it clearly enough to write a good bug report or ask a useful question.

Most bad questions in Slack and on GitHub aren't bad because the asker is lazy. They're bad because the asker hasn't articulated the problem clearly enough yet, even to themselves. The rubber duck is free first-pass triage.
