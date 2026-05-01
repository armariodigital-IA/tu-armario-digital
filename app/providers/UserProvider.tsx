"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { fetchCurrentUser, updateUser as persistUserUpdate } from "@/lib/user-client";

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
  isAuthenticated: boolean;
  isHydratingUser: boolean;
  hasHydratedUser: boolean;
  needsStyleOnboarding: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  saveStylePreferences: (input: SaveStylePreferencesInput) => Promise<AuthUser>;
};

const UserContext = createContext<UserContextValue | null>(null);

function normalizeStyles(styles: string[] | undefined) {
  return Array.isArray(styles) ? styles.filter(Boolean) : [];
}

function normalizeUser(user: AuthUser | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    ...user,
    styles: normalizeStyles(user.styles),
    hasCompletedOnboarding: user.hasCompletedOnboarding === true,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isHydratingUser, setIsHydratingUser] = useState(true);
  const [hasHydratedUser, setHasHydratedUser] = useState(false);

  const refreshUser = useCallback(async () => {
    setIsHydratingUser(true);

    try {
      const data = normalizeUser(await fetchCurrentUser());

      if (!data) {
        setUserState(null);
        return null;
      }

      console.log("User from DB:", data);
      console.log("Styles from DB:", data?.styles);
      setUserState(data);
      return data;
    } catch {
      setUserState(null);
      return null;
    } finally {
      setIsHydratingUser(false);
      setHasHydratedUser(true);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const setUser = useCallback((nextUser: SetStateAction<AuthUser | null>) => {
    setUserState((currentUser) =>
      normalizeUser(
        typeof nextUser === "function"
          ? (nextUser as (user: AuthUser | null) => AuthUser | null)(currentUser)
          : nextUser
      )
    );
    setHasHydratedUser(true);
    setIsHydratingUser(false);
  }, []);

  const saveStylePreferences = useCallback(async ({
    styles,
    hasCompletedOnboarding = true,
  }: SaveStylePreferencesInput) => {
    const normalizedStyles = normalizeStyles(styles);
    console.log("Selected:", normalizedStyles);
    console.log("User BEFORE:", user);

    const updatedUser = normalizeUser(
      await persistUserUpdate({
        styles: normalizedStyles,
        hasCompletedOnboarding,
      })
    );
    console.log("User AFTER UPDATE:", updatedUser);
    setUser(updatedUser);
    return updatedUser as AuthUser;
  }, [setUser, user]);

  const isAuthenticated = hasHydratedUser && user !== null;

  const needsStyleOnboarding = useMemo(() => {
    if (!isAuthenticated || !user) {
      return false;
    }

    return !user.hasCompletedOnboarding;
  }, [isAuthenticated, user]);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      isAuthenticated,
      isHydratingUser,
      hasHydratedUser,
      needsStyleOnboarding,
      refreshUser,
      setUser,
      saveStylePreferences,
    }),
    [
      user,
      isAuthenticated,
      isHydratingUser,
      hasHydratedUser,
      needsStyleOnboarding,
      refreshUser,
      setUser,
      saveStylePreferences,
    ]
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
