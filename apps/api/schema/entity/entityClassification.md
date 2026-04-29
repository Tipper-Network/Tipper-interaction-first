# Entity Classification System

## Overview

Entities are separated based on types. This document explains the relationship between entity types and classification types.

## Entity Types vs Classification Types

### Entity Types
Entity types are the **basis of our understanding** of the entity itself, which is connected to the `entityClassificationType`.

### Classification Types
The classification type is the equivalent of `businessType` for business entities, which gives us more space for information delivery on the database itself.

## Design Rationale

This concept arose when considering:

1. **Business Types** - When thinking about business types as part of entity type "business"
2. **Future Expansion** - Potential future personal brand types and other entity categories
3. **Scalability** - The classification type system provides flexibility for future entity categories

## Structure

```
Entity
  └── EntityType (e.g., "business", "personal", etc.)
      └── EntityClassificationType (e.g., "restaurant", "retail", "service", etc.)
```

This two-level hierarchy allows for:
- Clear categorization at the entity level
- Detailed classification within each entity type
- Easy extension for new entity types and classifications
