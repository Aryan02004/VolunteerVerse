"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiHome,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUsers,
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

// Define streamlined interfaces for our data structures
interface TeamMember {
  name: string;
  role: string;
}

interface NGODetailData {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  logoUrl: string;
  foundedYear: number;
  team: TeamMember[];
  address: string;
}

const NGODetail = () => {
  const { slug } = useParams();
  const [ngoData, setNgoData] = useState<NGODetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNgoData = async () => {
      setIsLoading(true);

      try {
        // Fetch NGO data from API
        const response = await fetch(`/api/ngos/${slug}`);

        if (!response.ok) {
          throw new Error("Failed to fetch NGO data");
        }

        const apiData = await response.json();

        // Transform API data to match NGODetailData format
        const formattedData: NGODetailData = {
          id: apiData.id,
          name: apiData.name,
          description: apiData.description || "No description available.",
          longDescription:
            apiData.description || "No detailed description available.",
          category: apiData.category || "General",
          contactEmail: apiData.contact_email || "No email available",
          contactPhone: apiData.contact_phone || "No phone available",
          websiteUrl: apiData.website_url || "#",
          logoUrl: apiData.logo_url || "/placeholders/ngo-logo.jpg",
          foundedYear: new Date(apiData.created_at).getFullYear(),
          team: [{ name: apiData.name, role: "Organization Leader" }],
          address: apiData.address || "Address not specified",
        };

        setNgoData(formattedData);
      } catch (error) {
        console.error("Error fetching NGO data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchNgoData();
    }
  }, [slug]);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  if (isLoading || !ngoData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen pb-16">
      {/* Hero Section with Cover Image */}
      <div className="w-full h-[300px] md:h-[400px] relative bg-gradient-to-r from-cyan-900 to-blue-900">
        <Image
          src={ngoData.logoUrl}
          alt={ngoData.name}
          fill
          className="object-cover mix-blend-overlay opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
          <Badge className="mb-3 bg-cyan-600 hover:bg-cyan-700">
            {ngoData.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {ngoData.name}
          </h1>
          {/* <p className="text-lg text-gray-200 max-w-2xl">
            {ngoData.description}
          </p> */}
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
              <BreadcrumbLink href="/ngos">NGOs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{ngoData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* NGO Details (Left Column) */}
        <div className="md:col-span-2 space-y-8">
          {/* About Section */}
          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              About {ngoData.name}
            </h2>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <FiCalendar className="mr-2" />
              <span>Founded in {ngoData.foundedYear}</span>
            </div>

            <Separator className="my-4" />

            <div className="prose prose-cyan dark:prose-invert max-w-none">
              {ngoData.longDescription
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="mb-4 text-gray-600 dark:text-gray-300"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Contact and Info (Right Column) */}
        <div className="space-y-6">
          {/* NGO Logo and Contact Card */}
          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-center mb-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={ngoData.logoUrl}
                  alt={ngoData.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
              Contact Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <FiMail className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${ngoData.contactEmail}`}
                    className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    {ngoData.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <FiPhone className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </p>
                  <a
                    href={`tel:${ngoData.contactPhone}`}
                    className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    {ngoData.contactPhone}
                  </a>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col space-y-3">


              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-700"
                asChild
              >
                <Link
                  href={`/events?ngo=${ngoData.id}`}
                  className="flex items-center justify-center"
                >
                  <FiUsers className="mr-2 h-4 w-4" />
                  Volunteer with us
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Our Team
            </h3>

            <div className="space-y-4">
              {ngoData.team.map((member: TeamMember, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-100 flex items-center justify-center mr-3">
                    {member.name.substring(0, 1)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NGODetail;
