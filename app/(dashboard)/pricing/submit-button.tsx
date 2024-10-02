"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { sendGAEvent } from "@next/third-parties/google";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      onClick={() =>
        sendGAEvent("event", "buttonClicked", {
          value: "Start My 7 Days Free Trial",
        })
      }
      type="submit"
      disabled={pending}
      className="w-full bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full flex text-lg items-center justify-center"
    >
      {pending ? (
        <div className="flex items-center">
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Loading...
        </div>
      ) : (
        <div className="flex items-center">
          Start My 7 Days Free Trial
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      )}
    </Button>
  );
}
