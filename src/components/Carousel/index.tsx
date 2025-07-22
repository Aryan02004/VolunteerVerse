import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

const Hero = () => {
  const images = [
    { src: "/carousel/carousel-1.png", alt: "Carousel Image 1" },
    { src: "/carousel/carousel-2.png", alt: "Carousel Image 2" },
    { src: "/carousel/carousel-3.png", alt: "Carousel Image 3" },
  ];

  return (
    <div className="relative pt-16">
      <Carousel className="w-full dark:bg-zinc-900">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
              <CarouselDots />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Hero;
