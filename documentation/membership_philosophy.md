# Membership philosophy and data model

This document aligns **Tipper’s membership concepts** with the **User / Profile** split from [user philosophy.md](user%20philosophy.md) and with the **actual schema** under `apps/api/schema/`. It distinguishes **community membership**, **commercial / patron membership** (subscription, sponsor, fan-tier), and **operational / contractual work** (staff, partnership-with-a-person), then states what the tables do today and how to evolve them toward an **attribute-based** permission model.

---

## 1. Shared idea: “membership”

**Membership** means: a **User** (account + behavioral evidence) has an ongoing, scoped **relationship** to some **context** (usually an **Entity** or its **EntityCommunity**). The **Profile** is where you *show* affiliations and roles to others; the authoritative rows still hang off **User** for auth and policy.

Three **kinds** of membership you care about:

| Kind | Everyday meaning | Typical access / product surface | Philosophy note |
|------|------------------|----------------------------------|-----------------|
| **A. Community member** | Part of the **place’s community**: visits, feed, Q&A, maybe governance as a *member*, not as *business operator*. | Community home, thoughts, polls—**not** assumed entity admin/back office. | Fits **User + visit/member stats**; **Profile** can show “regular at X” if the user opts in. |
| **B. Commercial / patron member** | **Pays or subscribes**: monthly sponsor, premium tier, newsletter SKU, “fan” package. | Billing state, entitlements, badges, gated content. | Legible **contract with the entity** (tier, `subscription_id`, `expiresAt`); often **low** operational power. |
| **C. Operational / work relationship** | **Works with** the entity under something like a **partnership mindset** (shift, role, verification, served visitors, reviews on *their* profile). | Staff tools, attribution of service, moderation of entity channel, etc. | Fits your **contractual / partnership** framing: explicit scope, not vague “employee blob.” |

Kinds **A–C can overlap** on the same User + Entity (e.g. staff who is also in the community and pays for a VIP tier). The schema should allow **multiple concurrent relationships** without forcing one row to mean everything.

---

## 2. What the database has today

### 2.1 `EntityCommunity` + `EntityCommunityMember` (Kind **A**)

- **Entity**: the business / brand record.
- **EntityCommunity**: the **community layer** around one entity (`entity_id` is unique—one community per entity in practice).
- **EntityCommunityMember**: **User ↔ EntityCommunity** with `status`, `visit_count`, `lastVisitedAt`, `member_level`, invites, etc.

**Governance / “power in the community”** is expressed through:

- **EntityCommunityPosition** (per community): named positions, `isStaffPosition`, `hierarchy_level`, `governance_weight`, `requiresApproval`, etc.
- **EntityCommunityMemberPosition**: assignment of a member to positions, with optional `expiresAt`.

Historical note: **`EntityCommunityMemberRole` exists as an enum** in the zmodel; an older DB migration added a `role` column, then a **later migration dropped `role`** in favor of **positions**—so **roles in the community are “position-based,”** not a single column on the member row (generated Prisma matches that: no `role` on `EntityCommunityMember`).

**Mapping to your example:** a plain community member has **no EntityCommunityPosition** (or only MEMBER-like positions you define), so they **do not** get entity **admin** UX—that is usually **Entity.owner** or **entity-side** roles, not community membership by default.

---

### 2.2 `EntityMember` + `EntityPosition` + `EntityMemberPosition` (Kinds **B** and **C** today—**compressed**)

This block is the **entity-side** membership (`User` + `Entity`):

- **EntityPosition**: titles the entity defines (“Moderator”, “Barista”, “Sponsor tier gold”, etc.—**you** must decide which titles are **commercial** vs **operational**; the table is generic).
- **EntityMember**: one row links **user**, **entity**, **tier/subscription fields** (`membership_tier`, `subscription_id`, `expiresAt`, `reputation_score`, `isVerified`), **`posts`** (entity posts go through **EntityMember**).

**Important modeling quirk (worth fixing later):**

- `EntityMember` carries a required scalar **`entity_member_position_id`** and uses `@@unique([user_id, entity_member_position_id])`, **and** has a separate many-to-many **`EntityMemberPosition[]`** for additional positions. That reads like **two patterns at once**: “one anchor position per row” plus “junction for more positions.” It makes **multiple relationship kinds** harder to explain (sponsor vs staff might become multiple `EntityMember` rows per user/entity, or one row with many positions—behavior must be defined in app code).

**Current likely intent (inferred):**

- **Patrons / sponsors (B)** → `EntityMember` with positions like “Subscriber”, “Monthly sponsor”, tiers in `membership_tier` / billing ids.
- **Staff / operational (C)** → same `EntityMember` + positions such as “Manager”, “Server”, plus `Post` authoring.

So **commercial and operational links are not first-class separated** today; **position name + conventions** distinguish them.

---

### 2.3 `Partnership` (entity ↔ entity—not person ↔ entity)

