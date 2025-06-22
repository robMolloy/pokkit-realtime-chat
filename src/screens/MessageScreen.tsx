import { CustomIcon } from "@/components/CustomIcon";
import { MainLayout } from "@/components/layout/Layout";
import { ScrollContainer } from "@/components/ScrollContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { pb } from "@/config/pocketbaseConfig";
import { cn } from "@/lib/utils";
import { createMessageRecord } from "@/modules/messages/dbMessageRecordsUtils";
import { useMessageRecordsStore } from "@/modules/messages/messageRecordsStore";
import { useUsersStore } from "@/modules/users/usersStore";
import { ChatMessage } from "@/components/ChatMessage";

import { useState } from "react";

export const MessageScreen = (p: { userId: string }) => {
  const [text, setText] = useState("");
  const messageRecordsStore = useMessageRecordsStore();
  const usersStore = useUsersStore();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MainLayout fillPageExactly padding={false}>
      <div className="flex h-full flex-col">
        <ScrollContainer className="p-2">
          <div className="flex flex-col gap-1">
            {messageRecordsStore.data.map((message) => {
              const user = usersStore.data.find((u) => u.id === message.userId);
              const isOwnMessage = message.userId === p.userId;

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  user={user}
                  isOwnMessage={isOwnMessage}
                />
              );
            })}
          </div>
        </ScrollContainer>

        <div className="p-2 pt-1">
          <form className="relative">
            <Textarea
              placeholder="Type your message here."
              className="pr-12"
              value={text}
              onInput={(e) => {
                if (isLoading) return;

                const value = (e.target as HTMLTextAreaElement).value;
                setText(value);
              }}
              onKeyUp={async (e) => {
                if (isLoading) return;

                const isSubmitKeyCombo = e.key === "Enter" && e.ctrlKey;
                if (!isSubmitKeyCombo) return;

                setIsLoading(true);
                e.preventDefault();

                const resp = await createMessageRecord({
                  pb,
                  data: { text, userId: p.userId },
                });

                if (resp.success) setText("");

                setIsLoading(false);
              }}
            />
            <Button type="submit" className="absolute bottom-0 right-0 p-2">
              <CustomIcon
                iconName={isLoading ? "Loader" : "Upload"}
                size="sm"
                className={cn(isLoading && "animate-spin")}
              />
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
