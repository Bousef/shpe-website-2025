import {BsLinkedin} from "react-icons/bs"
import type { Member } from "../../_components/MemberCard";

type BioPopupsProps = {
	member: Member;
	onClose: () => void;
};

export function DevBioPopup ({ member, onClose }: BioPopupsProps) {
	return (
		/* outer backdrop: covers parent component's area */ 
		<div 
			className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50" 
			onClick={onClose} // clicking anywhere here closes the popup
		>
			{/* inner content: stops click events from closing */}
			<div 
				className="relative bg-white rounded-sm shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-w-3xl p-8 overflow-auto" 
				onClick={(e) => e.stopPropagation()}
			>
				{/* bio content goes here */}
				<div className="flex flex-col md:flex-row gap-4">
					{/* profile image */}
					<div className="w-full md:w-1/3 h-60 overflow-hidden flex-shrink-0">
						<img
							src={`/members/${member.picture}`}
							alt={member.name}
							className="w-full h-full object-cover rounded-sm"
						/>
					</div>

					{/* text fields */}
					<div className="md:w-2/3 space-y-3">
						<h2 className="text-3xl font-bold text-[var(--shpe-dark-orange)]">{member.name}</h2>
						<p className="text-lg font-semibold uppercase text-blue-900">{member.role}</p>

						<div className="space-y-2 text-md text-gray-700">
							{member.hobbies && (
								<p>
									<span className="font-semibold">Hobbies:</span> {member.hobbies}
								</p>
							)}
						</div>

						{/* contact icons row (email, LinkedIn, etc.) */}
						{member.linkedin && (
							<div className="flex flex-row gap-5 mt-2 bottom-3 right-3 absolute items-center">
								<a
									href={member.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className=" bg-[#0077b5] rounded flex items-center justify-center hover:opacity-90 transition-opacity"
								>
									<BsLinkedin className="w-10 h-10 text-white" />
								</a>
							</div>
						)}
					</div>
				</div>
				
			</div>
		</div>
	);
}