import { CustomIcon } from "@/components/CustomIcon";
import { MainLayout } from "@/components/layout/Layout";
import { ScrollContainer } from "@/components/ScrollContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { pb } from "@/config/pocketbaseConfig";
import { cn } from "@/lib/utils";
import { createMessageRecord } from "@/modules/messages/dbMessageRecordsUtils";
import { useMessageRecordsStore } from "@/modules/messages/messageRecordsStore";

import { useState } from "react";

export const MessageScreen = (p: { userId: string }) => {
  const [text, setText] = useState("");
  const messageRecordsStore = useMessageRecordsStore();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MainLayout fillPageExactly padding={false}>
      <div className="flex h-full flex-col">
        <ScrollContainer>
          <pre>{JSON.stringify(messageRecordsStore.data, undefined, 2)}</pre>
          <div>asd</div>
          <div>asd</div>
        </ScrollContainer>

        <div className="p-4 pt-1">
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
