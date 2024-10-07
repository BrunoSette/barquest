import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { customerPortalAction } from "@/lib/payments/actions";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Package, CheckCircle } from "lucide-react";

interface PricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionStatus: string;
  planName: string;
}

export function PricingDialog({
  isOpen,
  onClose,
  subscriptionStatus,
  planName,
}: PricingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            You need an active plan to create tests
          </DialogTitle>
          <DialogDescription className="text-center text-lg mt-2">
            Sign up for a plan to create unlimited tests and access advanced
            features!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-secondary p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-xl">Current Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    {subscriptionStatus === "active"
                      ? "Billed monthly"
                      : subscriptionStatus === "trialing"
                      ? "Trial period"
                      : "No active subscription"}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  subscriptionStatus === "active" ? "default" : "secondary"
                }
                className="text-lg py-1 px-3"
              >
                {planName || "Free"}
              </Badge>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Create a plan and get:</h4>
              <ul className="space-y-2">
                {[
                  "Unlimited test creation",
                  "Advanced analytics",
                  "Graphs and charts",
                  "Customizable test settings",
                ].map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <form action={customerPortalAction}>
              <Button
                type="submit"
                variant="outline"
                className="w-full h-14 text-lg font-semibold"
              >
                <CreditCard className="mr-2 h-5 w-5" /> Manage My Subscription
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
