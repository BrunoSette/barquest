"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";

export function SubmitButton() {
  const { pending } = useFormStatus();

  const handleClick = () => {
    console.log("handleClick gtm e ga begin_checkout")
    // sendGTMEvent({ event: "event", value: "begin_checkout" });
    sendGAEvent('event', 'begin_checkout', { value: 'begin_checkout' });
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
