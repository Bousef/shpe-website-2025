import { BsLinkedin } from "react-icons/bs";

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

export default function MemberCard({ member, onSelect }: MemberCardProps) {
  // Extract initials for the Canva-style header
  const nameParts = member.name.split(' ');
  const initials = nameParts.length >= 2 
    ? `${nameParts[0][0]}${nameParts[nameParts.length-1][0]}`.toUpperCase()
    : member.name.substring(0, 2).toUpperCase();

  return (
    <div className="w-[180px] mx-auto"> {/* Tight container */}
      {/* Blue initials header */}
      <div className="bg-[#001f5b] text-white text-center py-1">
        <p className="text-sm font-bold">{initials}</p>
      </div>

      {/* Image with LinkedIn icon */}
      <div className="relative aspect-[3/4] group">
        <button
          onClick={() => onSelect(member)}
          className="w-full h-full focus:outline-none"
        >
          <img
            src={`/members/${member.picture}`}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=001f5b&color=ffffff&size=220`;
            }}
          />
        </button>

        {/* LinkedIn icon positioned on image */}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-white bg-opacity-80"
          >
            <BsLinkedin className="text-blue-600 w-4 h-4" />
          </a>
        )}
      </div>

      {/* Name and role - no background rectangle */}
      <div className="text-center px-1 py-2">
        <p className="text-sm font-bold text-[#001f5b] uppercase truncate">
          {member.name}
        </p>
        <p className="text-xs font-semibold text-[#001f5b] uppercase tracking-tight">
          {member.role}
        </p>
      </div>
    </div>
  );
}
