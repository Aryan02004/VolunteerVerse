"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from '../contexts/AuthContext';
import SessionDebug from './SessionDebug';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Optimize mounting - remove artificial delay
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Show loading state only briefly
  if (!isMounted) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col min-h-screen">
          <div className="h-16 bg-white dark:bg-zinc-900 shadow-sm animate-pulse"></div>
          <main className="flex-grow flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </main>
          <div className="bg-white dark:bg-zinc-900 py-8"></div>
        </div>
      </ThemeProvider>
    );
  }
  
  // Once mounted, render with full AuthProvider
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          {process.env.NODE_ENV !== 'production' && <SessionDebug />}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}