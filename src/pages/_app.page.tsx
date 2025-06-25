import { Layout } from "@/components/layout/Layout";
import { pb } from "@/config/pocketbaseConfig";
import { useCurrentUserStore } from "@/modules/auth/authDataStore";
import { AuthForm } from "@/modules/auth/AuthForm";
import { useAuth } from "@/modules/auth/useAuth";
import { smartSubscribeToImageMessageRecords } from "@/modules/messages/imageMessageRecordsDbUtils";
import { useImageMessageRecordsStore } from "@/modules/messages/imageMessageRecordsStore";
import { smartSubscribeToTextMessageRecords } from "@/modules/messages/textMessageRecordsDbUtils";
import { useTextMessageRecordsStore } from "@/modules/messages/textMessageRecordsStore";
import { smartSubscribeToUsers } from "@/modules/users/dbUsersUtils";
import { useUsersStore } from "@/modules/users/usersStore";
import { AwaitingApprovalScreen } from "@/screens/AwaitingApprovalScreen";
import { BlockedScreen } from "@/screens/BlockedScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { RequestVerificationScreen } from "@/screens/RequestVerificationScreen";
import { useThemeStore } from "@/stores/themeStore";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const themeStore = useThemeStore();
  const usersStore = useUsersStore();
  const currentUserStore = useCurrentUserStore();
  const messageRecordsStore = useTextMessageRecordsStore();
  const imageMessageRecordsStore = useImageMessageRecordsStore();

  themeStore.useThemeStoreSideEffect();

  useAuth({
    onIsLoading: () => {},
    onIsLoggedIn: () => {
      smartSubscribeToUsers({ pb, onChange: (x) => usersStore.setData(x) });
      smartSubscribeToTextMessageRecords({ pb, onChange: (x) => messageRecordsStore.setData(x) });
      smartSubscribeToImageMessageRecords({
        pb,
        onChange: (x) => imageMessageRecordsStore.setData(x),
      });
    },
    onIsLoggedOut: () => {},
  });

  return (
    <>
      <Layout showLeftSidebar={currentUserStore.data.status === "loggedIn"}>
        <Toaster />
        {(() => {
          if (currentUserStore.data.status === "loading") return <LoadingScreen />;

          if (currentUserStore.data.status === "loggedOut")
            return (
              <div className="mt-16 flex justify-center">
                <AuthForm />
              </div>
            );

          // should not be required
          if (currentUserStore.data.status !== "loggedIn") {
            console.error(`this line should never be hit`);
            return;
          }
          if (currentUserStore.data.user.verified === false) {
            return <RequestVerificationScreen pb={pb} email={currentUserStore.data.user.email} />;
          }

          if (currentUserStore.data.user.status === "pending") return <AwaitingApprovalScreen />;

          if (currentUserStore.data.user.status === "denied") return <BlockedScreen />;

          return <Component {...pageProps} />;
        })()}
      </Layout>
    </>
  );
}
