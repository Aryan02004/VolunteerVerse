"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiSun, 
  FiMoon, 
  FiChevronDown, 
  FiCalendar, 
  FiUsers, 
  FiInfo, 
  FiUser,
  FiLogOut,
  FiHome,
  FiEdit,
  FiMail
} from "react-icons/fi";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { userProfile, user, signOut, isLoading } = useAuth();

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close other menus
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Smooth scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleThemeAndCloseMenu = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setIsMenuOpen(false);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Render a placeholder or nothing until mounted
  if (!mounted || isLoading) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-zinc-900`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo placeholder */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-[90px] h-[35px]" />
                <span className="text-2xl font-bold text-transparent">
                  VolunteerVerse
                </span>
              </div>
            </div>
            {/* Rest of navbar as placeholder */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-900/90 shadow-md backdrop-blur-sm"
          : "bg-white dark:bg-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/volunteer-verse.png"
                  alt="Logo"
                  width={90}
                  height={105}
                  className="mt-3"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">
                  VolunteerVerse
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItem href="/events" icon={<FiCalendar className="mr-1" />}>
              Events
            </NavItem>
            <NavItem href="/ngos" icon={<FiUsers className="mr-1" />}>
              NGOs
            </NavItem>
            <NavItem href="/about" icon={<FiInfo className="mr-1" />}>
              About Us
            </NavItem>
            <motion.button
              onClick={scrollToContact}
              className="group flex items-center rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMail className="mr-1" />
              Contact
            </motion.button>

            {/* City Selection Dropdown */}
            {/* <div className="relative">
              <motion.button
                className="group flex items-center rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
                onClick={toggleCityDropdown}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMapPin className="mr-1" />
                <span>{selectedCity}</span>
                <FiChevronDown
                  className={`ml-1 transition-transform ${
                    isCityDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {isCityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 max-h-60 overflow-y-auto"
                  >
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
                        onClick={() => selectCity(city)}
                      >
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div> */}

            {/* User Navigation - Show login or profile based on auth state */}
            <div className="relative ml-4">
              {user && userProfile ? (
                <>
                  <motion.button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center text-white">
                      {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
                    </div>
                    <span className="hidden sm:inline-block">{userProfile.first_name}</span>
                    <FiChevronDown className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{userProfile.first_name} {userProfile.last_name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userProfile.email}</p>
                        </div>
                        
                        <Link href="/dashboard">
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiHome className="inline-block mr-2" /> Dashboard
                          </button>
                        </Link>
                        
                        <Link href="/profile">
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiEdit className="inline-block mr-2" /> Edit Profile
                          </button>
                        </Link>
                        
                        {/* <Link href="/settings">
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiSettings className="inline-block mr-2" /> Settings
                          </button>
                        </Link> */}
                        
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                          <button 
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FiLogOut className="inline-block mr-2" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login">
                  <motion.button
                    className="flex items-center bg-gradient-to-r from-cyan-500 to-cyan-700 text-white px-4 py-2 rounded-md transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiUser className="mr-2" />
                    Login / Signup
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === "dark" ? (
                <FiSun className="h-5 w-5 text-yellow-400" />
              ) : (
                <FiMoon className="h-5 w-5 text-gray-700" />
              )}
            </motion.button>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            {/* Profile button for mobile */}
            {user && userProfile ? (
              <motion.button
                onClick={toggleUserMenu}
                className="mr-2 h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
              </motion.button>
            ) : (
              <motion.button
                onClick={() => router.push('/login')}
                className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiUser className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </motion.button>
            )}

            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile User Menu */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center text-white text-lg">
                  {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.first_name} {userProfile?.last_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userProfile?.email}</p>
                </div>
              </div>
              
              <Link href="/dashboard" className="block w-full">
                <motion.button 
                  className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <FiHome className="mr-2" /> Dashboard
                </motion.button>
              </Link>
              
              <Link href="/profile" className="block w-full">
                <motion.button 
                  className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <FiUser className="mr-2" /> Profile
                </motion.button>
              </Link>
              
              {/* <Link href="/settings" className="block w-full">
                <motion.button 
                  className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <FiSettings className="mr-2" /> Settings
                </motion.button>
              </Link> */}
              
              <motion.button 
                className="flex items-center w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
              >
                <FiLogOut className="mr-2" /> Sign out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-zinc-900 shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavItem href="/events" icon={<FiCalendar className="mr-2" />} onClick={() => setIsMenuOpen(false)}>
                Events
              </MobileNavItem>
              <MobileNavItem href="/ngos" icon={<FiUsers className="mr-2" />} onClick={() => setIsMenuOpen(false)}>
                NGOs
              </MobileNavItem>
              <MobileNavItem href="/about" icon={<FiInfo className="mr-2" />} onClick={() => setIsMenuOpen(false)}>
                About Us
              </MobileNavItem>

              {/* Contact Button for Mobile */}
              <motion.button
                onClick={scrollToContact}
                className="flex items-center w-full px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiMail className="mr-2" />
                Contact
              </motion.button>

              {/* Theme Toggle in Mobile Menu */}
              <motion.button
                onClick={toggleThemeAndCloseMenu}
                className="flex items-center w-full px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {theme === "dark" ? (
                  <>
                    <FiSun className="mr-2 h-5 w-5 text-yellow-400" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <FiMoon className="mr-2 h-5 w-5 text-gray-700 dark:text-gray-200" />
                    Dark Mode
                  </>
                )}
              </motion.button>

              {/* Mobile Login/Signup Button */}
              {!user && (
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/login">
                    <motion.button
                      className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-cyan-700 text-white px-4 py-3 rounded-md transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-2" />
                      Login / Signup
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Desktop Navigation Item Component
interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, children, icon }) => {
  return (
    <Link href={href}>
      <motion.span
        className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/30 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
        {children}
      </motion.span>
    </Link>
  );
};

// Mobile Navigation Item Component
const MobileNavItem: React.FC<{ 
  href: string; 
  children: React.ReactNode; 
  icon: React.ReactNode; 
  onClick?: () => void;
}> = ({ href, children, icon, onClick }) => {
  return (
    <Link href={href} className="block" onClick={onClick}>
      <motion.div
        className="flex items-center px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {icon}
        {children}
      </motion.div>
    </Link>
  );
};

export default Navbar;