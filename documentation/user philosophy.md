# User philosophy

This document captures the product-facing distinction between **the user** (the person as evidenced over time) and **the profile** (the represented, curated identity), and why that separation matters for onboarding, information architecture, and how a single real-world interaction can feed both layers differently.

---

## Person and representation

Humans can be framed as combining:

- Something like a **dense first-person trajectory**: temperament, habits, embodied experience, memory, skills acquired through repetition, circumstance—things that resist being fully captured by a label.
- **Socially legible identity**: names, roles, categories, reputations—the compressed, shareable handles others (and algorithms) use to recognize and coordinate with someone.

Important nuance: this is rarely a sealed “inner core vs outer mask.” **Identity feeds back into behavior** (how you’re treated reshapes incentives and habits), and **behavior becomes story** (“I’m someone who always…”). Still, for product design it is useful to treat **two epistemic sources** differently: what is **claimed or curated** vs what is **observed or accumulated** as evidence.

---

## User vs profile (the separation)

### User

**The user** is the layer where the platform treats the individual as a **process evidenced by behavior**—with minimal reliance on self-narrative as ground truth.

- **User-facing “user” space (conceptually):** a relatively **neutral** place for longitudinal signals: actions, movements, patterns, growth-like or participation stats—the ledger of **what happened**, as the system can observe it (subject to consent, transparency, and correction).
- Philosophically: closer to **who the person is in fact** over time, not **who they say they are**.

**Schema spine:** **`User`** is still the mandatory **login, ownership, claiming, and enforcement** account (`Role`, credentials, **`owned_entities`**, **`RequestClaim`**, invites). Much of what product reads as **“who is acting socially”** is stored against **`profile_id`** (see [Summary](#summary) and [Schema alignment](#schema-alignment)); accountability always resolves **`Profile` → `User`**.

### Profile

**The profile** is the layer of **representation**: what the person endorses, stages, or wants others (and the product) to coordinate on.

- **Onboarding** (values, archetypes, interests, etc.) belongs here as **bootstrap for a legible identity layer**—explicitly *not* exhaustive ground truth. It helps make the split obvious: “this is the story I align with,” not “this is all I am.”
- **Profile inventory (examples):** skills, activities, places visited, communities—declarative, social, composable **identity assets**.

Note: the profile is not only “what they think.” It is also **strategic and social**—what they want visible, what they optimize for, what they want algorithms and peers to act on. That is still distinct from **unendorsed behavioral residue** on the user side if you design the ledgers and permissions accordingly.

---

## Same place, two ledgers

A **single visit or context** (e.g. a place, an event, a flow) can simultaneously:

1. **Support exploration**—first-person, experiential (“I’m trying / discovering / feeling…”).
2. **Dual accounting**—some signal accrues to **user** (evidence, continuity, behavior), and some to **profile** (claims, affiliations, curated highlights), often with **different update rules, visibility, and audiences**.

The product opportunity: one surface can feel like “part of myself” while **routing information** to the right conceptual bucket so “who I am” (evidenced) and “who I represent” (staged) don’t collapse into one undifferentiated profile.

---

## Design tensions (to hold explicitly)

- **“Neutral” behavioral collection** is a **product and ethics** commitment: users still read charts and scores as **identity** unless the UI, consent, and controls make provenance and limits clear.
- **Overlap:** some facts may belong in **both** ledgers with **different semantics** (e.g. “checked in” vs “lists this as my favorite spot”)—or you may **hard-partition** for philosophical clarity; that is an explicit product choice.
- **Language:** avoid implying the profile is the whole person; avoid implying behavioral traces are morally or ontologically “truer” than endorsed values—they answer **different questions** (evidence vs representation).

---

## Summary

| Layer | Epistemic role | Typical content |
|--------|----------------|------------------|
| **User** | Account, auth, enforcement, ownership spine | Login, role, claims on entities, invites, owned entities |
| **Profile** | Represented Tipper identity & social graph edges | Onboarding selections, memberships/affiliations, visits, votes, comments, thoughts, Q&A, chats, feedback authorship, suggested tags |

Detailed field-level mapping: **see [Schema alignment](#schema-alignment) below** (matches generated ZenStack models).

---

## Tipper-facing identity vs personal brand (`Entity`)

- **`Profile` (1:1 with `User`)** is Tipper’s **resident identity dossier**: what others coordinate on when interacting with **you** as a person on the platform (display, onboarding story, memberships, visits, votes, comments, polls, chats, feedback authorship—see [Schema alignment](#schema-alignment)). Entity feed **posts “as the business”** use **`ProfileOperationalAffiliation`** (see [Entity posts](#entity-posts-as-the-business)).
- **`Entity` with type `PERSONAL_BRAND`** is optional: an **institutional/public node** in the entity graph when someone intentionally operates as a brand—**not** the same row as `Profile`, but both can attach to the same human via `owner` / conventions in product.

Membership and social participation are keyed to **`Profile`** wherever the UX means “this Tipper identity,” not duplicate keys for the sake of joins; moderation and accountability still resolve to **`User`** through `profile.user_id`.

---

## Schema alignment

The following **`Profile`** relations are defined in ZenStack (`apps/api/schema/**/*.zmodel`):

| Area | Relation (conceptual) |
|------|------------------------|
| Onboarding | `profile_personas`, `profile_interests`, `profile_values` |
| Memberships / affiliations | `entity_community_memberships`; `operational_affiliations`, `commercial_affiliations`, `strategic_affiliations` (entity-side relationship lanes) |
| Visits | `community_visits` (`UserCommunityVisit`) |
| Community creation | `initiated_communities` (`EntityCommunity` initiator) |
| Votes | `votes` (`Vote`), `poll_votes`, `polls_created` |
| Discussion | `post_comments`; `thoughts`, `thought_comments`; `community_qnas`, `community_qna_responses`; `group_chat_memberships`, `group_chat_messages` |
| Feedback board | `feedback_tickets`, `feedback_comments`, `feedback_status_changes` |
| Tags | `suggested_tags_created` (`Tag.created_by_profile`) |

**Participant content** uses **`profile_id`** as actor where the readable subject is Tipper identity; **`User`** stays the login and abuse spine (`user_id` reachable via profile).

---

## What stays on **`User`** (account spine)

Keeping these on **`User`** keeps auth, ownership, and non-social flows clear:

- Credentials, **`Role`**, **email**, verification tokens, **`profile`** (1:1 link)
- **`owned_entities`** (entity ownership claim at account level where modeled)
- **`user_claims`** (`RequestClaim`—claiming workflows)
- Invite graph: **`user_invite_tokens`**, root / received **`UserInvite`**

---

## Entity posts (“as the business”)

**`Post`** ties author capacity to **`ProfileOperationalAffiliation`**, not a bare `profile_id`: posting in the entity feed represents **scoped operational relationship** with the entity, aligned with partnerships/staff—not the same primitive as commenting as a visitor or community member.

---

The onboarding shape should **teach** this separation: profile as **endorsed narrative and inventory**, user as **space for behavioral truth** under clear rules—not one undifferentiated “account page.”
