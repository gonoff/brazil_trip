"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickExpenseDialog } from "@/components/widgets/quick-expense-dialog";

export function FloatingActionButton() {
  const pathname = usePathname();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Hide FAB on expenses page (has its own add button)
  if (pathname === "/expenses") {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
        size="icon"
        aria-label="Add expense"
      >
        <Plus className="h-7 w-7" />
      </Button>

      <QuickExpenseDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
