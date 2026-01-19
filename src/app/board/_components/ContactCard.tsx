"use client";

import Flag from "react-world-flags";
import iso from "iso-3166-1";
import { BsEnvelope, BsLinkedin } from "react-icons/bs";
import { type Member } from "../../_components/MemberCard";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type ContactCardProps = {
  member: Member;
  onClose: () => void;
};

export default function ContactCard({ member, onClose }: ContactCardProps) {
  const handleOutsideClick = () => onClose();
  const handleInsideClick = (e: { stopPropagation: () => void }) => e.stopPropagation();

  return (
    <AnimatePresence>
      <motion.div
        onClick={handleOutsideClick}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-blue-800/70 px-2 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          onClick={handleInsideClick}
          className="relative flex h-auto w-full max-w-[65rem] flex-col gap-3 overflow-hidden rounded-2xl bg-white p-3 shadow-2xl shadow-blue-800/30 sm:gap-6 sm:p-6 lg:h-[40rem] lg:flex-row"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Decorative Background Elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-tr from-blue-700/20 to-blue-800/10 blur-3xl" />

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 transition-colors duration-200 hover:bg-orange-500 hover:text-white sm:right-4 sm:top-4 sm:text-2xl"
            aria-label="Close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            ✕
          </motion.button>

          {/* Image Section */}
          <motion.div
            className="flex w-full flex-col items-center justify-center lg:w-3/5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            <div className="relative mb-2 h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 sm:mb-4 sm:h-64 lg:flex-1">
              <Image
                className="rounded-xl object-contain"
                alt={member.name}
                src={`/members/${member.picture}`}
                fill
              />
              {/* Image Border Accent */}
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-blue-800/10" />
            </div>

            {/* Name, Role & Contact Icons Container */}
            <motion.div
              className="flex w-full items-center justify-between gap-3 px-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Name & Role - Left */}
              <div className="text-left text-lg text-blue-800 sm:text-xl lg:text-2xl">
                <div>{member.name}</div>
                <div className="inline-block mt-1 rounded-full bg-gradient-to-r from-blue-800 to-blue-700 px-4 py-1 text-sm font-bold text-white sm:text-base">
                  {member.role}
                </div>
              </div>

              {/* Contact Icons - Right */}
              <div
                className="flex items-center gap-2 sm:gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="overflow-hidden rounded-md shadow-sm ring-1 ring-gray-200">
                  <Flag
                    className="h-10"
                    code={iso.whereCountry(member.country ?? "")?.alpha3 ?? ""}
                  />
                </div>
                <motion.a
                  href={`mailto:${member.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full bg-blue-800 p-2 text-white shadow-md transition-colors duration-200 hover:bg-orange-500 sm:p-3"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <BsEnvelope className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                </motion.a>
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full bg-blue-800 p-2 text-white shadow-md transition-colors duration-200 hover:bg-orange-500 sm:p-3"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <BsLinkedin className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            className="relative flex w-full flex-col justify-start space-y-2 text-xs sm:space-y-3 sm:text-sm md:text-base lg:w-2/3 lg:text-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="font-bold text-blue-800">MAJOR:</p>
              <p className="text-gray-700">{member.major}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <p className="font-bold text-blue-800">FUTURE INDUSTRY FOCUS:</p>
              <p className="text-gray-700">{member.future_ind}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="font-bold text-blue-800">BIO:</p>
              <p className="whitespace-pre-wrap text-justify text-gray-700">{member.bio}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <p className="font-bold text-blue-800">HOBBIES:</p>
              <p className="text-gray-700">{member.hobbies}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}



