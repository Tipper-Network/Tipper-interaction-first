# Partnership framing (entity ↔ person)

This document captures how **Tipper** uses the word **partnership** for **entity memberships** (person ↔ business/brand), how that relates to the **User / Profile** split, and how to evolve the **data model** without collapsing different real-world relationships into one permission shape.

See also: [user philosophy.md](user%20philosophy.md) (User vs Profile), [membership_philosophy.md](membership_philosophy.md) (community vs entity tables and current schema).

---

## 1. Unifying idea

**Every entity membership can be read as a partnership in the informal sense:** a **scoped, mutual agreement**. The entity receives something (labor, money, distribution, credibility, content, introductions). The person receives something (pay, perks, access, audience, equity narrative, recognition, gated offers).

That mental model stays honest for product narrative and for a **single spine** (`User` + `Entity` + lifecycle) if you remember:

- **Partnership ≠ identical permissions.** A monthly subscriber and an employee are both “in relationship” but belong in **different trust and capability classes**.
- **`Partnership` in the database today** connects **`Entity` ↔ `Entity`** (org–org alliances). **Person ↔ entity** “partnership” is **conceptual language** mapped to **`EntityMember`** (and future explicit agreement rows), not overload of `Partnership` unless workers are modeled as entities (usually not).

---

## 2. Examples you named (non-exhaustive)

| Kind | Typical exchange |
|------|-------------------|
| **Employee** | Labor ↔ compensation, policies, tooling access |
| **Subscriber** | Recurring fee ↔ entitlements, content, perks |
| **Sponsor** | Money ↔ visibility, goodwill, perks (often richer than subscriber) |
| **Media partner** | Distribution / content ↔ co-marketing, access, attribution |
| **Investor** | Capital / introductions ↔ governance story, reporting, prestige (often **legal entity** involved) |

Treat these as **relationship archetypes**, not necessarily one row shape each.

---

## 3. Gaps to consider (often needed later)

These are **common** in real businesses; you can fold some into `OTHER` until you need them.

| Kind | Note |
|------|------|
| **Contractor / freelancer** | Not employee; different verification and tenure |
| **Volunteer / intern** | Often time-bounded, low or no pay, still operational |
| **Affiliate / ambassador / referrer** | Close to media partner but **performance** and fraud risk differ |
| **Supplier / vendor** | B2B; sometimes **organization** as counterparty |
| **Board / advisor** | High trust; usually **narrow** tooling vs daily ops |
| **Franchisee / licensee / operator** | Runs a unit under the brand |
| **Project / event collaborator** | Time-boxed, not full membership |
| **Customer (non-subscriber)** | One-off; may stay outside “membership” or use a light tier |
| **Waitlist / applicant / lead** | Pre-relationship funnel, different entitlements |
| **Alumni / former staff / past sponsor** | History and reputation **without** active grants |

Missing types are mostly **economics + duration + counterpart type (person vs org)**, not a need for dozens of tables on day one.

---

## 4. Philosophy alignment (User / Profile)

- **User:** account anchor, behavioral evidence, what the platform can observe (subject to consent).
- **Profile:** staged identity — what visitors see (badges like “Media partner at X”) should ultimately **reflect** authoritative relationship rows keyed off **User**, not replace them.

Declaring “we are partners” in copy is **Profile-facing**; **enforcement** (billing, admin keys, served-visitor attribution) stays on **User-linked** records and future attribute resolution.

---

## 5. Community vs entity “partnership”

- **Entity side:** commercial and operational relationships with the **business** (this document).
- **Community side:** **`EntityCommunityMember`** and **community positions** — participation and governance in the **community layer**, not the same as sponsor or employee.

Same human can hold **both**; rules and abuse models should stay **separable**. Community roles will be **attribute-based**; implementation is **deferred** — see §7.

---

## 6. How to move forward (schema direction, staged)

Until the attribute engine is finalized:

1. **Introduce explicit classification on the user–entity edge**  
   e.g. `relationship_kind` (enum) such as  
   `OPERATOR_STAFF | CONTRACTOR | SUBSCRIBER | SPONSOR | MEDIA_PARTNER | INVESTMENT_REP | ADVISOR | VOLUNTEER | AMBASSADOR | VENDOR | PROJECT_COLLABORATOR | ALUMNI | APPLICANT | OTHER`  
   Ship a **small v1 subset** (8–12); expand as needed.

2. **Separate *kind* from *capabilities***  
   - **Kind:** economics + trust class + narrative.  
   - **Capabilities:** resolved later via **positions + attributes/permissions** (entity and community pipelines discussed separately).

3. **Lifecycle**  
   `PENDING | ACTIVE | SUSPENDED | ENDED` (or equivalent) on the same spine so endings stay **auditable** and reputational history survives.

4. **Investors**  
   If the counterparty is a **company** or fund, pair **`Entity` ↔ `Entity`** (`Partnership` or successors) with an optional **authorized representative** `User` link — avoid modeling the LP solely as one person row.

5. **Keep `EntityMember` evolution intentional**  
   Today **`EntityMember`** mixes **patron-style** fields (`membership_tier`, `subscription_id`, `expiresAt`) with **operational** use (posts, positions). Classification + clearer conventions (or a later split) prevent “one row means everything.”

---

## 7. Attributes and rules (deferred)

- **Entity:** capabilities attached to **entity positions** and/or **membership records** once the rule language exists.
- **Community:** **`EntityCommunityPosition`** assignments feed the same pattern at **`ENTITY_COMMUNITY`** scope.

Cross-reference: **`Permission`** / **`PermissionScope`** in [`apps/api/schema/user/role.zmodel`](apps/api/schema/user/role.zmodel) and gaps noted in [`apps/api/schema/ABAC_ANALYSIS.md`](apps/api/schema/ABAC_ANALYSIS.md).

---

## 8. Summary

| Question | Answer |
|----------|--------|
| Are all entity memberships “partnerships”? | **Yes, informally** — scoped mutual agreement. **No** — if that implies one permission template for everyone. |
| Is anything missing conceptually? | Often **contractor, volunteer, affiliate, vendor, advisor, collaborator, alum, funnel states** — normalize with **`relationship_kind`**, not only job titles on `EntityPosition`. |
| DB `Partnership` model? | **Entity–entity.** Person–entity framing is layered on **`EntityMember`** (+ future agreement/attribute wiring). |

This file should be updated when you lock **v1 enums**, **lifecycle states**, or split **commercial vs operational** rows in schema.
