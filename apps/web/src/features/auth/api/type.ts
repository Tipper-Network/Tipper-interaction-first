type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  avatarUrl?: string;
};

export type SessionUser = {
  id: string;
  federated_identity_user: boolean;
  email_verified: boolean;
  email: string;
  user_role: string;
};

type SessionData = {
  user: SessionUser;
  profile: UserProfile | null;
};
