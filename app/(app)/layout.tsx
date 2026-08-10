import { AppShell } from "@/components/app-shell";
import { ProfilProvider } from "@/components/profil-pengajar";
import { AuthProvider } from "@/components/auth";
import { ConfirmProvider } from "@/components/confirm-dialog";
import { LoginSheetProvider } from "@/components/login-sheet";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfirmProvider>
      <AuthProvider>
        <ProfilProvider>
          <LoginSheetProvider>
            <AppShell>{children}</AppShell>
          </LoginSheetProvider>
        </ProfilProvider>
      </AuthProvider>
    </ConfirmProvider>
  );
}
