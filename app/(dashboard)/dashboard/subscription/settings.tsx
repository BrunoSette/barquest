import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { customerPortalAction } from "@/lib/payments/actions";
import { UserProduct } from "@/lib/db/schema";
import { mergeProductNames } from "@/lib/utils";

export function Settings({
  userProducts,
  // teamData
}: {
  userProducts: UserProduct[];
  // teamData: TeamDataWithMembers;
}) {
  const planName = mergeProductNames(userProducts);


  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Subscription</h1>
      <Card className="mb-8">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium">
                  Current Plan: {planName}
                </p>
                {/* <p className="text-sm text-muted-foreground">
                  {teamData.subscriptionStatus === "active"
                    ? "Billed monthly"
                    : teamData.subscriptionStatus === "trialing"
                    ? "Trial period"
                    : "No active subscription"}
                </p> */}
              </div>
              <form action={customerPortalAction}>
                <Button type="submit" variant="outline">
                  Manage Subscription
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
