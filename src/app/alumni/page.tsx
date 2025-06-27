import Navbar from "../_components/NavBar";
import AlumniCard from "../_components/AlumniCard";
import { alumniList } from "./AlumniInfo";
import SearchBar from "./_components/search-bar";
import { api } from "~/trpc/server";
import { Dropdown, DropdownButton, DropdownItem } from "./_components/dropdown";
import { DEFAULT_PAGE_SIZE } from "./_components/constants";


export default async function Alumni({ searchParams }: { searchParams: { query?: string; pageSize?: string } }) {

  const query = searchParams.query ?? "";

  let pageSize = Number(searchParams.pageSize);

  console.log("Page Size:", pageSize);

  if (isNaN(pageSize) || pageSize === undefined) {
    pageSize = Number(DEFAULT_PAGE_SIZE);
  }

  console.log("Page Size:", pageSize);
  console.log("DEFAULT_PAGE_SIZE:", DEFAULT_PAGE_SIZE, typeof DEFAULT_PAGE_SIZE);

  const members = await api.alumni.getAlumni({
    page: 0,
    pageSize: pageSize,
    query,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      <div className="text-center py-10">
        <h1 className="text-4xl text-blue-800">2024 - 2025</h1>
      </div>

      <SearchBar initialQuery="" initialPageSize={20} />

      <div className="grid grid-cols-0 sm:grid-cols-3 md:grid-cols-3 gap-6 px-6 pb-20 justify-items-center">
        {members.map((member) => (
          <div key={member.id} className="w-full max-w-sm border rounded-lg shadow-lg bg-white p-4">
            {member.first_name + " " + member.last_name}
          </div>
        ))}
      </div>
    </div>
  );
}