import Flag from "react-world-flags";
import iso from "iso-3166-1";
import { BsEnvelope, BsLinkedin } from "react-icons/bs";
import { type Member } from "./MemberCard";
import Image from "next/image";
import Link from "next/link";

type ContactCardProps = {
  member: Member;
  onClose: () => void;
};

export default function ContactCard({ member, onClose }: ContactCardProps) {
  const handleOutsideClick = () => onClose();
  const handleInsideClick = (e: { stopPropagation: () => void }) => e.stopPropagation();

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-[#001f5b]/60 text-blue-950 flex justify-center items-center z-50 px-2 overflow-y-auto"
    >
      <div
        onClick={handleInsideClick}
        className="bg-white w-full max-w-[65rem] h-auto lg:h-[40rem] relative flex flex-col lg:flex-row gap-3 sm:gap-6 p-3 sm:p-6 rounded-md"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 p-2 text-gray-500 hover:text-black text-xl sm:text-2xl"
          aria-label="Close"
        >
          ✕
        </button>


        {/* Image Section */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center items-center">
          <div className="relative w-full h-48 sm:h-64 lg:flex-1 mb-2 sm:mb-4">
            <Image
              className="object-contain rounded-md"
              alt={member.name}
              src={`/members/${member.picture}`}
              fill
            />
          </div>
          <div className="text-center w-full text-lg sm:text-xl lg:text-2xl">
            <div>{member.name}</div>
            <div className="font-bold">{member.role}</div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full lg:w-2/3 flex flex-col justify-start space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base lg:text-lg relative">
          <div>
            <p className="font-bold text-blue-950">MAJOR:</p>
            <p>{member.major}</p>
          </div>

          <div>
            <p className="font-bold text-blue-950">FUTURE INDUSTRY FOCUS:</p>
            <p>{member.future_ind}</p>
          </div>

          <div>
            <p className="font-bold text-blue-950">BIO:</p>
            <p className="text-justify whitespace-pre-wrap">{member.bio}</p>
          </div>

          <div>
            <p className="font-bold text-blue-950">HOBBIES:</p>
            <p>{member.hobbies}</p>
          </div>

          {/* Contact Icons */}
          <div
            className={`
              flex gap-3 sm:gap-4 mt-3 items-center
              ${'lg:absolute lg:bottom-4 lg:right-4'}
            `}
          >
            <Flag
              className="h-6 sm:h-8 lg:h-10 overflow-hidden"
              code={iso.whereCountry(member.country)?.alpha3}
            />
            <a
              href={`mailto:${member.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <BsEnvelope className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 scale-125" />
            </a>
            <a
              href={
                member.linkedin.startsWith("http")
                  ? member.linkedin
                  : `https://${member.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 underline"
            >
              <BsLinkedin className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}



