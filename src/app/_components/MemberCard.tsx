"use client";

import { motion } from "framer-motion";

// ============================================
// TYPES
// ============================================
export type Member = {
  name: string;
  role: string;
  major?: string;
  future_ind?: string;
  bio?: string;
  hobbies?: string;
  country?: string;
  linkedin: string;
  email?: string;
  picture: string;
};

type MemberCardProps = {
  member: Member;
  onSelect: (m: Member) => void;
};

// ============================================
// COMPONENT
// ============================================
export default function MemberCard({ member, onSelect }: MemberCardProps) {
  return (
    <motion.article
      className="group relative w-full cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      layout
    >
      <button
        onClick={() => onSelect(member)}
        className="relative block w-full overflow-hidden rounded-2xl 
                   bg-gradient-to-br from-[#001F5B] via-[#004080] to-[#002060]
                   p-[2px] transition-shadow duration-300 ease-out
                   shadow-lg shadow-blue-800/20
                   hover:shadow-xl hover:shadow-orange-500/30
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        aria-label={`View ${member.name}'s profile`}
      >
        {/* Card Inner Container */}
        <div className="relative overflow-hidden rounded-[calc(1rem-2px)] bg-white">
          {/* Image Container */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            <motion.img
              src={`/members/${member.picture}`}
              alt={`Portrait of ${member.name}`}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              loading="lazy"
            />

            {/* Gradient Overlay on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#001F5B] via-[#004080]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250"
            />

            {/* Hover Action Indicator */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250"
            >
              <span
                className="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-250"
              >
                View Profile
              </span>
            </div>

            {/* Accent Corner */}
            <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden">
              <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-gradient-to-br from-orange-400 to-orange-500 opacity-90" />
            </div>
          </div>

          {/* Content Section */}
          <div className="relative px-4 py-5 text-center sm:px-5 sm:py-6">
            {/* Decorative Top Border */}
            <div className="absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-orange-500 to-orange-400" />

            {/* Name */}
            <h3
              className="mb-1 truncate text-lg font-semibold tracking-tight text-[#001F5B] sm:text-xl"
              title={member.name}
            >
              {member.name}
            </h3>

            {/* Role Badge */}
            <div className="inline-flex items-center justify-center">
              <span className="relative inline-block rounded-full bg-gradient-to-r from-[#001F5B] to-[#004080] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white sm:px-4 sm:text-sm">
                {member.role}
              </span>
            </div>

            {/* Optional: Major indicator */}
            {member.major && (
              <p className="mt-2 truncate text-xs text-gray-500 sm:text-sm">
                {member.major}
              </p>
            )}
          </div>
        </div>
      </button>

      {/* Floating Glow Effect */}
      <motion.div
        className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40"
        aria-hidden="true"
      />
    </motion.article>
  );
}
