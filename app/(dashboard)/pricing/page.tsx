import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { getStripePrices, getStripeProducts } from "@/lib/payments/stripe";
import { SubmitButton } from "./submit-button";
import { Products } from "@/lib/utils";

// Prices are fresh for one hour max
export const revalidate = 3600;

export async function PricingComponent() {
  console.log("Starting PricingComponent...");
  try {
    console.log("Fetching prices and products...");
    const [prices, products] = await Promise.all([
      getStripePrices(),
      getStripeProducts(),
    ]);
    console.log("Fetched prices:", JSON.stringify(prices, null, 2));
    console.log("Fetched products:", JSON.stringify(products, null, 2));

    if (prices.length === 0 || products.length === 0) {
      console.warn("No prices or products fetched from Stripe");
      return <div>No pricing information available at the moment. Please try again later.</div>;
    }

    const productData = Products.map((product) => {
      const stripeProduct = products.find((p) => p.name.toLowerCase().includes(product.name.toLowerCase()));
      const stripePrice = prices.find(
        (price) => price.productId === stripeProduct?.id
      );

      console.log(`Mapping product: ${product.name}`);
      console.log("Stripe product:", JSON.stringify(stripeProduct, null, 2));
      console.log("Stripe price:", JSON.stringify(stripePrice, null, 2));

      if (!stripeProduct) {
        console.warn(`No matching Stripe product found for: ${product.name}`);
      }
      if (!stripePrice) {
        console.warn(`No matching Stripe price found for product: ${product.name}`);
      }

      return {
        ...product,
        stripeProduct,
        stripePrice,
      };
    });
    console.log("Mapped productData:", JSON.stringify(productData, null, 2));

    const validProducts = productData.filter(product => product.stripeProduct && product.stripePrice);
    console.log("Valid products:", JSON.stringify(validProducts, null, 2));

    if (validProducts.length === 0) {
      console.warn("No matching Stripe products or prices found");
      return <div>Unable to load pricing information. Please try again later.</div>;
    }

    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-4">
          Choose the Perfect Plan for You
        </h1>
        <h2 className="text-2xl text-center mb-8">
          Flexible, comprehensive, and risk-free pricing options to your journey
          as a Barrister or Solicitor.
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
    }: {
      name: string;
      price: number | null;
      interval: string;
      trialDays: number;
      features: string[];
      priceId?: string;
    }) {
      return (
        <div className="pt-6 flex-1 min-w-[300px] max-w-[400px] flex flex-col items-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-2 text-center">
            {name}
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            with {trialDays} day free trial
          </p>
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
            <SubmitButton />
          </form>
        </div>
      );
    }
  } catch (error) {
    console.error("Error in PricingComponent:", error);
    return <div>Error loading pricing information. Please try again later.</div>;
  }
}

export default PricingComponent;
