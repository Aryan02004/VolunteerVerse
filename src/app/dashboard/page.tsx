"use client";

import React, { useState, useEffect } from "react";
import { useAuthSafe } from "@/contexts/AuthContext";
import Link from "next/link";
import { FiUser, FiCalendar, FiBriefcase, FiMapPin, FiClock, FiAlertCircle } from "react-icons/fi";
import Image from "next/image";
import AuthWrapper from "@/components/AuthWrapper";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

// Add these type definitions above your interfaces

// Type definitions for Supabase response
type NGOResponse = {
  name: string;
  logo_url?: string;
};

type EventResponse = {
  id: string;
  title: string;
  event_date: string;
  location?: string;
  event_image_url?: string | null; // Add this line
  ngo_id: string;
  ngos: NGOResponse[];
};

type VolunteerApplicationResponse = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  event_id: string;
  events: EventResponse;
};

// Add these interfaces to properly type your data
interface NGO {
  name: string;
  logo_url?: string;
}

// Update the Event interface
interface Event {
  id: string;
  title: string;
  event_date: string | null;
  location?: string;
  event_image_url?: string | null; // Existing property
  image_url?: string | null; // Add this line
  ngo?: NGO;
}

interface VolunteerApplication {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  event: Event;
}

const DashboardContent = () => {
  const { userProfile, isLoading } = useAuthSafe();
  const [registeredEvents, setRegisteredEvents] = useState<VolunteerApplication[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  // Update the useEffect for fetching registered events

useEffect(() => {
  const fetchRegisteredEvents = async () => {
    if (!userProfile?.id) return;
    
    try {
      setIsEventsLoading(true);
      
      // For debugging - print the user ID we're querying with
      console.log("Fetching volunteer applications for user ID:", userProfile.id);
      
      // Update the Supabase query to include event images
      const { data: rawData, error } = await supabase
        .from('volunteer_applications')
        .select(`
          id,
          status,
          applied_at,
          event_id,
          events:events!volunteer_applications_event_id_fkey (
            id, 
            title, 
            event_date, 
            location,
            event_image_url,
            ngo_id,
            ngos:ngos!events_ngo_id_fkey (
              name, 
              logo_url
            )
          )
        `)
        .eq('volunteer_id', userProfile.id)
        .order('applied_at', { ascending: false })
        .limit(3);
      
      if (error) {
        throw error;
      }
      
      console.log("Raw volunteer application data:", JSON.stringify(rawData, null, 2));
      
      // Type assertion - tell TypeScript the actual structure of the data
      const typedRawData = rawData as unknown as VolunteerApplicationResponse[];
      
      // Transform the data to match your interface
      const formattedData = typedRawData?.map(app => {
        // Extract event data properly 
        if (!app || !app.events) {
          console.log("Missing event data for application:", app?.id);
          return {
            id: app?.id || 'unknown',
            status: app?.status || 'pending',
            applied_at: app?.applied_at || new Date().toISOString(),
            event: {
              id: 'unknown',
              title: 'Unknown Event',
              event_date: "Date not specified",
              location: 'Location not specified',
              ngo: undefined
            }
          };
        }
        
        // Now we know app.events exists
        const ngoData = app.events.ngos && app.events.ngos.length > 0 
          ? app.events.ngos[0] 
          : null;
        
        return {
          id: app.id,
          status: app.status || 'pending',
          applied_at: app.applied_at,
          event: {
            id: app.events.id || 'unknown',
            title: app.events.title || 'Unknown Event',
            event_date: app.events.event_date ?? "Date not specified",
            location: app.events.location || 'Location not specified',
            image_url: app.events.event_image_url || null, // Add this line
            ngo: ngoData ? {
              name: ngoData.name || 'Unknown Organization',
              logo_url: ngoData.logo_url || '/placeholders/ngo-logo.jpg'
            } : undefined
          }
        };
      }) || [];
      
      console.log("Formatted events data:", JSON.stringify(formattedData, null, 2));
      
      setRegisteredEvents(formattedData);
    } catch (error) {
      console.error("Error fetching registered events:", error);
    } finally {
      setIsEventsLoading(false);
    }
  };
  
  if (userProfile) {
    fetchRegisteredEvents();
  }
}, [userProfile]);

  // Update formatDate function to handle invalid dates

const formatDate = (dateString: string | null): string => {
  try {
    // Make sure dateString is valid
    if (!dateString) {
      return "Date not specified";
    }
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "Date not specified";
    }
    
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date not specified";
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4">
        <div className="text-center">
          <Image
            src="/volunteer-verse.png"
            alt="VolunteerVerse Logo"
            width={120}
            height={60}
            style={{ height: "auto" }}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Not Logged In
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to view your dashboard
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700 text-white font-medium rounded-md shadow-sm"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-cyan-600 to-sky-600 rounded-xl p-8 text-white shadow-lg mb-8">
              <h1 className="text-3xl font-bold">
                Welcome, {userProfile.first_name}!
              </h1>
              <p className="mt-2 text-sky-100">
                {userProfile.user_type === "student"
                  ? `Student at ${userProfile.university}`
                  : userProfile.user_type === "professional"
                  ? userProfile.occupation
                  : "Welcome to your dashboard"}
              </p>
            </div>

            {/* Registered Events Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden mb-8"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Registered Events
                </h2>
                
                {isEventsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-cyan-500 rounded-full"></div>
                  </div>
                ) : registeredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {registeredEvents.map((application) => (
                      <div 
                        key={application.id} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                              {application.event.ngo?.logo_url ? (
                                <Image
                                  src={application.event.ngo.logo_url.startsWith("https://fra.cloud.appwrite.io") ? 
                                    application.event.ngo.logo_url : 
                                    "/placeholders/ngo-logo.jpg"}
                                  alt={application.event.ngo.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                // Replace the calendar icon with a default event image
                                <Image
                                  src={application.event.image_url || "/placeholders/event-placeholder.jpg"}
                                  alt={application.event.title || "Event"}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <Link 
                                href={`/events/${application.event.id}`} 
                                className="text-base font-medium text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400"
                              >
                                {application.event.title || "Unnamed Event"}
                              </Link>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span className="flex items-center">
                                  <FiMapPin className="h-3.5 w-3.5 mr-1" />
                                  {application.event.location || "Location not specified"}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span className="flex items-center">
                                  <FiClock className="h-3.5 w-3.5 mr-1" />
                                  {formatDate(application.event.event_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            className={
                              application.status === "approved" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                                : application.status === "rejected" 
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" 
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            }
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 text-center">
                      <Link
                        href="/my-activities"
                        className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300"
                      >
                        View all registered events →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <FiAlertCircle className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">You haven&apos;t registered for any events yet</p>
                    <Link
                      href="/events"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Browse Events
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rest of your dashboard cards remain unchanged */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900 rounded-full p-3">
                      <FiUser className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Profile
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        View and edit your personal information
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/profile"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900 rounded-full p-3">
                      <FiCalendar className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upcoming Events
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Browse and join volunteer events
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/events"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Explore Events
                    </Link>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900 rounded-full p-3">
                      <FiBriefcase className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        My Volunteering
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Track your volunteer activities
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/my-activities"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      View Activities
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* <div className="mt-8 grid grid-cols-1 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => signOut()}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <FiLogOut className="h-6 w-6 text-gray-500 dark:text-gray-400 mb-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Sign Out
                      </span>
                    </button>
                    <Link
                      href="/settings"
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <FiSettings className="h-6 w-6 text-gray-500 dark:text-gray-400 mb-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Settings
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <AuthWrapper
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-cyan-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </AuthWrapper>
  );
};

export default Dashboard;