import { ChatMessage } from "@/components/ChatMessage";
import { MainLayout } from "@/components/layout/Layout";
import { ScrollContainer } from "@/components/ScrollContainer";
import { pb } from "@/config/pocketbaseConfig";
import {
  createTextMessageRecord,
  TTextMessageRecord,
} from "@/modules/messages/textMessageRecordsDbUtils";
import { useTextMessageRecordsStore } from "@/modules/messages/textMessageRecordsStore";
import { useUsersStore } from "@/modules/users/usersStore";

import { TUser } from "@/modules/users/dbUsersUtils";
import { MessageForm } from "@/modules/messages/components/MessageForm";
import {
  createImageMessageRecord,
  TImageMessageRecord,
} from "@/modules/messages/imageMessageRecordsDbUtils";
import { useImageMessageRecordsStore } from "@/modules/messages/imageMessageRecordsStore";

export const MessageScreen = (p: { userId: string }) => {
  const messageRecordsStore = useTextMessageRecordsStore();
  const imageMessageRecordsStore = useImageMessageRecordsStore();
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

              const imagesOnTextMessagesMap: Record<string, TImageMessageRecord[]> = {};

              imageMessageRecordsStore.data.forEach((imageMessage) => {
                if (!imagesOnTextMessagesMap[imageMessage.textMessageId]) {
                  imagesOnTextMessagesMap[imageMessage.textMessageId] = [];
                }
                imagesOnTextMessagesMap[imageMessage.textMessageId]!.push(imageMessage);
              });

              const textMessagesWithImages: {
                text: TTextMessageRecord;
                images?: TImageMessageRecord[];
              }[] = messageRecordsStore.data.map((textMessage) => {
                return {
                  text: textMessage,
                  images: imagesOnTextMessagesMap[textMessage.id],
                };
              });

              return textMessagesWithImages.map((x) => {
                const user = usersMap[x.text.userId];
                const isOwnMessage = x.text.userId === p.userId;

                return (
                  <div
                    key={x.text.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <ChatMessage
                      user={user}
                      isOwnMessage={isOwnMessage}
                      message={
                        <div>
                          <div>{x.text.text}</div>
                          <div className="flex gap-2">
                            {x.images?.map((image) => (
                              <img
                                className="h-24 w-24"
                                key={image.id}
                                src={`${pb.files.getURL(image, image.image, { thumb: "100x100" })}`}
                              />
                            ))}
                          </div>
                        </div>
                      }
                    />
                  </div>
                );
              });
            })()}
          </div>
        </ScrollContainer>
        <div className="mx-auto w-full max-w-[600px] px-4 py-2">
          <MessageForm
            onSubmit={async (x) => {
              const resp = await createTextMessageRecord({
                pb,
                data: { text: x.text, userId: p.userId },
              });

              if (!resp.success) return { success: false };

              const imagePromises = x.images.map((image) =>
                createImageMessageRecord({
                  pb,
                  data: { image, userId: p.userId, textMessageId: resp.data.id },
                }),
              );

              await Promise.all(imagePromises);

              return { success: true };
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};
