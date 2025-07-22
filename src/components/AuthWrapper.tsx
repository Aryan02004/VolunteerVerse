"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type AuthWrapperProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const AuthWrapper = ({ children, fallback }: AuthWrapperProps) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset mounted state when route changes
    setMounted(false);
    
    // Use a slight delay to ensure everything is ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!mounted) {
    // Show fallback while client-side rendering is in progress
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default AuthWrapper;