import { AppShell } from "@/components/app-shell";
import { ProfilProvider } from "@/components/profil-pengajar";
import { AuthProvider } from "@/components/auth";
import { ConfirmProvider } from "@/components/confirm-dialog";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfirmProvider>
      <AuthProvider>
        <ProfilProvider>
          <AppShell>{children}</AppShell>
        </ProfilProvider>
      </AuthProvider>
    </ConfirmProvider>
  );
}
