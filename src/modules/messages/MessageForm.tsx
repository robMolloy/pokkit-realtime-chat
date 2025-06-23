import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { useRef, useState } from "react";

export const MessageForm = (p: {
  onSubmit: (p: { text: string }) => Promise<{ success: boolean }>;
}) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formElementRef = useRef<HTMLFormElement>(null);

  return (
    <form
      className="relative"
      ref={formElementRef}
      onSubmit={async (e) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const resp = await p.onSubmit({ text });

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
  );
};
