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

import { useRef, useState } from "react";
import { TUser } from "@/modules/users/dbUsersUtils";

export const MessageScreen = (p: { userId: string }) => {
  const [text, setText] = useState("");
  const messageRecordsStore = useMessageRecordsStore();
  const usersStore = useUsersStore();
  const [isLoading, setIsLoading] = useState(false);

  const formElementRef = useRef<HTMLFormElement>(null);

  return (
    <MainLayout fillPageExactly padding={false}>
      <div className="flex h-full flex-col">
        <ScrollContainer className="py-2">
          <div className="mx-auto flex w-full max-w-[600px] flex-col gap-1 px-4">
            {messageRecordsStore.data.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No messages yet.</p>
              </div>
            )}
            {(() => {
              const usersMap: Record<string, TUser> = {};
              usersStore.data.forEach((user) => (usersMap[user.id] = user));

              return messageRecordsStore.data.map((message) => {
                const user = usersMap[message.userId];
                const isOwnMessage = message.userId === p.userId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <ChatMessage message={message} user={user} isOwnMessage={isOwnMessage} />
                  </div>
                );
              });
            })()}
          </div>
        </ScrollContainer>

        <div className="mx-auto w-full max-w-[600px] px-4 py-2">
          <form
            className="relative"
            ref={formElementRef}
            onSubmit={async (e) => {
              e.preventDefault();

              if (isLoading) return;
              setIsLoading(true);

              const resp = await createMessageRecord({
                pb,
                data: { text, userId: p.userId },
              });

              if (resp.success) setText("");

              setIsLoading(false);
            }}
          >
            <Textarea
              placeholder="Type your message here."
              value={text}
              onInput={(e) => {
                if (isLoading) return;

                const value = (e.target as HTMLTextAreaElement).value;
                setText(value);
              }}
              onKeyDown={async (e) => {
                const isSubmitKeyCombo = e.key === "Enter" && (e.ctrlKey || e.metaKey);
                if (isSubmitKeyCombo) formElementRef.current?.requestSubmit();
              }}
            />
            <Button type="submit" className="absolute bottom-0 right-0 p-2">
              <CustomIcon
                size="sm"
                iconName={isLoading ? "Loader" : "Upload"}
                className={cn(isLoading && "animate-spin")}
              />
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
