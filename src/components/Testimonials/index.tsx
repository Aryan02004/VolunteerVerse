"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Student Volunteer",
    quote:
      "Volunteering through VolunteerVerse has been transformative. I was able to contribute my skills to a cause I care deeply about while making connections that will last a lifetime.",
    image: "/testimonials/testimonial-1.png",
    organization: "Tree Plantation Drive",
  },
  {
    id: 2,
    name: "Raj Malhotra",
    role: "Tech Professional",
    quote:
      "As a busy professional, finding meaningful volunteer opportunities was challenging until I discovered VolunteerVerse. The platform made it easy to find projects where my technical skills could make a real difference.",
    image: "/testimonials/testimonial-2.png",
    organization: "Digital Literacy Campaign",
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Retired Teacher",
    quote:
      "VolunteerVerse connected me with an education NGO where I now mentor underprivileged students. The platform's verification system gave me confidence in the organizations I was applying to.",
    image: "/testimonials/testimonial-3.png",
    organization: "Education For All",
  },
];

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
  organization: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden h-full flex flex-col"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4 border-2 border-cyan-500">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {testimonial.role}
            </p>
          </div>
        </div>

        <div className="relative">
          <svg
            className="absolute -top-2 -left-2 h-8 w-8 text-cyan-500 opacity-50"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>

          <p className="relative text-gray-700 dark:text-gray-300 italic mb-4 pl-6">
            {testimonial.quote}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            {testimonial.organization}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            <span className="block">Hear From Our</span>
            <span className="block text-cyan-600 dark:text-cyan-500">
              Volunteer Community
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Stories from volunteers who are making a difference across India.
          </p>
        </div>

        <div className="mt-12">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex items-center justify-center mt-8 gap-2">
              <CarouselPrevious className="relative inset-0 translate-y-0" />
              <CarouselNext className="relative inset-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
