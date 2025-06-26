import Link from "next/link";
import { CustomIcon } from "../CustomIcon";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { LeftSidebar } from "./LeftSidebar";
import { DialogTitle, DialogDescription } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function Header(p: { isLoggedIn: boolean; showLeftSidebar: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 flex-1 items-center justify-between px-2 md:px-6">
        <div className="flex items-center gap-2">
          {p.showLeftSidebar && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
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
          )}

          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <CustomIcon iconName="Cloud" size="lg" />
            <span className="font-bold">Pokkit Realtime Chat</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-2">
          {p.isLoggedIn && <Link href="/log">Log</Link>}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
