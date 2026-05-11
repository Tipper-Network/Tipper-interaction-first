import {
  OnboardingStatus,
  SavePersonasPayload,
  SaveValuesPayload,
  UpdateProfilePayload,
} from "./profile.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateUserProfilePayload {
  first_name: string;
  last_name: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  date_of_birth?: string;
  personas: { persona_id: string }[];
  values: { value_id: string }[];
}

export const fetchUserProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    credentials: "include",
  });
  if (!res.ok) {
    // Handle 404 gracefully - user just doesn't have a profile yet
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch user profile");
  }

  // Check if response has content before parsing
  const contentType = res.headers.get("content-type");
  const text = await res.text();

  // If response is empty or not JSON, return null
  if (!text || !contentType?.includes("application/json")) {
    return null;
  }

  try {
    const data = JSON.parse(text);
    // Backend may return null for missing profiles
    return data;
  } catch (err) {
    // If JSON parsing fails, return null
    return null;
  }
};

export const fetchUserPersonas = async () => {
  const res = await fetch(`${API_BASE_URL}/users/personas`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user personas");
  return await res.json();
};

export const fetchUserInterests = async () => {
  const res = await fetch(`${API_BASE_URL}/users/interests`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user interests");
  return await res.json();
};

export const fetchUserValues = async () => {
  const res = await fetch(`${API_BASE_URL}/users/values`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user values");
  return await res.json();
};

export const createUserProfile = async (data: CreateUserProfilePayload) => {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("API Error:", error);
    throw new Error(error.message || "Failed to create user profile");
  }

  const result = await res.json();
  return result;
};

export const updateUserInterests = async (interest_ids: string[]) => {
  const res = await fetch(`${API_BASE_URL}/users/interests`, {
    method: "POST",
    body: JSON.stringify({ interest_ids }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("API Error:", error);
    throw new Error(error.message || "Failed to update user interests");
  }

  const result = await res.json();
  return result;
};

// Step 1: Update personal info
export const updateUserProfile = async (data: UpdateProfilePayload) => {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update profile");
  }

  return await res.json();
};

// Step 2: Save personas
export const saveUserPersonas = async (data: SavePersonasPayload) => {
  const res = await fetch(`${API_BASE_URL}/users/personas`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save personas");
  }

  return await res.json();
};

// Step 3: Save values
export const saveUserValues = async (data: SaveValuesPayload) => {
  const res = await fetch(`${API_BASE_URL}/users/values`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save values");
  }

  return await res.json();
};

// Get onboarding completion status
export const getOnboardingStatus = async (): Promise<OnboardingStatus> => {
  const res = await fetch(`${API_BASE_URL}/users/onboarding-status`, {
    method: "GET",
    credentials: "include",
  });

  return await res.json();
};
