"use client";

import StylePreferencesModal from "@/app/components/StylePreferencesModal";
import { useUser } from "@/app/providers/UserProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function OnboardingGate() {
  const { t } = useLanguage();
  const {
    user,
    hasHydratedUser,
    isAuthenticated,
    needsStyleOnboarding,
    saveStylePreferences,
  } = useUser();
  const shouldOpen =
    hasHydratedUser &&
    isAuthenticated &&
    user != null &&
    needsStyleOnboarding;

  if (
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
        await saveStylePreferences({
          styles,
          hasCompletedOnboarding: true,
        });
      }}
      mandatory
      title={t("selectYourStylesTitle")}
      description={t("selectYourStylesBody")}
    />
  );
}
