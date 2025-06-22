import { useCurrentUserStore } from "@/modules/auth/authDataStore";
import { MessageScreen } from "@/screens/MessageScreen";

export default function Home() {
  const authStore = useCurrentUserStore();

  if (authStore.data.status === "loggedIn")
    return <MessageScreen userId={authStore.data.user.id} />;

  return <div>Must be logged in</div>;
}
