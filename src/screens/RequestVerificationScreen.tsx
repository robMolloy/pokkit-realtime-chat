import { Button } from "@/components/ui/button";
import PocketBase from "pocketbase";

export const RequestVerificationScreen = (p: { pb: PocketBase; email: string }) => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="text-sm text-muted-foreground">
        <div>awaiting verification</div>
        <div>You may need to check your junk folder</div>
        <div>
          It can take up some time to receive the email but if you haven't received it after a short
          time, please resend the email by clicking the button below
        </div>
        <Button onClick={() => p.pb.collection("users").requestVerification(p.email)}>
          Resend verification email
        </Button>
      </div>
    </div>
  );
};
