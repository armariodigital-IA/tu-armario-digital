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
  source: "onboarding" | "account";
  styles: string[];
};

type UserContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydratingUser: boolean;
  hasHydratedUser: boolean;
  needsStyleOnboarding: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  saveUserStyles: (input: SaveStylePreferencesInput) => Promise<AuthUser | null>;
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
        console.warn("Skipping null user refresh");
        return null;
      }

      console.log("User from DB:", data);
      console.log("Styles from DB:", data?.styles);
      setUserState((prev) => {
        console.log("PREV USER:", prev);
        console.log("NEW DATA:", data);

        if (!prev) {
          return data;
        }

        if (
          Array.isArray(prev.styles) &&
          prev.styles.length > 0 &&
          Array.isArray(data?.styles) &&
          data.styles.length === 0
        ) {
          console.warn("Prevented overwrite: incoming styles empty, keeping previous");
          return prev;
        }

        return data;
      });
      return data;
    } catch {
      console.warn("Skipping user overwrite because user refresh failed");
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

  const saveUserStyles = useCallback(async ({
    source,
    styles,
  }: SaveStylePreferencesInput) => {
    const normalizedStyles = normalizeStyles(styles);

    if (normalizedStyles.length === 0) {
      return null;
    }

    console.log("Saving styles from:", source);
    console.log("Styles:", normalizedStyles);

    const updatedUser = normalizeUser(
      await persistUserUpdate({
        styles: normalizedStyles,
        hasCompletedOnboarding: true,
      })
    );

    console.log("User from DB:", updatedUser);
    console.log("Styles from DB:", updatedUser?.styles);

    setUser(updatedUser);
    window.localStorage.setItem("onboardingCompleted", "true");
    return updatedUser as AuthUser;
  }, [setUser]);

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
      saveUserStyles,
    }),
    [
      user,
      isAuthenticated,
      isHydratingUser,
      hasHydratedUser,
      needsStyleOnboarding,
      refreshUser,
      setUser,
      saveUserStyles,
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
