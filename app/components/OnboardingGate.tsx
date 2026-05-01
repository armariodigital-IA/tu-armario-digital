"use client";

import StylePreferencesModal from "@/app/components/StylePreferencesModal";
import { useUser } from "@/app/providers/UserProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useMemo } from "react";

const ONBOARDING_STORAGE_KEY = "onboardingCompleted";

export default function OnboardingGate() {
  const { t } = useLanguage();
  const {
    user,
    hasHydratedUser,
    isAuthenticated,
    needsStyleOnboarding,
    saveUserStyles,
  } = useUser();
  const userStorageKey = useMemo(() => {
    const userId = user?.id ?? user?._id;
    return userId ? `${ONBOARDING_STORAGE_KEY}:${userId}` : null;
  }, [user]);
  const isUserLoaded = hasHydratedUser;
  const hasLocalCompletion = useMemo(() => {
    if (!isUserLoaded || !userStorageKey || typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(userStorageKey) === "true";
  }, [isUserLoaded, userStorageKey]);

  const shouldOpen =
    isUserLoaded &&
    hasHydratedUser &&
    isAuthenticated &&
    user != null &&
    needsStyleOnboarding &&
    !hasLocalCompletion;

  if (
    !isUserLoaded ||
    !hasHydratedUser ||
    !isAuthenticated ||
    !user ||
    !needsStyleOnboarding ||
    !shouldOpen
  ) {
    return null;
  }

  return (
    <StylePreferencesModal
      isOpen={shouldOpen}
      gender={user.gender}
      initialStyles={user.styles ?? []}
      onClose={() => undefined}
      onSave={async (styles) => {
        const updatedUser = await saveUserStyles({
          source: "onboarding",
          styles,
        });

        if (userStorageKey) {
          window.localStorage.setItem(userStorageKey, "true");
        }

        console.log("Saved successfully");
        console.log("User after save:", updatedUser);
      }}
      mandatory
      title={t("selectYourStylesTitle")}
      description={t("selectYourStylesBody")}
    />
  );
}
