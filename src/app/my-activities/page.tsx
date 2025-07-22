"use client";

import React, { useState, useEffect } from "react";
import { useAuthSafe } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiClock, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import AuthWrapper from "@/components/AuthWrapper";

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
  event_image_url?: string | null;
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

interface Event {
  id: string;
  title: string;
  event_date: string | null;
  location?: string;
  image_url?: string | null;
  ngo?: NGO;
}

interface VolunteerApplication {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  event: Event;
}

const MyActivitiesContent = () => {
  const { userProfile, isLoading } = useAuthSafe();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchAllApplications = async () => {
      if (!userProfile?.id) return;
      
      try {
        setIsApplicationsLoading(true);
        
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
          .order('applied_at', { ascending: false });
        
        if (error) throw error;
        
        const typedRawData = rawData as unknown as VolunteerApplicationResponse[];
        
        // Transform the data
        const formattedData = typedRawData?.map(app => {
          if (!app || !app.events) {
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
              image_url: app.events.event_image_url || null,
              ngo: ngoData ? {
                name: ngoData.name || 'Unknown Organization',
                logo_url: ngoData.logo_url || '/placeholders/ngo-logo.jpg'
              } : undefined
            }
          };
        }) || [];
        
        setApplications(formattedData);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsApplicationsLoading(false);
      }
    };
    
    if (userProfile) {
      fetchAllApplications();
    }
  }, [userProfile]);

  const formatDate = (dateString: string | null): string => {
    try {
      if (!dateString) return "Date not specified";
      
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return "Date not specified";
      }
      
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.log("Error formatting date:", error); 
      
      return "Date not specified";
    }
  };

  const formatAppliedDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return "Recently";
      }
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.log("Error formatting applied date:", error);
      return "Recently";
    }
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your activities...</p>
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
            You need to be logged in to view your activities
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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="my-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Activities</h1>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center">
                <FiArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Registered Events
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant={statusFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                    >
                      All
                    </Button>
                    <Button 
                      variant={statusFilter === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("pending")}
                      className={statusFilter === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                    >
                      Pending
                    </Button>
                    <Button 
                      variant={statusFilter === "approved" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("approved")}
                      className={statusFilter === "approved" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      Approved
                    </Button>
                    <Button 
                      variant={statusFilter === "rejected" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("rejected")}
                      className={statusFilter === "rejected" ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                      Rejected
                    </Button>
                  </div>
                </div>
              </div>
              
              {isApplicationsLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-cyan-500 rounded-full"></div>
                </div>
              ) : filteredApplications.length > 0 ? (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div 
                      key={application.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            {application.event.image_url ? (
                              <Image
                                src={application.event.image_url.startsWith("http") ? 
                                  application.event.image_url : 
                                  "/placeholders/event-placeholder.jpg"}
                                alt={application.event.title || "Event"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-cyan-100 dark:bg-cyan-900">
                                <FiClock className="h-8 w-8 text-cyan-600 dark:text-cyan-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link 
                              href={`/events/${application.event.id}`} 
                              className="text-lg font-medium text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400"
                            >
                              {application.event.title || "Unnamed Event"}
                            </Link>
                            
                            <div className="mt-1">
                              {application.event.ngo?.name && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Organized by: <span className="font-medium">{application.event.ngo.name}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap mt-2 gap-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <FiMapPin className="h-3.5 w-3.5 mr-1" />
                                {application.event.location || "Location not specified"}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <FiClock className="h-3.5 w-3.5 mr-1" />
                                {formatDate(application.event.event_date)}
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                              Applied on {formatAppliedDate(application.applied_at)}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={`text-sm px-3 py-1 ${
                            application.status === "approved" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                              : application.status === "rejected" 
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" 
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <FiAlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  {statusFilter === "all" ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">You haven&apos;t registered for any events yet</p>
                      <Link
                        href="/events"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      >
                        Browse Events
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-400">No {statusFilter} applications found</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setStatusFilter("all")}
                      >
                        Show All Applications
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const MyActivities = () => {
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
      <MyActivitiesContent />
    </AuthWrapper>
  );
};

export default MyActivities;