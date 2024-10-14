import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { getStripePrices, getStripeProducts } from "@/lib/payments/stripe";
import { SubmitButton } from "./submit-button";
import { getQuestionCountsBySubject } from "@/lib/db/queries";
import { barristerSubjects, solicitorSubjects } from "@/lib/utils";

const subjectCounts = await getQuestionCountsBySubject();
console.log("subjectCounts", subjectCounts);
const totalQuestions = subjectCounts.reduce(
  (acc, curr) => acc + curr.questions,
  0
);

const barristerQuestions = subjectCounts
  .filter((subject) => barristerSubjects.includes(subject.name))
  .reduce((acc, curr) => acc + curr.questions, 0);

const solicitorQuestions = subjectCounts
  .filter((subject) => solicitorSubjects.includes(subject.name))
  .reduce((acc, curr) => acc + curr.questions, 0);

let Products = [
  {
    id: "1",
    name: "BarQuest Barrister",
    description: "Barrister Test",
    price: 14700,
    interval: "3 months",
    trialDays: 7,
    features: [
      `${barristerQuestions} Questions with Commentary`,
      "Unlimited Usage",
      "Real-Time Progress Tracking",
      "Mobile-Friendly Access",
      "Instant Feedback",
      "Regular Content Updates",
      "7 Days Risk-Free Trial",
    ],
  },
  {
    id: "2",
    name: "BarQuest Solicitor",
    description: "Solicitor Test",
    price: 14700,
    interval: "3 months",
    trialDays: 7,
    features: [
      `${solicitorQuestions} Questions with Commentary`,
      "Unlimited Usage",
      "Real-Time Progress Tracking",
      "Mobile-Friendly Access",
      "Instant Feedback",
      "Regular Content Updates",
      "7 Days Risk-Free Trial",
    ],
  },
  {
    id: "3",
    name: "BarQuest Full",
    description: "Full Test",
    price: 24700,
    interval: "3 months",
    trialDays: 7,
    features: [
      `${totalQuestions} Questions with Commentary`,
      "Unlimited Usage",
      "Real-Time Progress Tracking",
      "Mobile-Friendly Access",
      "Instant Feedback",
      "Regular Content Updates",
      "7 Days Risk-Free Trial",
    ],
  },
];
// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
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
}
