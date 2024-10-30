/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const data = [
  {
    image: "/robert.jpeg",
    name: "Robert Bjork",
    title: "Cognitive psychologist",
    content:
      "Testing is not just a dipstick to measure learning; it's an event that actually creates learning and makes it durable.",
  },
  {
    image: "/Henry.png",
    name: "Dr. Henry Roediger",
    title: "Cognitive Psychologist",
    content:
      "Testing, or retrieval practice, is not just a way to assess knowledge but a powerful tool to enhance it.",
  },
  {
    image: "/norman.jpg",
    name: "Dr. Norman Doidge",
    title: "Canadian psychiatrist and author of The Brain That Changes Itself",
    content:
      "Neuroplasticity is competitive. It’s ‘use it or lose it.’ Skills we practice grow stronger, while those we neglect weaken.",
  },
];

export default function Testimonials() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-primary mb-12">
        What Experts Say
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((testimonial, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-primary">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {testimonial.title}
                </p>
              </div>
              <div className="relative">
                <Quote className="absolute top-0 left-0 text-primary/20 w-8 h-8 -translate-x-2 -translate-y-2" />
                <blockquote className="text-base italic text-muted-foreground pl-6">
                  "{testimonial.content}"
                </blockquote>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
