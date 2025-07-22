"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
// Use the hook in LoginContent
import AuthWrapper from "@/components/AuthWrapper";
import {  FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { setAuthCookie } from '@/lib/cookies';

// Create separate component that uses the Auth context
const LoginContent = () => {
  // No need for useAuthSafe in login since we're handling auth directly with Supabase
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  
  // Check directly with Supabase first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session from Supabase directly
        const { data } = await supabase.auth.getSession();
        console.log("Current session check:", data.session ? "Session exists" : "No session");
        
        if (data.session && data.session.user) {
          console.log("User is already authenticated, redirecting to:", redirectTo);
          router.push(redirectTo);
        } else {
          console.log("User is not authenticated, staying on login page");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };
    
    checkAuth();
  }, [redirectTo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Invalid login credentials")) {
          alert("Invalid email or password.");
        } else {
          alert(error.message);
        }
        setIsLoading(false);
        return;
      }

      console.log("Login successful, session created:", data.session ? "Yes" : "No");
      
      // Set auth cookie
      if (data.session) {
        console.log("Setting auth cookie with token");
        setAuthCookie(data.session.access_token);
        
        // Store session info in localStorage manually as backup
        try {
          localStorage.setItem('supabase.auth.session', JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.session.user
          }));
        } catch (err) {
          console.error("Error storing session in localStorage", err);
        }
        
        // Add a small delay to ensure cookies are set before navigation
        setTimeout(() => {
          // Force a hard navigation with cache buster
          window.location.href = `${redirectTo}?t=${Date.now()}`;
        }, 100);
      } else {
        console.error("No session data received after login");
        alert("Login was successful but session data is missing. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Rest of your form JSX remains unchanged */}
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
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
              className=""
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-3xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back to{" "}
            <span className="text-cyan-600">VolunteerVerse</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
          >
            Sign in to continue your volunteer journey
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="text-sm font-medium">
                  Remember me
                </Label>
              </div>

              {/* <Link
                href="/forgot-password"
                className="text-sm font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-500 dark:hover:text-cyan-400"
              >
                Forgot your password?
              </Link> */}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700"
            >
              {isLoading ? (
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* <div className="mt-6">
            <div className="relative">
              <Separator className="my-4" />
              <div className="relative flex justify-center">
                <span className="absolute px-2 bg-white dark:bg-zinc-800 text-sm text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button variant="outline" size="icon" className="h-10">
                <FiGithub className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-10">
                <FiTwitter className="h-5 w-5 text-[#1DA1F2]" />
              </Button>
              <Button variant="outline" size="icon" className="h-10">
                <FiFacebook className="h-5 w-5 text-[#4267B2]" />
              </Button>
            </div>
          </div> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&#39;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-500 dark:hover:text-cyan-400"
            >
              Register now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Main Login component with loading fallback and safe context consumption
const Login = () => {
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
      <LoginContent />
    </AuthWrapper>
  );
};

export default Login;
