import { pb } from "@/config/pocketbaseConfig";
import { subscribeToUser } from "../users/dbUsersUtils";
import { useEffect } from "react";
import { useCurrentUserStore, useUnverifiedIsLoggedInStore } from "@/modules/auth/authDataStore";
import { useUnverifiedIsLoggedInSync } from "@/modules/auth/authDataStore";

export const useAuth = (p: {
  onIsLoading: () => void;
  onIsLoggedIn: () => void;
  onIsLoggedOut: () => void;
}) => {
  const unverifiedIsLoggedInStore = useUnverifiedIsLoggedInStore();

  const currentUserStore = useCurrentUserStore();

  useUnverifiedIsLoggedInSync({ pb });

  useEffect(() => {
    // use anfn as return value is not cleanup
    (() => {
      if (unverifiedIsLoggedInStore.data.status === "loggedOut")
        return currentUserStore.setData({ status: "loggedOut" });

      if (unverifiedIsLoggedInStore.data.status === "loading")
        return currentUserStore.setData({ status: "loading" });

      if (unverifiedIsLoggedInStore.data.status !== "loggedIn")
        return console.error("should never be hit");

      return subscribeToUser({
        pb,
        id: unverifiedIsLoggedInStore.data.auth.record.id,
        onChange: (user) => {
          if (user) currentUserStore.setData({ status: "loggedIn", user });
          else currentUserStore.setData({ status: "loggedOut" });
        },
      });
    })();
  }, [unverifiedIsLoggedInStore.data]);

  useEffect(() => {
    if (currentUserStore.data.status === "loading") return p.onIsLoading();
    if (currentUserStore.data.status === "loggedIn") return p.onIsLoggedIn();
    if (currentUserStore.data.status === "loggedOut") return p.onIsLoggedOut();

    console.error("should never be hit");
  }, [currentUserStore.data]);

  return currentUserStore.data;
};
