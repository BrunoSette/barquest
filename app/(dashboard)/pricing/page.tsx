import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { getStripePrices, getStripeProducts } from "@/lib/payments/stripe";
import { SubmitButton } from "./submit-button";
import { Products } from "@/lib/utils";
import { getProductsForUser, getUser } from "@/lib/db/queries";
import { UserProduct } from "@/lib/db/schema";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const user = await getUser();
  let userProducts: UserProduct[] = [];

  if (user) {
    userProducts = await getProductsForUser(user.id);
  }

  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const productData = Products.map((product) => {
    const stripeProduct = products.find((p) => p.name === product.name);
    const stripePrice = prices.find(
      (price) => price.productId === stripeProduct?.id
    );

    return {
      ...product,
      stripeProduct,
      stripePrice,
    };
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">
        Choose the Perfect Option for You
      </h1>
      <h2 className="text-2xl text-center mb-8">
        Flexible and risk-free pricing options to your journey as a Barrister or
        Solicitor.
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {productData.map(
          ({
            name,
            stripePrice,
            interval,
            trialDays,
            features,
            stripeProduct,
          }) =>
            stripeProduct &&
            stripePrice && (
              <PricingCard
                key={stripeProduct.id}
                name={name}
                price={stripePrice.unitAmount}
                interval={interval}
                trialDays={trialDays}
                features={features}
                priceId={stripePrice.id}
                isPurchased={userProducts.some(
                  (p) => p.active && p.stripeProductName == name
                )}
              />
            )
        )}
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
    isPurchased,
  }: {
    name: string;
    price: number | null;
    interval: string;
    trialDays: number;
    features: string[];
    isPurchased: boolean;
    priceId?: string;
  }) {
    return (
      <div className="pt-6 flex-1 min-w-[300px] max-w-[400px] flex flex-col items-center">
        <h2 className="text-2xl font-medium text-gray-900 mb-2 text-center">
          {name}
        </h2>
        {/* <p className="text-sm text-gray-600 mb-4 text-center">
          with {trialDays} day free trial
        </p> */}
        <p className="text-4xl font-medium text-gray-900 mb-6 text-center">
          ${(price ?? 0) / 100}{" "}
          {/* <span className="text-xl font-normal text-gray-600">
            / {interval}
          </span> */}
        </p>
        <ul className="space-y-4 mb-8 w-full">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-center">
              <Check className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <form action={checkoutAction} className="w-full flex justify-center">
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton disabled={isPurchased} />
        </form>
      </div>
    );
  }
}
