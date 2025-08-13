import {BsLinkedin} from "react-icons/bs"
import Image from "next/image";

export type Member = {
	name: string;
	role: string;
	pfp: string;
	bio : {
		major: string;
		industryFocus: string;
		biotext: string;
		hobbies: string;
		linkedin: string;
	};
};

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
						<Image
							src={member.pfp}
							alt={member.name}
							width={300}
							height={240}
							className="w-full h-full object-cover rounded-sm"
						/>
					</div>

					{/* text fields */}
					<div className="md:w-2/3 space-y-3">
						<h2 className="text-3xl font-bold text-[var(--shpe-dark-orange)]">{member.name}</h2>
						<p className="text-lg font-semibold uppercase text-blue-900">{member.role}</p>

						<div className="space-y-2 text-md text-gray-700">
							<p>
								<span className="font-semibold">Major:</span> {member.bio.major}
							</p>
							<p>
								<span className="font-semibold">Hobbies:</span> {member.bio.hobbies}
							</p>
						</div>

						{/* contact icons row (email, LinkedIn, etc.) */}
						<div className="flex flex-row gap-5 mt-2 bottom-3 right-3 absolute items-center">
							<a
                href={member.bio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className=" bg-[#0077b5] rounded flex items-center justify-center hover:opacity-90 transition-opacity"
              >
								<BsLinkedin className="w-10 h-10 text-white" />
							</a>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	);
}