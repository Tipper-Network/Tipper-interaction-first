export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  date_of_birth?: string;
}

export interface SavePersonasPayload {
  personas: { persona_id: string }[];
}

export interface SaveValuesPayload {
  values: { value_id: string }[];
}

export interface OnboardingStatus {
  profile_setup: boolean;
  personas_setup: boolean;
  values_setup: boolean;
  interests_setup: boolean;
}
