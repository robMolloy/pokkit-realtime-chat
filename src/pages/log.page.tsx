import { useUsersStore } from "@/modules/users/usersStore";
import { useCurrentUserStore, useUnverifiedIsLoggedInStore } from "@/modules/auth/authDataStore";
import { useImageMessageRecordsStore } from "@/modules/messages/imageMessageRecordsStore";
import { useTextMessageRecordsStore } from "@/modules/messages/textMessageRecordsStore";

const LogPage = () => {
  const usersStore = useUsersStore();
  const currentUserStore = useCurrentUserStore();
  const unverifiedIsLoggedInStore = useUnverifiedIsLoggedInStore();
  const textMessageRecordsStore = useTextMessageRecordsStore();
  const imageMessageRecordsStore = useImageMessageRecordsStore();

  return (
    <div>
      <pre>
        {JSON.stringify(
          {
            usersStore,
            currentUserStore,
            unverifiedIsLoggedInStore,
            textMessageRecordsStore,
            imageMessageRecordsStore,
          },
          undefined,
          2,
        )}
      </pre>
    </div>
  );
};

export default LogPage;
