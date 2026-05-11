export interface Vibe {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface CommunityVibe {
  vibe: Vibe;
  user_count: number;
}

export interface CommunityVibesResponse {
  total_voters: number;
  vibes: CommunityVibe[];
}

export interface UserVibe {
  id: string;
  vibe: Vibe;
  added_at: string;
}

export interface AddVibeToCommunityDto {
  vibe_id?: string;
  vibe_name?: string;
  category?: string; // Optional category for suggested vibes
}
