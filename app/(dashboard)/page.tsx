import { Button } from "@/components/ui/button";
import { ArrowRight, FileQuestion, Database, ChartArea } from "lucide-react";
import Image from "next/image";
import pic from "../public/imagem2.png";

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Your Ultimate Prep Tool for the
                <span className="block text-orange-500">Ontario Bar Exam</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Practice smarter with tailored questions and instant feedback
                designed to boost your confidence and exam success.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a href="/sign-up" target="_self">
                  <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    Create my first test now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Image
                src={pic}
                alt="Hero"
                layout="responsive"
                width={800}
                height={600}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <FileQuestion />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Tailored Question Bank
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  A comprehensive, expertly curated question bank tailored to
                  the Ontario Bar Exam, ensuring you get relevant and up-to-date
                  practice for maximum success.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Database className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Real-Time Analytics
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Track your progress with detailed analytics and real-time
                  feedback, helping you focus on areas that need improvement and
                  enhance your study efficiency.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <ChartArea className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Expert-Led Explanations
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Benefit from detailed explanations written by legal experts,
                  helping you understand complex topics and improve your legal
                  reasoning skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to Ace the Ontario Bar Exam?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Our platform gives you everything you need to fully prepare and
                pass with confidence. Stop stressing over outdated
                materials—focus on mastering the content that matters most.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <a href="/sign-up" target="_self">
                <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
                  Start Your Free Account Today
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
