import Flag from "react-world-flags";
import iso from "iso-3166-1";
import { BsEnvelope, BsLinkedin } from "react-icons/bs";
import { type Member } from "./MemberCard";
import Image from "next/image";

type ContactCardProps = {
  member: Member;
  onClose: () => void;
};

export default function ContactCard({ member, onClose }: ContactCardProps) {
  return (
    <div className="fixed inset-0 bg-[#001f5b]/60 text-blue-950 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-[65rem] h-[40rem] relative flex gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Image Section */}
        <div className="w-3/5 min-w-64 sm:min-w-80 md:min-w-96 relative flex flex-col justify-center items-center">
          <div className="flex-1 w-full relative mb-3">
            <Image
              className="object-contain rounded-md" 
              alt={member.name}
              fill
              src={`/members/${member.picture}`}
            />
          </div>
          <div className="text-center w-full text-2xl flex-shrink-0">
            <div>{member.name}</div>
            <div className="font-bold">{member.role}</div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-2/3 flex flex-col justify-start space-y-3 relative">
          <div>
            <p className="font-bold text-lg text-blue-950">MAJOR:</p>
            <p>{member.major}</p>
          </div>

          <div>
            <p className="font-bold text-lg text-blue-950">
              FUTURE INDUSTRY FOCUS:
            </p>
            <p>{member.future_ind}</p>
          </div>

          <div>
            <p className="font-bold text-lg text-blue-950">BIO:</p>
            <p className="text-justify whitespace-pre-wrap">{member.bio}</p>
          </div>

          <div>
            <p className="font-bold text-sm text-blue-950">HOBBIES:</p>
            <p>{member.hobbies}</p>
          </div>

          <div className="flex flex-row gap-5 mt-2 bottom-0 right-0 absolute items-center">
            <Flag
              className="h-10 overflow-hidden"
              code={iso.whereCountry(member.country)?.alpha3}
            />
            <a
              href={member.email}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <BsEnvelope className="w-10 h-10 scale-125" style={{ boxSizing: 'content-box' }}/>
            </a>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 underline"
            >
              <BsLinkedin className="w-10 h-10" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
