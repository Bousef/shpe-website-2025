import Navbar from "../_components/NavBar";
import AlumniCard from "../_components/AlumniCard";
import { alumniList } from "./AlumniInfo";
import SearchBar from "./_components/search-bar";
import { api } from "~/trpc/server";
import { Dropdown, DropdownButton, DropdownItem } from "./_components/dropdown";
import { DEFAULT_PAGE_SIZE } from "./_components/constants";
import Link from "next/link";


export default async function Alumni({ searchParams }: { searchParams: Promise<{ query?: string; pageSize?: string; page?: string; sortBy?: string; sortDirection?: string }> }) {
  const awaitedSearchParams = await searchParams;

  const query = awaitedSearchParams.query ?? "";

  let pageSize = parseInt(awaitedSearchParams.pageSize ?? "0");

  if (isNaN(pageSize) || pageSize === undefined || pageSize <= 0) {
    pageSize = Number(DEFAULT_PAGE_SIZE);
  }

  let page = parseInt(awaitedSearchParams.page ?? "0");
  if (isNaN(page) || page === undefined || page < 0) {
    page = 0;
  }

  const sortBy = ["first_name", "last_name", "grad_year"].includes(awaitedSearchParams.sortBy ?? "grad_year") ? awaitedSearchParams.sortBy : undefined;
  const sortDirection = ["asc", "desc"].includes(awaitedSearchParams.sortDirection ?? "asc") ? awaitedSearchParams.sortDirection : undefined;

  const {alumniList, total} = await api.alumni.getAlumni({
    page,
    pageSize: pageSize,
    query,
    sortBy: sortBy as "first_name" | "last_name" | "grad_year",
    sortDirection: sortDirection as "asc" | "desc",
  });

  console.log("first alumni member:", alumniList[0]);
  console.log("last alumni member:", alumniList[alumniList.length - 1]);

  const totalPages = Math.ceil(total / pageSize);
  console.log("Total Pages:", totalPages);

  const search = (page: number) => {
      const newQuery = new URLSearchParams();
      if (query.trim()) newQuery.set("query", query.trim());
      if (pageSize !== DEFAULT_PAGE_SIZE) newQuery.set("pageSize", pageSize.toString());
      if (page > 0) newQuery.set("page", page.toString());
      if (sortBy) newQuery.set("sortBy", sortBy);
      if (sortDirection) newQuery.set("sortDirection", sortDirection);

    return `?${newQuery ? newQuery.toString() : ""}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      <div className="text-center py-10">
        <h1 className="text-4xl text-blue-800">2024 - 2025</h1>
      </div>

      <SearchBar initialQuery="" initialPageSize={20} />

      <div className="grid grid-cols-0 sm:grid-cols-3 md:grid-cols-3 gap-6 px-6 pb-20 justify-items-center">
        {alumniList.map((member) => (
          <div key={member.id} className="w-full max-w-sm border rounded-lg shadow-lg bg-white p-4">
            {member.first_name + " " + member.last_name}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center px-6">
        <Link href={search(page - 1)}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-default"
            disabled={page <= 0}>
            &lt;
          </button>
        </Link>
        <Link href={search(page + 1)}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-default"
            disabled={page + 1 >= totalPages}>
            &gt;
          </button>
        </Link>
      </div>
    </div>
  );
}