import Image from "next/image";
import Link from "../_components/Link";

export default function KnightConnectSection() {
  return (
    <>
      <div className="mb-8 h-px bg-gray-300" />
      <div className="space-y-4">
        <p>
          If you haven't done so previously, head to the{" "}
          <Link
            href="https://knightconnect.campuslabs.com/engage/organization/shpeucf"
            target="_blank"
          >
            Knight Connect
          </Link>{" "}
          page for SHPE at UCF. You will need to sign in with your UCF email and
          click "JOIN". It should say "MEMBERSHIP PENDING". Once that is
          complete, return to this page and continue.
        </p>
        <p>
          <strong>
            DON'T FORGET TO RETURN TO THIS FORM AND CONTINUE IN ORDER TO SUBMIT!
          </strong>
        </p>
        <p>
          If you have any questions on how to do so, please email{" "}
          <Link href="mailto:secretary@shpeucf.com">secretary@shpeucf.com</Link>{" "}
          or stop by MSC during our office hours in the Student Union.
        </p>
        <div className="relative aspect-video">
          <Image
            src="/images/knight-connect-page.png"
            alt="Knight Connect Page"
            fill
          />
        </div>
      </div>
    </>
  );
}
