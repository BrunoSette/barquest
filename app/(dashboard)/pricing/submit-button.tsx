"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { sendGAEvent } from "@next/third-parties/google";

export function SubmitButton() {
  const { pending } = useFormStatus();

  const handleClick = () => {
    sendGAEvent({ event: "conversion_event_begin_checkout", value: 1 });
  };

  return (
    <Button
      onClick={handleClick}
      type="submit"
      disabled={pending}
      className="w-full bg-white hover:bg-orange-400 hover:text-white text-black border border-gray-200 rounded-full flex text-lg items-center justify-center"
    >
      {pending ? (
        <div className="flex items-center">
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Loading...
        </div>
      ) : (
        <div className="flex items-center">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      )}
    </Button>
  );
}
