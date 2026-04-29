# ABAC System Analysis: EntityMember & EntityCommunityMember Structure

## Current Structure Overview

### EntityMember (Entity-level membership)
```
EntityMember
├── entity_id (✅ entity-specific)
├── user_id
└── EntityMemberPosition
    ├── id
    ├── title
    └── entity_members[]
```

### EntityCommunityMember (Community-level membership)
```
EntityCommunityMember
├── entity_community_id (✅ community-specific)
├── user_id
├── memberLevel (LEVEL_1 to LEVEL_10) ✅
├── status (PENDING, ACTIVE, etc.) ✅
├── visitCount ✅
└── EntityCommunityPosition
    ├── id
    ├── name
    └── entityCommunityMember[]
```

## Issues Identified

### 🔴 Critical Issue #1: Positions are NOT entity/community-specific

**Problem:**
- `EntityMemberPosition` has NO `entity_id` field
- `EntityCommunityPosition` has NO `entity_community_id` field
- This means positions are **global**, not entity/community-specific

**Impact:**
- Entities cannot create their own custom positions
- All entities share the same position pool
- Cannot have different rules for the same position name across entities
- **Incompatible with your goal**: "entities to give different positions they created different rules"

### 🔴 Critical Issue #2: No connection to ABAC Permission system

**Problem:**
- `Permission` model exists but is not connected to positions
- No way to map: `Position → Permissions → Policy Rules`
- The commented `positionRules Json?` field is not sufficient for ABAC

**Impact:**
- Cannot enforce position-based permissions
- Cannot check attributes in ABAC policies (e.g., `subject.isEntityEmployee`)
- Hard to implement future custom rules per position

### 🟡 Issue #3: Missing entity ownership relationship

**Problem:**
- No clear way to identify entity owners
- ABAC policy checks for `subject.isEntityOwner` but no data model support

**Impact:**
- Cannot properly implement ownership checks in ABAC policies

## ABAC Compatibility Analysis

### What ABAC Needs (from policy.json):
```json
{
  "subject.isCommunityMember": true,
  "subject.communityLevel": 3,
  "subject.isEntityEmployee": true,
  "subject.isEntityOwner": true,
  "subject.globalRank": "Agent"
}
```

### Current Structure Support:

| Attribute | Current Support | Status |
|-----------|----------------|--------|
| `isCommunityMember` | ✅ Can check `EntityCommunityMember` exists | ✅ Works |
| `communityLevel` | ✅ `memberLevel` enum exists | ✅ Works |
| `isEntityEmployee` | ⚠️ Can check `EntityMember` exists, but no position context | ⚠️ Partial |
| `isEntityOwner` | ❌ No ownership model | ❌ Missing |
| `position-based checks` | ❌ No position → permission mapping | ❌ Missing |

## Recommended Fixes

### Fix #1: Make Positions Entity/Community-Specific

```zmodel
model EntityMemberPosition {
  id String @id @default(uuid())
  title String
  entity_id String  // ✅ ADD THIS
  entity Entity @relation(fields: [entity_id], references: [id], onDelete: Cascade)
  entity_members EntityMember[]
  
  // Future: positionRules Json? // Custom rules per position per entity
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  
  @@unique([entity_id, title]) // Prevent duplicate position names per entity
}

model EntityCommunityPosition {
  id String @id @default(uuid())
  name String
  entity_community_id String  // ✅ ADD THIS
  entity_community EntityCommunity @relation(fields: [entity_community_id], references: [id], onDelete: Cascade)
  entityCommunityMember EntityCommunityMember[]
  
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  
  @@unique([entity_community_id, name]) // Prevent duplicate position names per community
}
```

### Fix #2: Connect Positions to Permissions (for future ABAC)

**Option A: Direct Permission Assignment (Simpler, for now)**
```zmodel
model EntityMemberPosition {
  // ... existing fields ...
  permissions Permission[] // Many-to-many relationship
}

model EntityCommunityPosition {
  // ... existing fields ...
  permissions Permission[] // Many-to-many relationship
}

// Junction tables
model EntityMemberPositionPermission {
  position_id String
  permission_id String
  position EntityMemberPosition @relation(fields: [position_id], references: [id])
  permission Permission @relation(fields: [permission_id], references: [id])
  @@unique([position_id, permission_id])
}
```

**Option B: Attribute-Based (More flexible, for future)**
```zmodel
// Future: When you implement full ABAC attributes
model PositionAttribute {
  id String @id @default(uuid())
  position_type String // "ENTITY_MEMBER" | "ENTITY_COMMUNITY"
  position_id String
  attribute_key String // e.g., "canEditProfile", "canDeletePosts"
  attribute_value String // e.g., "true", "level_3_required"
  metadata Json?
}
```

### Fix #3: Add Entity Ownership

```zmodel
model Entity {
  // ... existing fields ...
  owner_id String?  // ✅ ADD THIS
  owner User? @relation("EntityOwner", fields: [owner_id], references: [id])
}
```

## Migration Path

### Phase 1: Fix Position Scoping (Required Now)
1. Add `entity_id` to `EntityMemberPosition`
2. Add `entity_community_id` to `EntityCommunityPosition`
3. Migrate existing data (assign positions to default entity/community)
4. Add unique constraints

### Phase 2: Hardcoded Rules (Current Phase)
- Rules are hardcoded in service layer
- Check position names/IDs in permission service
- Example: `if (position.title === "Manager") { allow() }`

### Phase 3: Permission System (Future)
- Connect positions to `Permission` model
- Create position-permission mappings
- Update ABAC engine to check position permissions

### Phase 4: Custom Rules (Future)
- Add `positionRules Json?` field
- Allow entities to define custom rules per position
- Parse and evaluate rules in ABAC engine

## ABAC Attribute Resolution Strategy

### How to derive ABAC attributes from current structure:

```typescript
// Example: Resolve subject attributes for ABAC
function resolveSubjectAttributes(userId: string, entityId?: string, communityId?: string) {
  return {
    // From EntityMember
    isEntityEmployee: !!entityMember,
    entityPosition: entityMember?.entityMemberPosition?.title,
    
    // From EntityCommunityMember  
    isCommunityMember: !!communityMember,
    communityLevel: communityMember?.memberLevel,
    communityPosition: communityMember?.entityCommunityPosition?.name,
    
    // From Entity
    isEntityOwner: entity?.owner_id === userId,
    
    // From User
    globalRank: user?.globalRank,
  };
}
```

## Conclusion

### ✅ What Works:
- Basic membership structure (EntityMember, EntityCommunityMember)
- Level system for communities
- Status tracking

### ❌ What Needs Fixing:
1. **Positions must be entity/community-specific** (critical for your use case)
2. **Connection to Permission system** (for ABAC)
3. **Entity ownership model** (for ABAC policies)

### 🎯 Recommendation:
**Fix #1 is CRITICAL and must be done now** before you can properly implement ABAC. The other fixes can be phased in as you build out the permission system.

