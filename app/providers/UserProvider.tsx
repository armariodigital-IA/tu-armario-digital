"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  gender?: string;
  styles?: string[];
  hasCompletedOnboarding?: boolean;
};

type SaveStylePreferencesInput = {
  styles: string[];
  hasCompletedOnboarding?: boolean;
};

type UserContextValue = {
  user: AuthUser | null;
  isHydratingUser: boolean;
  hasHydratedUser: boolean;
  needsStyleOnboarding: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
  saveStylePreferences: (input: SaveStylePreferencesInput) => Promise<AuthUser>;
};

const UserContext = createContext<UserContextValue | null>(null);

function normalizeStyles(styles: string[] | undefined) {
  return Array.isArray(styles) ? styles.filter(Boolean) : [];
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isHydratingUser, setIsHydratingUser] = useState(true);
  const [hasHydratedUser, setHasHydratedUser] = useState(false);

  const refreshUser = async () => {
    setIsHydratingUser(true);

    try {
      const res = await fetch("/api/me", { credentials: "include" });

      if (!res.ok) {
        setUserState(null);
        return null;
      }

      const data = (await res.json()) as AuthUser;
      setUserState(data);
      return data;
    } catch {
      setUserState(null);
      return null;
    } finally {
      setIsHydratingUser(false);
      setHasHydratedUser(true);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const setUser = (nextUser: AuthUser | null) => {
    setUserState(nextUser);
    setHasHydratedUser(true);
    setIsHydratingUser(false);
  };

  const saveStylePreferences = async ({
    styles,
    hasCompletedOnboarding = true,
  }: SaveStylePreferencesInput) => {
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ styles, hasCompletedOnboarding }),
    });

    if (!res.ok) {
      throw new Error("Could not save style preferences");
    }

    const data = (await res.json()) as AuthUser;
    setUser(data);
    return data;
  };

  const needsStyleOnboarding = useMemo(() => {
    if (!hasHydratedUser || !user) {
      return false;
    }

    const styles = normalizeStyles(user.styles);
    return styles.length === 0 && user.hasCompletedOnboarding !== true;
  }, [hasHydratedUser, user]);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      isHydratingUser,
      hasHydratedUser,
      needsStyleOnboarding,
      refreshUser,
      setUser,
      saveStylePreferences,
    }),
    [user, isHydratingUser, hasHydratedUser, needsStyleOnboarding]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}
