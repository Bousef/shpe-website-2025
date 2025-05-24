import FooterSection from "../_components/FooterSection";
import Navbar from "../_components/NavBar";

export default function Calendar() {

    return (
        <div>
            <Navbar />
            Calendar
            <div className = "flex flex-col items-center">
                <iframe
                    id="calendar"
                    title="SHPE Calendar"
                    src="https://calendar.google.com/calendar/embed?src=shpe.ucf.chapter%40gmail.com&ctz=America/New_York"
                    className="pt-10 w-[85vw] lg:w-[75vw] h-[45vh] lg:h-[80vh]"
                />
            </div>
            <FooterSection />
        </div>
    );
}