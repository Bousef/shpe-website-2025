

import Navbar from "../_components/NavBar";
import AlumniCard from "../_components/AlumniCard";
import { alumniList } from "./AlumniInfo";
import SearchBar from "./_components/search-bar";
import { api } from "~/trpc/server";


export default async function Alumni({ searchParams }: { searchParams: { query?: string } }) {

  const query = searchParams.query ?? "";

  const members = await api.alumni.getAlumni({
    page: 0,
    pageSize: 100,
    query,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      <div className="text-center py-10">
        <h1 className="text-4xl text-blue-800">2024 - 2025</h1>
      </div>

      <SearchBar initialQuery="" />

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