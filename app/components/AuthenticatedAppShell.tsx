import OnboardingGate from "@/app/components/OnboardingGate";

export default function AuthenticatedAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <OnboardingGate />
    </>
  );
}
