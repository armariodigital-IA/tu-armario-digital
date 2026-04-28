import AuthenticatedAppShell from "@/app/components/AuthenticatedAppShell";

export default function WardrobeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
}
