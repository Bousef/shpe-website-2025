import AlumniCard from "~/app/_components/AlumniCard";
import type { Member } from "~/app/_components/MemberCard";

export default function AlumniDisplay({ alumni }: { alumni: Member[] }) {
    return (
        <div>
            {alumni.map((member) => (
                <AlumniCard key={member.name} member={member} />
            ))}
        </div>
    )
}