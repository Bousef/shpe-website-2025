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
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onSelect(member)}
        className="block w-full focus:outline-none"
      >
        <div className="w-full aspect-[3/4] overflow-hidden rounded-md">
          <img
            src={member.picture}
            alt={member.name}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-2xl tracking-wide text-[#001f5b]">
            {member.name}
          </p>
          <p className="font-bold text-2xl tracking-wider text-[#001f5b] mb-10">
            {member.role.toUpperCase()}
          </p>
        </div>
      </button>
    </div>
  );
}
