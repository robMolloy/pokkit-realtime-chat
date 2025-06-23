import { ChatMessage } from "@/components/ChatMessage";
import { MainLayout } from "@/components/layout/Layout";
import { ScrollContainer } from "@/components/ScrollContainer";
import { pb } from "@/config/pocketbaseConfig";
import { createTextMessageRecord } from "@/modules/messages/textMessageRecordsDbUtils";
import { useTextMessageRecordsStore } from "@/modules/messages/textMessageRecordsStore";
import { useUsersStore } from "@/modules/users/usersStore";

import { TUser } from "@/modules/users/dbUsersUtils";
import { MessageForm } from "@/modules/messages/components/MessageForm";

export const MessageScreen = (p: { userId: string }) => {
  const messageRecordsStore = useTextMessageRecordsStore();
  const usersStore = useUsersStore();

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
          <MessageForm
            onSubmit={async (x) => {
              return createTextMessageRecord({ pb, data: { text: x.text, userId: p.userId } });
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};
