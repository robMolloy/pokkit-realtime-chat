import { AiChatScreen } from "@/modules/aiChat/AiChatScreen";
import { useRouter } from "next/router";

export default function () {
  const router = useRouter();
  const threadId = router.query.threadId as string;

  return <AiChatScreen threadId={threadId} />;
}
