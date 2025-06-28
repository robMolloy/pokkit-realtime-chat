import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCurrentUserStore } from "@/modules/auth/authDataStore";
import { Menu } from "lucide-react";
import { Modal } from "../Modal";
import { Header } from "./Header";
import { LeftSidebar } from "./LeftSidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React from "react";
import { DialogDescription, DialogTitle } from "../ui/dialog";

export const MainLayout = (p: {
  children: React.ReactNode;
  padding?: boolean;
  fillPageExactly?: boolean;
}) => {
  const padding = p.padding ?? true;
  return (
    <div className={`${p.fillPageExactly ? "h-full" : "min-h-full"} ${padding ? "p-6" : ""}`}>
      {p.children}
    </div>
  );
};

export function Layout(p: { children: React.ReactNode; showLeftSidebar: boolean }) {
  const currentUserStore = useCurrentUserStore();

  return (
    <div className="relative flex h-screen flex-col">
      <Header
        isLoggedIn={currentUserStore.data.status === "loggedIn"}
        leftComponent={
          p.showLeftSidebar && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-64 flex-col p-0">
                <div className="p-3">
                  <DialogTitle>Menu</DialogTitle>
                  <VisuallyHidden>
                    <DialogDescription className="sr-only">
                      Navigation menu for the application
                    </DialogDescription>
                  </VisuallyHidden>
                </div>

                <LeftSidebar />
              </SheetContent>
            </Sheet>
          )
        }
      />
      <div className="flex flex-1">
        {p.showLeftSidebar && (
          <aside className="hidden w-64 overflow-y-auto border-r bg-background md:flex">
            <LeftSidebar />
          </aside>
        )}
        <main className="w-full overflow-y-auto">{p.children}</main>
      </div>
      <Modal />
    </div>
  );
}
