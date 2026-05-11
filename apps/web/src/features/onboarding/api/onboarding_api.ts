const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPersonas = async () => {
  const res = await fetch(`${API_BASE_URL}/onboarding/personas`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

export const fetchValues = async () => {
  const res = await fetch(`${API_BASE_URL}/onboarding/values`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

export const fetchInterests = async () => {
  const res = await fetch(`${API_BASE_URL}/onboarding/interests`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  return data;
};

export const fetchEntityArchetypes = async () => {
  const res = await fetch(`${API_BASE_URL}/onboarding/entity-archetypes`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

export const fetchEntityValues = async () => {
  const res = await fetch(`${API_BASE_URL}/onboarding/entity-values`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

export const fetchEntityInterests = async () => {
  const res = await fetch(`${API_BASE_URL}/onboarding/entity-interests`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};
