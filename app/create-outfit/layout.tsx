import AuthenticatedAppShell from "@/app/components/AuthenticatedAppShell";

export default function CreateOutfitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
}
