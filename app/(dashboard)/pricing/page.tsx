import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { getStripePrices, getStripeProducts } from "@/lib/payments/stripe";
import { SubmitButton } from "./submit-button";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const testPlan = products.find((product) => product.name === "Test");

  const testPrice = prices.find((price) => price.productId === testPlan?.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap justify-center gap-8">
        <PricingCard
          name={testPlan?.name || "TEST"}
          price={testPrice?.unitAmount || 3900}
          interval={testPrice?.interval || "month"}
          trialDays={testPrice?.trialPeriodDays || 7}
          features={[
            "+1000 Barrister questions with commentary",
            "Unlimited Usage",
            "Real-Time Progress Tracking",
            "Mobile-Friendly Access",
            "Instant Feedback",
            "Regular Content Updates",
            "Risk-Free Trial",
          ]}
          priceId={testPrice?.id}
        />
      </div>
    </main>
  );

  function PricingCard({
    name,
    price,
    interval,
    trialDays,
    features,
    priceId,
  }: {
    name: string;
    price: number;
    interval: string;
    trialDays: number;
    features: string[];
    priceId?: string;
  }) {
    return (
      <div className="pt-6 flex-1 min-w-[300px] max-w-[400px]">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
        <p className="text-sm text-gray-600 mb-4">
          with {trialDays} day free trial
        </p>
        <p className="text-4xl font-medium text-gray-900 mb-6">
          ${price / 100}{" "}
          <span className="text-xl font-normal text-gray-600">
            / {interval}
          </span>
        </p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <form action={checkoutAction}>
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton />
        </form>
      </div>
    );
  }
}
