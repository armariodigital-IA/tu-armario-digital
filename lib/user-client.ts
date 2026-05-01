type UserPayload = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  gender?: string;
  styles?: string[];
  hasCompletedOnboarding?: boolean;
};

export async function fetchCurrentUser() {
  const res = await fetch("/api/user", {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as UserPayload;
}

export async function updateUser(data: {
  styles: string[];
  hasCompletedOnboarding?: boolean;
}) {
  const res = await fetch("/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Could not save user");
  }

  return (await res.json()) as UserPayload;
}
