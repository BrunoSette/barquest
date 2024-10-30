import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata = {
  title: "Affiliates - Barquest",
  description:
    "Join our affiliate program and earn commissions by promoting Barquest.",
};

export default function AffiliatesPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col bg-orange-50">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Become a Barquest Affiliate
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>25% Commission</CardTitle>
              <CardDescription>Earn on every sale</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We offer a generous 25% commission on all sales made through
                your unique affiliate link.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Easy to Join</CardTitle>
              <CardDescription>Simple application process</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Becoming an affiliate is quick and easy. Just reach out to us,
                and we&apos;ll get you started.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketing Support</CardTitle>
              <CardDescription>Resources to boost your success</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We provide marketing materials and support to help you maximize
                your earnings.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">
            We&apos;re excited to partner with enthusiastic affiliates who can
            help us spread the word about Barquest. If you&apos;re interested in
            joining our program, please get in touch!
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link
              href="mailto:support@barquest.ca"
              className="inline-flex items-center text-white"
            >
              <Mail className="mr-2 h-4 w-4 text-white" />
              Contact Us to Become an Affiliate
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
