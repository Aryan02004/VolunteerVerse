"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiClock, FiMapPin, FiCalendar, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string;
  ngo: {
    name: string; // Include the NGO name
  };
  location: string;
  event_date: string;
  duration: number;
  category: string;
  maxVolunteers: number;
  registeredVolunteers: number;
  event_image_url: string;
}

// Define custom event type
interface CityChangeEvent extends CustomEvent {
  detail: {
    city: string;
  };
}

interface EventListProps {
  defaultCity?: string;
}

const EventList = ({ defaultCity }: EventListProps) => {
  const [selectedCity, setSelectedCity] = useState(defaultCity || "Select City");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for city changes from the navbar
  useEffect(() => {
    // Only check for city in localStorage if no defaultCity was provided
    if (!defaultCity) {
      // Check for city selection from localStorage (set by Navbar)
      const getSelectedCity = () => {
        if (typeof window !== "undefined") {
          const city = localStorage.getItem("selectedCity");
          return city || "Select City";
        }
        return "Select City";
      };

      const checkForCityChanges = () => {
        const city = getSelectedCity();
        setSelectedCity(city);
      };

      // Initial check
      checkForCityChanges();

      // Set up event listener for storage changes (when Navbar updates the city)
      window.addEventListener("storage", checkForCityChanges);

      // Custom event for direct communication
      const handleCityChange = (e: CityChangeEvent) => {
        setSelectedCity(e.detail.city);
      };

      window.addEventListener("cityChanged", handleCityChange as EventListener);

      return () => {
        window.removeEventListener("storage", checkForCityChanges);
        window.removeEventListener(
          "cityChanged",
          handleCityChange as EventListener
        );
      };
    }
  }, [defaultCity]);

  // Filter events based on selected city
  useEffect(() => {
    setIsLoading(true);

    const fetchEvents = async () => {
      try {
        // Add timeout to avoid hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch("/api/events", {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const events = await response.json();

        // Filter by city if a specific city is selected
        let filtered = events;
        if (selectedCity !== "Select City") {
          filtered = events.filter(
            (event: Event) => event.location === selectedCity
          );
        }

        setFilteredEvents(filtered);
      } catch (error) {
        console.error("Error fetching events:", error);
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCity]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate spots remaining
  const spotsRemaining = (max: number, registered: number) => {
    return max - registered;
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl my-8">
            <span className="block">Upcoming Volunteer</span>
            <span className="block text-cyan-600 dark:text-cyan-500">
              {selectedCity !== "Select City"
                ? `Events in ${selectedCity}`
                : "Events"}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            {selectedCity !== "Select City"
              ? `Discover volunteer opportunities in ${selectedCity} and make a difference in your community.`
              : ""}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                formatDate={formatDate}
                formatTime={formatTime}
                spotsRemaining={spotsRemaining}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
              No events found in {selectedCity}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              There are currently no upcoming volunteer events in this location.
            </p>
            {selectedCity !== "Select City" && (
              <p className="text-gray-600 dark:text-gray-400">
                Try selecting a different city from the navigation bar.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

// Define EventCard props type
interface EventCardProps {
  event: Event;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  spotsRemaining: (max: number, registered: number) => number;
}

const EventCard = ({
  event,
  formatDate,
  formatTime,
}: EventCardProps) => {


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={event.event_image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-cyan-600 text-white text-xs font-semibold rounded">
            <FiTag className="inline mr-1" />
            {event.category}
          </div>
        </div>

        <CardContent className="flex-grow p-6">
          <div className="mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-cyan-600 dark:text-cyan-400 mb-4">
              by {event.ngo.name}
            </p>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiCalendar className="mr-2" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiClock className="mr-2" />
              <span>
                {formatTime(event.event_date)} • {event.duration} hours
              </span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiMapPin className="mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-6 border-t border-gray-100 dark:border-gray-800">
          <div className="w-full space-y-3">
            <Link href={`/events/${event.id}`} className="block w-full">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white">
                View Details
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EventList;
