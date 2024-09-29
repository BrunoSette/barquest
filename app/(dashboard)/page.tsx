import { Button } from "@/components/ui/button";
import PricingPage from "@/app/(dashboard)/pricing/page";
import {
  ArrowRight,
  FileQuestion,
  Database,
  ChartArea,
  Menu,
} from "lucide-react";
import Image from "next/image";
import pic from "../public/imagem2.png";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
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
                  <Link href="/sign-up">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                      Create my first test now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <Image
                  src={pic}
                  alt="Student preparing for Ontario Bar Exam"
                  layout="responsive"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 bg-white w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Features
            </h2>
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
                <div key={index} className="mt-10 lg:mt-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
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

        <section id="testimonials" className="py-16 bg-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {[
                {
                  name: "Sarah L.",
                  quote:
                    "BarPrep helped me pass the Ontario Bar Exam on my first try. The practice questions were spot-on!",
                },
                {
                  name: "Michael T.",
                  quote:
                    "The analytics feature was a game-changer. It helped me focus on my weak areas and improve rapidly.",
                },
                {
                  name: "Emily R.",
                  quote:
                    "Expert explanations made complex legal concepts much easier to understand. Highly recommended!",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-600 italic mb-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
                  question: "Do you offer a money-back guarantee?",
                  answer:
                    "We offer a 30-day money-back guarantee if you're not satisfied with our service.",
                },
                {
                  question: "How does the real-time analytics feature work?",
                  answer:
                    "Our system tracks your performance across different topics and question types, providing detailed insights to help you improve.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Ready to Ace the Ontario Bar Exam?
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-orange-100">
                  Our platform gives you everything you need to fully prepare
                  and pass with confidence. Stop stressing over outdated
                  materials—focus on mastering the content that matters most.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
                <Link href="/sign-up">
                  <Button className="bg-white hover:bg-gray-100 text-orange-500 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
                    Start Your Free Account Today
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section>
          <PricingPage />
        </section>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-300 hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-gray-300 hover:text-white"
                  >
                    Study Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-300 hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Connect
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-base text-gray-400">
              &copy; 2023 BarPrep. All rights reserved.
            </p>
            <p className="text-base text-gray-400">Designed for success</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
