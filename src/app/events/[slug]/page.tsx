"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiHome,
  FiArrowRight,
  FiShare2,
  FiCheck,
} from "react-icons/fi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const Event = () => {
  interface EventData {
    title: string;
    ngoSlug: string;
    ngoLogo?: string;
    ngoName: string;
    event_image_url?: string;
    category: string;
    dateTime: string | Date;
    duration: string;
    city: string;
    description: string;
    longDescription: string;
    requirements: string[];
    skills: string[];
    images?: string[];
    contactPerson: {
      name: string;
      email: string;
      phone: string;
    };
  }

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // The slug parameter in Next.js dynamic routes is available directly from the URL path segment
    // In [slug]/page.tsx, the slug is the directory name itself, not a query parameter
    const eventId = window.location.pathname.split("/").pop();

    console.log("Event ID:", eventId);

    if (!eventId) {
      console.error("Event ID is missing");
      setIsLoading(false);
      return;
    }

    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        console.log("API Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch event data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Event Data:", data);

        // Check if we need to fetch NGO details separately
        let ngoData = data.ngo;

        // If NGO data isn't included in the event response, fetch it separately
        if (!ngoData && data.ngo_id) {
          try {
            const ngoResponse = await fetch(`/api/ngos/${data.ngo_id}`);
            if (ngoResponse.ok) {
              ngoData = await ngoResponse.json();
            }
          } catch (error) {
            console.error("Error fetching NGO data:", error);
          }
        }

        // Transform API data to match the expected EventData structure
        const formattedData = {
          title: data.title,
          ngoSlug: data.ngo_id || "default-ngo",
          ngoName: ngoData?.name || "Organization",
          ngoLogo: ngoData?.logo_url,
          event_image_url: data.event_image_url,
          category: data.category || "General",
          dateTime: new Date(data.event_date),
          duration: `${data.duration || 2} hours`,
          city: data.location || "Unknown",
          description: data.description || "No description available",
          longDescription:
            data.long_description ||
            data.description ||
            "No detailed description available",
          requirements: data.requirements
            ? typeof data.requirements === "string"
              ? [data.requirements]
              : data.requirements
            : ["No specific requirements"],
          skills: data.skills
            ? typeof data.skills === "string"
              ? [data.skills]
              : data.skills
            : ["General volunteering"],
          contactPerson: {
            name: ngoData?.name || "Contact Person",
            email: ngoData?.contact_email || "contact@example.com",
            phone: ngoData?.contact_phone || "(123) 456-7890",
          },
        };

        setEventData(formattedData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        // First, try to get user ID from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            if (userData && userData.id) {
              console.log("Found user ID in localStorage:", userData.id);
              setUserId(userData.id);
              return;
            }
          } catch (e) {
            console.error("Error parsing user data from localStorage", e);
          }
        }
        
        // If we don't have a valid user ID in localStorage, try the Supabase client-side session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          console.log("Found session from Supabase client:", session.user.id);
          setUserId(session.user.id);
          localStorage.setItem('user', JSON.stringify(session.user));
          return;
        }
        
        console.log("No user session found");
      } catch (error) {
        console.error("Error in fetchUserData:", error instanceof Error ? error.message : String(error));
      }
    };

    fetchUserData();
    fetchEventData();
  }, []);

  useEffect(() => {
    // Check if the user has already applied for this event
    const checkExistingApplication = async () => {
      if (!userId) return;
      
      const eventId = window.location.pathname.split('/').pop();
      
      try {
        const response = await fetch(`/api/volunteer_applications/check?event_id=${eventId}&volunteer_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            setHasApplied(true);
            setRegistrationStatus('success');
          }
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    if (userId) {
      checkExistingApplication();
    }
  }, [userId]);

  const handleRegistration = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission behavior if this is triggered by a form
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  
    // Check if user is logged in
    if (!userId) {
      console.log("No user ID found, redirecting to login");
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?returnUrl=${returnUrl}`;
      return;
    }
  
    setIsRegistering(true);
    setRegistrationStatus('loading');
    setErrorMessage(null);
  
    try {
      // Extract eventId from URL
      const eventId = window.location.pathname.split('/').pop();
      console.log("Attempting to register for event:", eventId, "with user:", userId);
      
      // Call the volunteer application API
      const response = await fetch('/api/volunteer_applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          volunteer_id: userId,
        }),
        // Add this to prevent caching issues
        cache: 'no-store'
      });
  
      const data = await response.json();
      console.log("Registration API response:", data);
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for this event');
      }
  
      // Registration successful
      setRegistrationStatus('success');
      setHasApplied(true);
      
      // Show success message
      toast.success("Registration Successful!", {
        description: "Your application has been submitted. You'll receive updates via email.",
        duration: 5000,
      });
    } catch (error: unknown) {
      console.error('Registration error details:', error);
      setRegistrationStatus('error');
      
      // Type guard to safely extract error message
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMessage(errorMessage);
      
      toast.error("Registration Failed", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsRegistering(false);
    }
  };

 

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: eventData?.title,
        text: `Check out this volunteer opportunity: ${eventData?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">
          Event not found. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="w-full h-[300px] md:h-[400px] relative bg-gradient-to-r from-cyan-900 to-blue-900">
        <Image
          src={eventData.event_image_url || "/volunteer-verse.png"}
          alt={eventData.title}
          fill
          className="object-cover mix-blend-overlay opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
          <Badge className="mb-3 bg-cyan-600 hover:bg-cyan-700">
            {eventData.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {eventData.title}
          </h1>
          <div className="flex items-center text-gray-200 space-x-2">
            <Link
              href={`/ngos/${eventData.ngoSlug}`}
              className="hover:underline flex items-center"
            >
              {eventData.ngoLogo && (
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage
                    src={eventData.ngoLogo}
                    alt={eventData.ngoName}
                  />
                  <AvatarFallback>
                    {eventData.ngoName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              )}
              {eventData.ngoName}
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <FiHome className="mr-1 h-3.5 w-3.5" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{eventData.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Event Details (Left Column) */}
        <div className="md:col-span-2 space-y-8">
          {/* Key Information */}
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center sm:items-start p-4 rounded-lg bg-gray-50 dark:bg-zinc-700/30">
                <div className="flex items-center text-cyan-600 mb-2">
                  <FiCalendar className="mr-2" />
                  <span className="text-sm font-medium">Date & Time</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {format(eventData.dateTime, "MMMM d, yyyy")}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {format(eventData.dateTime, "h:mm a")}
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-start p-4 rounded-lg bg-gray-50 dark:bg-zinc-700/30">
                <div className="flex items-center text-cyan-600 mb-2">
                  <FiClock className="mr-2" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {eventData.duration}
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-start p-4 rounded-lg bg-gray-50 dark:bg-zinc-700/30">
                <div className="flex items-center text-cyan-600 mb-2">
                  <FiMapPin className="mr-2" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {eventData.city}
                </p>
              </div>

              {/* <div className="flex flex-col items-center sm:items-start p-4 rounded-lg bg-gray-50 dark:bg-zinc-700/30">
                <div className="flex items-center text-cyan-600 mb-2">
                  <FiUsers className="mr-2" />
                  <span className="text-sm font-medium">Availability</span>
                </div>
                
              </div> */}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              About This Event
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {eventData.description}
            </p>

            {/* <Separator className="my-4" /> */}

            {/* <div className="prose prose-cyan dark:prose-invert max-w-none">
              {eventData.longDescription
                .split("\n\n")
                .map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-4 text-gray-600 dark:text-gray-300"
                  >
                    {paragraph}
                  </p>
                ))}
            </div> */}
          </motion.div>

          {/* Requirements and Skills */}
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Requirements & Skills
            </h2>

            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                What You&#39;ll Need
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                {eventData.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                Skills You&#39;ll Use
              </h3>
              <div className="flex flex-wrap gap-2">
                {eventData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Gallery */}
          {eventData.images && eventData.images.length > 0 && (
            <motion.div
              {...fadeIn}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Event Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {eventData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-40 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${eventData.title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Registration and Contact (Right Column) */}
        <div className="space-y-6">
          {/* Registration Card */}
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 top-24"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Join This Event
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Make a difference by volunteering for this event. Limited spots
                available!
              </p>

              <Button
                className="w-full bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700"
                size="lg"
                onClick={handleRegistration}
                disabled={isRegistering || registrationStatus === 'success' || hasApplied}
              >
                {isRegistering ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : hasApplied || registrationStatus === 'success' ? (
                  <>
                    <FiCheck className="mr-2" />
                    Registration Submitted
                  </>
                ) : (
                  <>
                    Register as Volunteer
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </Button>

              {errorMessage && (
                <div className="mt-2 text-sm text-red-500 dark:text-red-400">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-between">
                {/* <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    isLiked
                      ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                      : ""
                  }`}
                  onClick={toggleLike}
                >
                  <FiHeart
                    className={`mr-1 ${isLiked ? "fill-red-500" : ""}`}
                  />
                  {isLiked ? "Saved" : "Save"}
                </Button> */}

                <Button variant="outline" size="sm" onClick={shareEvent}>
                  <FiShare2 className="mr-1" />
                  Share
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Contact Info Toggle */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={toggleContactInfo}
              >
                <span>Contact Information</span>
                <svg
                  className={`h-5 w-5 transition-transform ${
                    showContactInfo ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>

              {showContactInfo && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-700/30 rounded-lg">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      {eventData.contactPerson.name}
                    </p>

                    <div className="space-y-1">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Email:</span>{" "}
                        {eventData.contactPerson.email}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Phone:</span>{" "}
                        {eventData.contactPerson.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* NGO Card */}
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={eventData.ngoLogo} alt={eventData.ngoName} />
                <AvatarFallback className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {eventData.ngoName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {eventData.ngoName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Event Organizer
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href={`/ngos/${eventData.ngoSlug}`}>
                View Organization Profile
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Event;
