"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Define categories data
const categories = [
  {
    id: 1,
    name: "Women Empowerment",
    icon: "empowerment-icon",
    link: "/events",
  },
  {
    id: 2,
    name: "Education & Literacy",
    icon: "education-icon",
    link: "/events",
  },
  {
    id: 3,
    name: "Children",
    icon: "child-icon",
    link: "/events",
  },
  {
    id: 5,
    name: "Health",
    icon: "health-icon",
    link: "/events",
  },
  {
    id: 6,
    name: "Seniors",
    icon: "senior-icon",
    link: "/events",
  },
  {
    id: 7,
    name: "Animal Welfare",
    icon: "animal-icon",
    link: "/events",
  },
  {
    id: 8,
    name: "Environment & Sustainability",
    icon: "environment-icon",
    link: "/events",
  },
];

const Categories = () => {
  return (
    <section className="py-16 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Volunteer by <span className="text-cyan-600">Category</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find volunteer opportunities that match your interests and make a
            difference in areas you care about.
          </p>
        </div>

        <div className="flex justify-center">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full max-w-5xl"
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              {categories.map((category) => (
                <CarouselItem
                  key={category.id}
                  className="pl-4 md:basis-1/3 lg:basis-1/4"
                >
                  <Link href={category.link}>
                    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="flex flex-col items-center p-4">
                          <div className="mb-4 rounded-full bg-cyan-100 dark:bg-cyan-400 p-4">
                            <div className="w-12 h-12 flex items-center justify-center">
                              <span
                                className={`inline-block w-full h-full bg-contain bg-center bg-no-repeat ${category.icon}`}
                              ></span>
                            </div>
                          </div>
                          <p className="text-center font-medium text-gray-800 dark:text-gray-200">
                            {category.name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="relative" />
              <CarouselNext className="relative" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Add this CSS for the icons */}
      <style jsx>{`
        .empowerment-icon {
          background-image: url("/icons/women-empowerment.png");
        }
        .education-icon {
          background-image: url("/icons/education.png");
        }
        .child-icon {
          background-image: url("/icons/children.png");
        }
        .health-icon {
          background-image: url("/icons/health.png");
        }
        .senior-icon {
          background-image: url("/icons/seniors.png");
        }
        .animal-icon {
          background-image: url("/icons/animal.png");
        }
        .environment-icon {
          background-image: url("/icons/environment.png");
        }
      `}</style>
    </section>
  );
};

export default Categories;
