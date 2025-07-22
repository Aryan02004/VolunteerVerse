"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiMail, FiPhone } from "react-icons/fi";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";


// NGO type definition that matches your database schema
interface NGO {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
  created_at: string;
  // UI-specific properties that will be computed or defaulted
  location?: string; // This would need to come from another source or be defaulted
  category?: string; // This would need to come from another source or be defaulted
  eventCount?: number; // This would need to be calculated
}

const NGOs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filteredNGOs, setFilteredNGOs] = useState<NGO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch NGOs from the API
  useEffect(() => {
    const fetchNGOs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/ngos");
        if (!response.ok) {
          throw new Error("Failed to fetch NGOs");
        }
        const ngos = await response.json();

        // Apply initial filtering based on selected city or search query
        let filtered = ngos;
        if (selectedCity) {
          filtered = filtered.filter(
            (ngo: NGO) => ngo.location === selectedCity
          );
        }
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter((ngo: NGO) =>
            ngo.name.toLowerCase().includes(query)
          );
        }

        setFilteredNGOs(filtered);
      } catch (error) {
        console.error("Error fetching NGOs:", error);
        setFilteredNGOs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNGOs();
  }, [searchQuery, selectedCity]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Our Partner{" "}
            <span className="text-cyan-600 dark:text-cyan-500">NGOs</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Discover organizations making a difference in communities across
            India
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search Input with Icon */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by NGO name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 bg-white dark:bg-gray-800 w-full"
            />
          </div>

          {/* City Filter Dropdown */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 min-w-[180px] bg-white dark:bg-gray-800"
              >
                <FiFilter className="h-4 w-4" />
                {selectedCity || "All Cities"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSelectedCity(null)}>
                  All Cities
                </DropdownMenuItem>
                {CITIES.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => setSelectedCity(city)}
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredNGOs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNGOs.map((ngo) => (
              <NGOCard key={ngo.id} ngo={ngo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
              No NGOs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedCity
                ? `We couldn't find any NGOs in ${selectedCity} matching your search criteria.`
                : "We couldn't find any NGOs matching your search criteria."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCity(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const NGOCard = ({ ngo }: { ngo: NGO }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6 flex items-center space-x-4 border-b dark:border-gray-700">
          <div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={
                ngo.logo_url &&
                ngo.logo_url.startsWith(
                  "https://fra.cloud.appwrite.io"
                )
                  ? ngo.logo_url
                  : "/placeholders/ngo-logo.jpg"
              }
              alt={ngo.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {ngo.name}
            </h3>
            {/* <div className="flex items-center mt-1">
              <Badge variant="secondary" className="text-xs">
                {ngo.category || "General"}
              </Badge>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {ngo.location || "Multiple Locations"}
              </span>
            </div> */}
          </div>
        </div>

        <CardContent className="flex-grow p-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {ngo.description || "No description available"}
          </p>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FiMail className="w-4 h-4 mr-2" />
              <a
                href={`mailto:${ngo.contact_email}`}
                className="hover:text-cyan-600 dark:hover:text-cyan-500"
              >
                {ngo.contact_email || "Email not available"}
              </a>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FiPhone className="w-4 h-4 mr-2" />
              <a
                href={`tel:${ngo.contact_phone}`}
                className="hover:text-cyan-600 dark:hover:text-cyan-500"
              >
                {ngo.contact_phone || "Phone not available"}
              </a>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Link href={`/ngos/${ngo.id}`} className="w-full sm:w-auto">
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-700"
              >
                View Details
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NGOs;
