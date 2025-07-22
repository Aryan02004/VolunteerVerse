"use client";
export const dynamic = "force-dynamic";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

const PendingApproval = () => {
  const { userProfile, signOut, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is approved, redirect to dashboard
    if (userProfile?.is_approved) {
      router.replace("/dashboard");
    }
  }, [userProfile, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If we're still rendering after the useEffect runs and the user is approved,
  // show nothing temporarily until the redirect completes
  if (userProfile?.is_approved) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Image
            src="/volunteer-verse.png"
            alt="VolunteerVerse Logo"
            width={120}
            height={60}
            style={{ height: "auto" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 mt-6 text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900">
            <FiClock className="h-8 w-8 text-amber-600 dark:text-amber-300" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Account Pending Approval
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Thank you for registering with VolunteerVerse, {userProfile?.first_name}! Your account
            is currently under review by our team. This process typically takes 1-2 business days.
          </p>

          <div className="mt-8 space-y-4">
            <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 text-left">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                While you wait:
              </h3>
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                <li>Browse our <Link href="/about" className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-500 dark:hover:text-cyan-400">About page</Link> to learn more about our mission</li>
                <li>Check out our <Link href="/events" className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-500 dark:hover:text-cyan-400">upcoming events</Link></li>
                <li>Make sure your email is correct to receive approval notifications</li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Have a question? Contact us at{" "}
              <a href="mailto:support@volunteerverse.com" className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-500 dark:hover:text-cyan-400">
                support@volunteerverse.com
              </a>
            </p>

            <button
              onClick={() => signOut()}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full"
            >
              <FiLogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PendingApproval;