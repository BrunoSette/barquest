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

  const barristerPlan = products.find(
    (product) => product.name === "BarQuest - Barrister"
  );
  const solicitorPlan = products.find(
    (product) => product.name === "BarQuest - Solicitor"
  );
  const fullPlan = products.find(
    (product) => product.name === "BarQuest - Full"
  );

  const barristerPrice = prices.find(
    (price) => price.productId === barristerPlan?.id
  );
  const solicitorPrice = prices.find(
    (price) => price.productId === solicitorPlan?.id
  );
  const fullPrice = prices.find((price) => price.productId === fullPlan?.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap justify-center gap-8">
        <PricingCard
          name={barristerPlan?.name || "Barrister"}
          price={barristerPrice?.unitAmount || 3900}
          interval={barristerPrice?.interval || "month"}
          trialDays={barristerPrice?.trialPeriodDays || 7}
          features={[
            "+1000 Barrister questions with commentary",
            "Unlimited Usage",
            "Real-Time Progress Tracking",
            "Mobile-Friendly Access",
            "Instant Feedback",
            "Regular Content Updates",
            "Risk-Free Trial",
          ]}
          priceId={"price_1Q4XpqIV3yprxmglrYXx5NRz"}
        />
        <PricingCard
          name={solicitorPlan?.name || "Solicitors"}
          price={solicitorPrice?.unitAmount || 3900}
          interval={solicitorPrice?.interval || "month"}
          trialDays={solicitorPrice?.trialPeriodDays || 7}
          features={[
            "+1200 Solicitor questions with commentary",
            "Unlimited Usage",
            "Real-Time Progress Tracking",
            "Mobile-Friendly Access",
            "Instant Feedback",
            "Regular Content Updates",
            "Risk-Free Trial",
          ]}
          priceId={"price_1Q4XpjIV3yprxmgl94R7sW8N"}
        />
        <PricingCard
          name={"Barrister + Solicitor"}
          price={fullPrice?.unitAmount || 6900}
          interval={fullPrice?.interval || "month"}
          trialDays={fullPrice?.trialPeriodDays || 7}
          features={[
            "+2200 Barrister & Solicitor Questions with Commentary",
            "Unlimited Usage",
            "Real-Time Progress Tracking",
            "Mobile-Friendly Access",
            "Instant Feedback",
            "Regular Content Updates",
            "Risk-Free Trial",
          ]}
          priceId={"price_1Q4XpaIV3yprxmglR8ZLWc9r"}
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
