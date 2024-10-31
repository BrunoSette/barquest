import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => (
  <section className="py-16 bg-orange-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
        <div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Ace the Ontario Bar Exam?
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-orange-100">
            Our platform gives you everything you need to fully prepare with
            confidence. Stop stressing over outdated materials—focus on
            mastering the content that matters most.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
          <Link href="/#pricing">
            <Button className="bg-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-400 text-orange-500 hover:text-white rounded-full text-xl px-12 py-6 inline-flex items-center justify-center transition duration-500 ease-in-out transform hover:scale-110 hover:shadow-lg">
              Get Access Now
              <ArrowRight className="ml-3 h-6 w-6 text-orange-500 transition-transform duration-500 ease-in-out transform hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CTA;
