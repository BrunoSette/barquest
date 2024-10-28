"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ disabled = false }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  const btnStyle = disabled
    ? "bg-orange-600 text-white"
    : "bg-white hover:bg-orange-400 hover:text-white text-black";

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={`w-full ${btnStyle} border border-gray-200 rounded-full flex text-lg items-center justify-center`}
    >
      {pending ? (
        <div className="flex items-center">
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Loading..
        </div>
      ) : (
        <div className="flex items-center">
          {disabled ? "Purchased!" : "Get Started"}
          {!disabled && <ArrowRight className="ml-2 h-4 w-4" />}
        </div>
      )}
    </Button>
  );
}
