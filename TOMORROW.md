# Session Handoff — Architecture Discussion

## Context: Flow-First vs Feature-First

Feature-based organizes around data: `auth/`, `users/`, `entities/` — each feature owns its models, controllers, services. The problem: real user flows cut across features. A "tip" touches users, entities, payments, notifications, websockets simultaneously. One user action ends up scattered across 5 folders.

**Flow-first organizes around what the system does, not what data it manages.** The folder structure mirrors the product's mental model, not the database schema.

---

## Questions to Answer Before We Start

1. **What are the 3–5 core flows in Tipper that everything else orbits?**
   (e.g. "send a tip", "discover an entity", "join a community") — the names you'd put on the nav tabs of the product.

2. **What stays, what gets rewritten, what gets deleted from the old repo?**
   Or is it genuinely scratch with selective copy-paste?

3. **What's the target for the first working slice?**
   The smallest thing that proves the architecture works end-to-end.

---

These answers unlock: concrete folder structure + migration plan (not a generic one).
