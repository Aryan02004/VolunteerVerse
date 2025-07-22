"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiInstagram, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin,
  FiArrowRight,
  FiHeart,
  FiCheck
} from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      // Reset form after showing success message
      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <footer className="bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 border-t border-gray-200 dark:border-gray-800">
      {/* Top Section with Links */}
      <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link href="/">
              <div className="flex flex-col items-start">
                {/* Using a div instead of Image to avoid hydration mismatch */}
                <div className="relative">
                  <Image
                    src="/volunteer-verse.png"
                    alt="VolunteerVerse Logo"
                    width={110}
                    height={110}
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">
                  VolunteerVerse
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
              Connecting volunteers with meaningful opportunities to make a difference in communities across India.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon icon={<FiTwitter />} href="https://twitter.com" />
              <SocialIcon icon={<FiFacebook />} href="https://facebook.com" />
              <SocialIcon icon={<FiInstagram />} href="https://instagram.com" />
              <SocialIcon icon={<FiLinkedin />} href="https://linkedin.com" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-center">Quick Links</h3>
            <ul className="space-y-2 flex flex-col items-center ">
              <FooterLink href="/events">Upcoming Events</FooterLink>
              <FooterLink href="/ngos">Partner NGOs</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
            </ul>
          </div>

          {/* Volunteer */}
          {/* <div>
            <h3 className="font-semibold text-lg mb-4">Volunteer</h3>
            <ul className="space-y-2">
              <FooterLink href="/how-it-works">How It Works</FooterLink>
              <FooterLink href="/opportunities">Find Opportunities</FooterLink>
              <FooterLink href="/register">Register as Volunteer</FooterLink>
              <FooterLink href="/stories">Success Stories</FooterLink>
              <FooterLink href="/resources">Volunteer Resources</FooterLink>
            </ul>
          </div> */}

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Subscribe to our newsletter for updates on new volunteer opportunities.
            </p>
            
            {isSubmitted ? (
              <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
                <FiCheck className="text-green-500" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="px-4 py-2 w-full rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {/* Using motion.div instead of motion.button to avoid hydration issues */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-r-md px-3 py-2 flex items-center justify-center cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiArrowRight />
                  )}
                </motion.div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContactItem icon={<FiPhone />} text="+91 88888 99999" />
            <ContactItem icon={<FiMail />} text="connect@volunteerverse.org" />
            <ContactItem icon={<FiMapPin />} text="Mumbai • Delhi • Bengaluru • Hyderabad" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center mb-2 md:mb-0">
            <span>© {new Date().getFullYear()} VolunteerVerse. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              Cookie Policy
            </Link>
            <div className="flex items-center">
              Made with <FiHeart className="text-red-500 mx-1" /> in India
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link href={href} className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center group">
      <span className="inline-block transition-transform group-hover:translate-x-1">{children}</span>
    </Link>
  </li>
);

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    {icon}
  </motion.a>
);

const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center">
    <div className="text-cyan-500 mr-2">{icon}</div>
    <span className="text-sm">{text}</span>
  </div>
);

export default Footer;