**Partnership** and **PartnershipInvitation** connect **`Entity`** to **`Entity`**. That is **org-to-org**, not the **User “works here” contractual** edge you described. Fine for alliances; **do not overload it** as “employment” unless you intentionally model workers as nested entities (usually you do not).

---

### 2.4 `Permission` + attribute story

- **`Permission`** rows (`value` + **`PermissionScope`**: ENTITY, ENTITY_COMMUNITY, PARTNERSHIP, EVENT, GLOBAL) exist but are **not wired** to `EntityPosition`, `EntityCommunityPosition`, or members in schema (see internal analysis `apps/api/schema/ABAC_ANALYSIS.md`).
- **`MembershipAttribute` / `Attribute`** were introduced and **later dropped** during migrations (`20260222112723` … `20260222190954`). So today there is **no** generic attributes table keyed to memberships—only **`Permission` catalog** awaiting wiring.

Your “attribute-based system” **forward path** should either:

1. **Reintroduce** something like `MembershipAttribute` with a **discriminated membership** (which table + which id), **or**
2. Attach **Permission** (or attributes) to **positions** (`EntityPosition`, `EntityCommunityPosition`) and resolve **User** → positions → permissions.

---

## 3. Mental models vs tables (summary)

| Mental model | Primary tables today | User vs Profile |
|--------------|----------------------|----------------|
| **Visitor / community participant** | `UserCommunityVisit`, often plus `EntityCommunityMember` | **User**-side evidence; **Profile** shows what user curates. |
| **Community member (no admin)** | `EntityCommunityMember` + optional `EntityCommunityMemberPosition` | Same. |
| **Patron / subscriber / “entity member” paying** | `EntityMember` (tiers, `subscription_id`, `expiresAt`) + `EntityPosition` meaning | Public tier/badge → **Profile**; billing truth → **User** + entity row. |
| **Works with entity (staff, partnership mindset)** | `EntityMember` + operational `EntityPosition` (+ future: visit attribution, agreements) | Service reputation → largely **Profile**; shift stats → **User** ledger rules you define. |
| **Entity controls (owner / back office)** | `Entity.owner_id` → **User**, plus future explicit admin grants | Operational, not “membership” in the fan sense. |

---

## 4. Renaming and organization (recommended direction)

Names are overloaded (“EntityMember” sounds like Kind **C** only but carries Kind **B** fields). Incremental clarity **without breaking everything**:

1. **Concept names (docs + API)**  
   - **CommunityMembership** ≡ `EntityCommunityMember`  
   - **EntityAffiliation** or **EntityRelationship** ≡ `EntityMember` (until split)  
   - **OperationalEngagement** / **PatronEntitlement**: either **split tables** later or **enforce `relationship_kind` enum** on one table.

2. **Schema evolution options**  
   - **Light:** add `enum EntityMembershipKind { COMMUNITY_ADVOCATE PATRON STAFF VOLUNTEER OTHER }` (or split by **position taxonomy**) on `EntityMember` + document that patrons **must** use positions tagged as commercial.  
   - **Heavy (clean):** **`EntityPatronMembership`** vs **`EntityOperationalEngagement`** sharing a small common base or both FK `User`+`Entity` with separate attribute rows.

3. **Permissions / attributes**  
   - Prefer **capabilities on positions**: `EntityPosition`/`EntityCommunityPosition` → many-to-many → `Permission` (or revive **attributes** keyed by position id).  
   - **`PermissionScope`** already hints ENTITY vs ENTITY_COMMUNITY—use that consistently when wiring admin vs community moderation.

4. **`EntityCommunity` vs “part of entity”**  
   - Technically the community member is part of **`EntityCommunity`**, which is **tied to** the entity—not the same relation row as **`EntityMember`**. That matches “in the orbit of the brand” vs “in a commercial/work contract.”

---

## 5. Gaps vs your stated product vision

- **Visitors served + reviews on worker profile** needs edges from **interaction** → **staff User/Profile**, not resolved by membership tables alone.
- **`Partnership`** as **contractual employment** for a **person** is **not** modeled; you need **`User ↔ Entity`** **agreement** (or purely position-based semantics with verified scope).
- **Single `EntityMember` row shape** mixes **Kinds B and C**; document app rules until you split or add `relationship_kind`.

---

## 6. References in repo

| Area | Files |
|------|--------|
| Community + positions | [`entity_community.zmodel`](apps/api/schema/entity_community/entity_community.zmodel), [`membership.zmodel`](apps/api/schema/user/membership.zmodel) |
| Entity-side member + positions | [`membership.zmodel`](apps/api/schema/user/membership.zmodel) |
| Permissions catalog | [`role.zmodel`](apps/api/schema/user/role.zmodel) |
| Posts ↔ entity staff | [`posts.zmodel`](apps/api/schema/entity/posts.zmodel) |
| ABAC gap notes | [`ABAC_ANALYSIS.md`](apps/api/schema/ABAC_ANALYSIS.md) |

This document should stay **truth-seeking**: when you change zmodel/migrations, update §2 and §3 to match.
