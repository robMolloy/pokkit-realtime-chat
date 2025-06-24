import { cn } from "@/lib/utils";
import { TUser } from "@/modules/users/dbUsersUtils";

export const ChatMessage = (p: {
  message: React.ReactNode;
  user?: TUser;
  isOwnMessage: boolean;
}) => {
  return (
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
      <div className="whitespace-pre-wrap break-words text-sm">{p.message}</div>
    </div>
  );
};
