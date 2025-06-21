import { MainLayout } from "@/components/layout/Layout";
import { pb } from "@/config/pocketbaseConfig";
import { AiChatForm } from "@/modules/aiChat/components/AiChatForm";
import {
  AssistantMessage,
  DisplayChatMessages,
  ErrorMessage,
} from "@/modules/aiChat/components/Messages";
import { ScrollContainer } from "@/modules/aiChat/components/ScrollContainer";
import { createAiMessageRecord } from "@/modules/aiMessages/dbAiMessageUtils";
import { useAiThreadRecordsStore } from "@/modules/aiThreads/aiThreadRecordsStore";
import { createAiThreadRecord } from "@/modules/aiThreads/dbAiThreadRecordUtils";
import { TAnthropicMessage } from "@/modules/providers/anthropicApi";
import { useAnthropicStore } from "@/modules/providers/anthropicStore";
import { ErrorScreen } from "@/screens/ErrorScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useState } from "react";

export const AiChatScreen = (p: { threadId: string }) => {
  const threadId = p.threadId;

  const aiThreadRecordsStore = useAiThreadRecordsStore();

  const anthropicStore = useAnthropicStore();
  const anthropicInstance = anthropicStore.data;
  const [mode, setMode] = useState<"ready" | "thinking" | "streaming" | "error">("ready");
  const [messages, setMessages] = useState<TAnthropicMessage[]>([]);
  const [streamedResponse, setStreamedResponse] = useState("");

  if (aiThreadRecordsStore.data === undefined) return <LoadingScreen />;
  if (aiThreadRecordsStore.data === null) return <ErrorScreen />;

  return (
    <MainLayout fillPageExactly padding={false}>
      <div className="flex h-full flex-col">
        <ScrollContainer>
          <div className="p-4 pb-0">
            <div>{threadId}</div>
            <AssistantMessage>Hello! How can I help you today?</AssistantMessage>

            <DisplayChatMessages messages={messages} />

            {mode === "thinking" && <p>Thinking...</p>}
            {mode === "streaming" && <AssistantMessage>{streamedResponse}</AssistantMessage>}
            {mode === "error" && <ErrorMessage />}
          </div>
        </ScrollContainer>

        <div className="p-4 pt-1">
          {anthropicInstance ? (
            <AiChatForm
              anthropic={anthropicInstance}
              messages={messages}
              onSubmitMessage={async () => {
                if (messages.length === 0)
                  await createAiThreadRecord({ pb, data: { threadId, title: "" } });

                await createAiMessageRecord({
                  pb,
                  data: {
                    threadId,
                    role: "user",
                    contentType: "text",
                    contentText: "",
                    contentSourceType: "",
                    contentSourceData: "",
                    contentSourceMediaType: "",
                  },
                });
              }}
              onModeChange={setMode}
              onUpdatedMessages={setMessages}
              onStream={(text) => setStreamedResponse(text)}
              onComplete={(messages) => {
                setMessages(messages);
                setStreamedResponse("");
              }}
            />
          ) : (
            <div>No AI instance</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
