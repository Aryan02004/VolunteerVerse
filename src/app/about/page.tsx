"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiUsers, FiHeart, FiTarget, FiAward } from "react-icons/fi";

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

// interface TeamMemberProps {
//   name: string;
//   role: string;
//   image: string;
//   delay: number;
// }

// interface StatCardProps {
//   number: string;
//   label: string;
//   delay: number;
// }

const AboutUs = () => {
  return (
    <main className="bg-white dark:bg-zinc-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 dark:from-cyan-900/20 dark:to-sky-900/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About <span className="text-cyan-600">VolunteerVerse</span>
            </motion.h1>
            <motion.p 
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Connecting passionate volunteers with meaningful opportunities across India
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our <span className="text-cyan-600">Mission</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                At VolunteerVerse, we believe in the power of community service to transform lives and create positive change. Our mission is to bridge the gap between willing volunteers and meaningful opportunities, making it easier for people to contribute their time and skills to causes they care about.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We aim to create a vibrant ecosystem where volunteers, NGOs, and communities come together to address social challenges and build a better future for all.
              </p>
            </motion.div>
            <motion.div 
              className="mt-10 lg:mt-0 relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/about/mission-image.jpg"
                  alt="Volunteers working together"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our <span className="text-cyan-600">Values</span>
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              The principles that guide everything we do
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <ValueCard 
              icon={<FiUsers className="w-8 h-8 text-cyan-600" />}
              title="Community Impact"
              description="We believe in the power of collective action to create meaningful change in communities across India."
              delay={0}
            />
            <ValueCard 
              icon={<FiHeart className="w-8 h-8 text-cyan-600" />}
              title="Compassion"
              description="We approach every interaction with empathy, understanding, and respect for all individuals."
              delay={0.1}
            />
            <ValueCard 
              icon={<FiTarget className="w-8 h-8 text-cyan-600" />}
              title="Integrity"
              description="We maintain the highest standards of transparency and accountability in all our partnerships."
              delay={0.2}
            />
            <ValueCard 
              icon={<FiAward className="w-8 h-8 text-cyan-600" />}
              title="Excellence"
              description="We continuously strive to improve our platform and services for volunteers and organizations alike."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1 mt-10 lg:mt-0 relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/about/story-image.jpg"
                  alt="VolunteerVerse journey"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our <span className="text-cyan-600">Story</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                VolunteerVerse was born from a simple observation: while many people wanted to volunteer, they often struggled to find meaningful opportunities that matched their skills and interests.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Founded in 2025 by a group of passionate social entrepreneurs, we set out to create a platform that would make volunteering accessible, transparent, and impactful.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Today, we connect thousands of volunteers with hundreds of verified NGOs across India, facilitating experiences that transform lives and communities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Meet Our <span className="text-cyan-600">Team</span>
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              The passionate people behind VolunteerVerse
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <TeamMember 
              name="Aisha Sharma"
              role="Founder & CEO"
              image="/team/team-1.jpg"
              delay={0}
            />
            <TeamMember 
              name="Vikram Patel"
              role="Chief Technology Officer"
              image="/team/team-2.jpg"
              delay={0.1}
            />
            <TeamMember 
              name="Neha Gupta"
              role="Head of Partnerships"
              image="/team/team-3.jpg"
              delay={0.2}
            />
            <TeamMember 
              name="Rahul Mehta"
              role="Community Manager"
              image="/team/team-4.jpg"
              delay={0.3}
            />
          </div>
        </div>
      </section> */}

      {/* Impact Stats */}
      {/* <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our <span className="text-cyan-600">Impact</span>
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              The difference we&#39;re making together
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <StatCard number="10,000+" label="Active Volunteers" delay={0} />
            <StatCard number="500+" label="Partner NGOs" delay={0.1} />
            <StatCard number="2,500+" label="Completed Projects" delay={0.2} />
            <StatCard number="25+" label="Cities Across India" delay={0.3} />
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-sky-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Make a Difference?
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join thousands of volunteers creating positive change across India
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <motion.button 
                className="px-8 py-3 bg-white text-cyan-600 font-semibold rounded-md shadow-md hover:bg-gray-50 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register as Volunteer
              </motion.button>
            </Link>
            <Link href="/ngos">
              <motion.button 
                className="px-8 py-3 bg-transparent text-white border-2 border-white font-semibold rounded-md hover:bg-white/10 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore NGOs
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

// Helper Components
const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

// const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, delay }) => {
//   return (
//     <motion.div 
//       className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay }}
//       viewport={{ once: true }}
//     >
//       <div className="aspect-w-1 aspect-h-1 relative w-full h-64">
//         <Image
//           src={image}
//           alt={name}
//           fill
//           className="object-cover"
//         />
//       </div>
//       <div className="p-4 text-center">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
//         <p className="text-cyan-600 dark:text-cyan-400">{role}</p>
//       </div>
//     </motion.div>
//   );
// };

// const StatCard: React.FC<StatCardProps> = ({ number, label, delay }) => {
//   return (
//     <motion.div 
//       className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md text-center"
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay }}
//       viewport={{ once: true }}
//     >
//       <p className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent mb-2">
//         {number}
//       </p>
//       <p className="text-gray-600 dark:text-gray-300 text-lg">{label}</p>
//     </motion.div>
//   );
// };

export default AboutUs;
