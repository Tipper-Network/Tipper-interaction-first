import { MetadataRoute } from "next";
import { EntityType__Enum } from "@tipper/shared";
import { isDev } from "@/lib/utils/env_utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "https://tippernetwork.com";

interface Entity {
  id: string;
  slug: string;
  entity_type: string;
  updated_at?: string;
  created_at?: string;
}

interface EntitiesResponse {
  items: Entity[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Fetches all published entities (CLAIMED and FULLY_SETUP status)
 * Excludes UNCLAIMED entities as they're not ready for public viewing
 *
 * During build time, if the API is unavailable, this will gracefully
 * return an empty array so the build can complete with static routes only.
 */
async function fetchAllEntities(): Promise<Entity[]> {
  if (!API_BASE_URL) {
    // Silently skip if API URL is not configured (e.g., during build)
    return [];
  }

  const allEntities: Entity[] = [];
  let page = 1;
  const limit = 100; // Fetch in batches of 100
  let hasMore = true;

  try {
    while (hasMore) {
      // Add a timeout to prevent hanging during build
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        // Filter to only include CLAIMED and FULLY_SETUP entities
        // Exclude UNCLAIMED entities from sitemap
        const response = await fetch(
          `${API_BASE_URL}/entities?page=${page}&limit=${limit}&statuses=UNCLAIMED&filterMode=exclude`,
          {
            // Use ISR (Incremental Static Regeneration) - revalidate every hour
            next: { revalidate: 3600 }, // 1 hour in seconds
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Silently fail during build - static routes will still be included
          break;
        }

        const data: EntitiesResponse = await response.json();
        allEntities.push(...data.items);

        // Check if there are more pages
        const totalPages = Math.ceil(data.total / data.limit);
        hasMore = page < totalPages;
        page++;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // If fetch fails (e.g., connection refused during build), break the loop
        break;
      }
    }
  } catch (error) {
    // Silently handle errors during build time
    // The sitemap will still be generated with static routes
    // Errors are expected when the backend isn't running during build
    if (isDev()) {
      // Only log in development to avoid build noise
      console.warn(
        "Sitemap: Could not fetch entities (backend may not be running):",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return allEntities;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = FRONTEND_URL;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore/entity_communities`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Tipper Standards pages
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/community-qna`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacypolicy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic routes for entity types
  const entityTypeRoutes: MetadataRoute.Sitemap = Object.values(
    EntityType__Enum
  )
    .filter((type) => {
      // Only include entity types that are active in the UI
      const activeTypes = [
        EntityType__Enum.BUSINESS,
        EntityType__Enum.PERSONAL_BRAND,
        EntityType__Enum.OTHER,
      ];
      return activeTypes.includes(type);
    })
    .map((entityType) => ({
      url: `${baseUrl}/explore/entities/${entityType.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  // Dynamic routes for individual entities
  // Note: Including all published entities in sitemap is standard practice for SEO.
  // Google can handle up to 50,000 URLs per sitemap (50MB uncompressed).
  // If you exceed this, consider using a sitemap index to split into multiple files.
  const entities = await fetchAllEntities();
  const entityDetailRoutes: MetadataRoute.Sitemap = entities.map((entity) => {
    const entityType = (entity.entity_type || "BUSINESS").toLowerCase();
    return {
      url: `${baseUrl}/explore/entities/${entityType}/${entity.slug}`,
      lastModified: entity.updated_at
        ? new Date(entity.updated_at)
        : entity.created_at
          ? new Date(entity.created_at)
          : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...entityTypeRoutes, ...entityDetailRoutes];
}

// Configure revalidation for the sitemap
// This allows the sitemap to be statically generated but revalidated periodically
export const revalidate = 3600; // Revalidate every hour (3600 seconds)
