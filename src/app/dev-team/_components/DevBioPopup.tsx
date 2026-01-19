"use client";

import { BsLinkedin } from "react-icons/bs";
import type { Member } from "../../_components/MemberCard";
import { motion, AnimatePresence } from "framer-motion";

type BioPopupsProps = {
	member: Member;
	onClose: () => void;
};

export function DevBioPopup({ member, onClose }: BioPopupsProps) {
	return (
		<AnimatePresence>
			{/* Outer backdrop */}
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center bg-blue-800/70 px-2 backdrop-blur-sm"
				onClick={onClose}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.25 }}
			>
				{/* Inner content */}
				<motion.div
					className="relative w-11/12 max-w-3xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl shadow-blue-800/30 md:w-2/3 md:p-8 lg:w-1/2"
					onClick={(e) => e.stopPropagation()}
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
						className="absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 transition-colors duration-200 hover:bg-orange-500 hover:text-white"
						aria-label="Close"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						transition={{ type: "spring", stiffness: 400, damping: 25 }}
					>
						✕
					</motion.button>

					{/* Bio content */}
					<div className="flex flex-col gap-4 md:flex-row">
						{/* Profile image */}
						<motion.div
							className="h-60 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 md:w-1/3"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1, duration: 0.35 }}
						>
							<img
								src={`/members/${member.picture}`}
								alt={member.name}
								className="h-full w-full object-cover"
							/>
							{/* Image Border Accent */}
							<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-blue-800/10" />
						</motion.div>

						{/* Text fields */}
						<motion.div
							className="space-y-3 md:w-2/3"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.15, duration: 0.35 }}
						>
							<motion.h2
								className="text-2xl font-bold text-blue-800 sm:text-3xl"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								{member.name}
							</motion.h2>
							<motion.p
								className="inline-block rounded-full bg-gradient-to-r from-blue-800 to-blue-700 px-4 py-1 text-sm font-bold uppercase text-white sm:text-base"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.25 }}
							>
								{member.role}
							</motion.p>

							{member.hobbies && (
								<motion.div
									className="space-y-2 text-sm text-gray-700 sm:text-base"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
								>
									<p>
										<span className="font-bold text-blue-800">HOBBIES:</span>{" "}
										{member.hobbies}
									</p>
								</motion.div>
							)}

							{/* LinkedIn button */}
							{member.linkedin && (
								<motion.div
									className="flex items-center gap-3 pt-2"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.35 }}
								>
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
								</motion.div>
							)}
						</motion.div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}