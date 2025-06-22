import { TMessageRecord } from "@/modules/messages/dbMessageRecordsUtils";
import { TUser } from "@/modules/users/dbUsersUtils";
import { cn } from "@/lib/utils";

export const ChatMessage = (p: {
  message: TMessageRecord;
  user?: TUser;
  isOwnMessage: boolean;
}) => {
  return (
    <div className={cn("flex w-full", p.isOwnMessage ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          p.isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
        )}
      >
        {!p.isOwnMessage && p.user && (
          <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
            {p.user.name}
          </div>
        )}
        <div className="whitespace-pre-wrap break-words text-sm">{p.message.text}</div>
      </div>
    </div>
  );
};
