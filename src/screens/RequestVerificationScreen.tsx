import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import PocketBase from "pocketbase";

export const RequestVerificationScreen = (p: { pb: PocketBase; email: string }) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 pt-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <CustomIcon iconName="Mail" size="4xl" />
        </div>

        <div className="space-y-4 text-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Check your email</h2>
            <p className="mt-2 text-muted-foreground">
              We've sent a verification link to your email address
            </p>
          </div>

          <div className="space-y-2 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Didn't receive the email?</p>
            <ul className="space-y-1 text-left">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure the email address is correct</li>
              <li>• It may take a few minutes to arrive</li>
            </ul>
          </div>

          <Button
            onClick={() => p.pb.collection("users").requestVerification(p.email)}
            variant="outline"
            className="w-full"
          >
            Resend verification email
          </Button>
        </div>
      </div>
    </div>
  );
};
