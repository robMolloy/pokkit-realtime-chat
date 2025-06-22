import { MainLayout } from "@/components/layout/Layout";
import { ScrollContainer } from "@/components/ScrollContainer";

export default function Home() {
  return (
    <MainLayout fillPageExactly padding={false}>
      <div className="flex h-full flex-col">
        <ScrollContainer>
          <div>asd</div>
          <div>asd</div>
          {/* <div className="p-4 pb-0">
            <AssistantMessage>Hello! How can I help you today?</AssistantMessage>

            <DisplayChatMessages messages={messages} />

            {mode === "thinking" && <p>Thinking...</p>}
            {mode === "streaming" && <AssistantMessage>{streamedResponse}</AssistantMessage>}
            {mode === "error" && <ErrorMessage />}
          </div> */}
        </ScrollContainer>

        <div className="p-4 pt-1">
          {/* {anthropicInstance ? (
            <AiChatForm
              anthropic={anthropicInstance}
              messages={messages}
              onSubmitMessage={async () => {
                const resp = await createAiThreadRecord({
                  pb,
                  data: {
                    collectionId: "aiThreads",
                    collectionName: "aiThreads",
                    id: uuid(),
                    threadId,
                    title: "New Thread",
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
          )} */}
        </div>
      </div>
    </MainLayout>
  );
}
