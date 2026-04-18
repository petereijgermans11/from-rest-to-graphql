---
name: Presentation directory is read-only unless asked
description: Claude must not edit files in dj-console-presentation/ unless the user explicitly asks
type: feedback
---

Never edit files under `dj-console-presentation/` unless the user explicitly asks.

**Why:** The presentation is the user's own authored content. Claude's role is to flag factual inaccuracies and propose corrections, not to make edits autonomously.

**How to apply:** After a presentation review, output proposed slide changes as text in the response. Wait for explicit instruction before touching any file under `dj-console-presentation/`.
