"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const UnsubscribeDialog = ({
  email,
  message,
}: {
  email: string;
  message: string;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsubscribe from emails</DialogTitle>
          <DialogDescription>
            {message ||
              `Are you sure you want to unsubscribe ${email} from BarQuest emails?`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Go to Homepage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnsubscribeDialog;
