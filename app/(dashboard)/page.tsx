import { Button } from "@/components/ui/button";
import { ArrowRight, FileQuestion, Database, ChartArea } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CTA from "@/components/cta";
import AnalyticsImage from "../public/dashboard.png";
import QuestionsImage from "../public/test.gif";
import IphoneMockup from "../public/phone.jpg";
import { YouTubeEmbed } from "@next/third-parties/google";
import Footer from "@/components/footer";
import Testimonials from "@/components/testimonials";
import dynamic from "next/dynamic";
const PricingComponent = dynamic(
  () => import("@/app/(dashboard)/pricing/page"),
  { ssr: true }
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-5xl font-bold text-gray-900 tracking-tight md:text-6xl">
                  Your Ultimate Prep Tool for the
                  <span className="block text-orange-500">
                    Ontario Bar Exam
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Practice smarter with tailored questions and instant feedback
                  designed to boost your confidence and exam success.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <Link href="#pricing">
                    <Button className="bg-orange-500 hover:bg-orange-800 text-white rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="rounded-lg overflow-hidden h-80 w-full">
                  <YouTubeEmbed
                    videoid="HZJjA1J4C1g"
                    height={315}
                    params="controls=0&rel=0&modestbranding=1&fs=1&showinfo=0"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Keep the Key Features Section with Icons */}
        <section id="features" className="py-16 bg-white w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {[
                {
                  icon: FileQuestion,
                  title: "Tailored Question Bank",
                  description:
                    "A comprehensive, expertly curated question bank tailored to the Ontario Bar Exam, ensuring you get relevant and up-to-date practice for maximum success.",
                },
                {
                  icon: Database,
                  title: "Real-Time Analytics",
                  description:
                    "Track your progress with detailed analytics and real-time feedback, helping you focus on areas that need improvement and enhance your study efficiency.",
                },
                {
                  icon: ChartArea,
                  title: "Expert-Led Explanations",
                  description:
                    "Benefit from detailed explanations written by legal experts, helping you understand complex topics and improve your legal reasoning skills.",
                },
              ].map((feature, index) => (
                <div key={index} className="mt-10 lg:mt-0 text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mx-auto">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Updated section with benefits */}
        <section className="py-16 bg-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Comprehensive Question Bank
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Gain access to an expertly curated question bank for the
                  Ontario Bar Exam. With tailored questions, you’ll ensure
                  you&apos;re practicing exactly what you need to know.
                </p>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Focus your efforts on the most relevant topics, and track your
                  progress in real-time with detailed analytics.
                </p>
              </div>
              <div
                className="mt-10 -mx-4 relative lg:mt-0 border-2 border-orange-500"
                aria-hidden="true"
              >
                <Image
                  className="relative mx-auto rounded-lg object-contain h-full w-full"
                  src={QuestionsImage}
                  alt="Study materials screenshot"
                  width={1200}
                  height={800}
                  quality={100}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Updated section with benefits */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div
                className="mt-10 -mx-4 relative lg:mt-0 lg:h-80"
                aria-hidden="true"
              >
                <Image
                  className="relative mx-auto rounded-lg object-contain h-full w-full"
                  src={AnalyticsImage}
                  alt="Performance analytics dashboard"
                  width={1187}
                  height={645}
                  quality={100}
                />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Real-Time Performance Analytics
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Track your progress as you go with our real-time analytics
                  feature. This benefit helps you identify your strengths and
                  weaknesses across various topics and question types, so you
                  can tailor your study strategy effectively.
                </p>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Get personalized insights and recommendations based on your
                  performance, ensuring you focus on areas that matter the most.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Updated section with benefits */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Flexible and Accessible Anywhere
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  BarQuest is designed for maximum flexibility. Study at your
                  own pace, whether on your laptop, tablet, or mobile
                  device—anywhere, anytime.
                </p>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Our mobile-friendly platform ensures that you can squeeze in
                  practice sessions even on the go, with the same comprehensive
                  features across all devices.
                </p>
              </div>
              <div
                className="mt-10 -mx-4 relative lg:mt-0 lg:h-80"
                aria-hidden="true"
              >
                <Image
                  className="relative mx-auto rounded-lg object-contain h-full w-full"
                  src={IphoneMockup}
                  alt="BarQuest on mobile devices"
                  width={956}
                  height={660}
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 bg-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 bg-orange-50">
              {[
                {
                  question: "How up-to-date is your question bank?",
                  answer:
                    "Our question bank is regularly updated to reflect the latest changes in Ontario Bar Exam content and format.",
                },
                {
                  question: "Can I access BarPrep on mobile devices?",
                  answer:
                    "Yes, our platform is fully responsive and can be accessed on smartphones and tablets.",
                },
                {
                  question: "How does the real-time analytics feature work?",
                  answer:
                    "Our system tracks your performance across different topics and question types, providing detailed insights to help you improve.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, including Visa, MasterCard, American Express, and Discover. Payments are processed securely through Stripe.",
                },
                {
                  question:
                    "Can I take unlimited quizzes with my BarQuest purchase?",
                  answer:
                    "Absolutely! With your one-time BarQuest purchase, you have access to create and take as many quizzes as you want for a full 90 days. This unlimited access lets you thoroughly prepare and revisit questions to ensure you're exam-ready.",
                },
                {
                  question: "How many questions are included with BarQuest?",
                  answer:
                    "BarQuest offers three comprehensive packages: Barrister (+500 questions), Solicitor (+600 questions), and Full (+1,000 questions). Each package includes detailed commentary and covers all relevant exam topics.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <section id="testimonials">
          <Testimonials />
        </section> */}

        <section id="pricing">
          <PricingComponent />
        </section>

        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
