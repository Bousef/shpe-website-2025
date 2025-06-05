import {BsLinkedin} from "react-icons/bs"

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
				className="relative bg-white shadow-xl max-w-3xl p-10" 
				onClick={(e) => e.stopPropagation()}
			>
				{/* bio content goes here */}
				<div className="flex flex-col md:flex-row gap-4">
					{/* profile image */}
					<div className="md:w-1/3 h-40 md:h-auto">
						<img
							src={member.pfp}
							alt={member.name}
							className="w-full h-full object-cover rounded-md"
						/>
					</div>

					{/* text fields */}
					<div className="md:w-2/3 space-y-3">
						<h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
						<p className="text-sm font-semibold uppercase text-blue-900">{member.role}</p>

						<div className="space-y-2 text-sm text-gray-700">
							<p>
								<span className="font-semibold">Major:</span> {member.bio.major}
							</p>
							<p>
								<span className="font-semibold">Hobbies:</span> {member.bio.hobbies}
							</p>
						</div>

						{/* contact icons row (email, LinkedIn, etc.) */}
						<div className="flex flex-row gap-5 mt-2 bottom-0 right-0 absolute items-center">
							<a
                href={member.bio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className=" bg-[#0077b5] rounded flex items-center justify-center hover:opacity-90 trasition-opacity"
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