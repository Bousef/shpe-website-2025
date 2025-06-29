"use server";

import Navbar from "../_components/NavBar";
import AlumniCard from "../_components/AlumniCard";
import SearchBar from "./_components/search-bar";
import { api } from "~/trpc/server";
import { DEFAULT_PAGE_SIZE } from "./_components/constants";
import Link from "next/link";
import { positionEnumValues, type Position } from "~/server/db/schema";
import type { Alumni } from "~/server/db/schema";

type SortByType = "first_name" | "last_name" | "grad_year" | Position;
const sortByWhitelist: SortByType[] = ["first_name", "last_name", "grad_year", ...positionEnumValues];

async function replaceInvalidImagesByDefault(alumni: Alumni) {
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.first_name + " " + alumni.last_name)}&background=001f5b&color=ffffff&size=220`;

    // Helper to check if url is valid
    async function urlExists(url: string) {
      try {
          const response = await fetch(url, { method: 'HEAD' }); // HEAD is lighter than GET
          return response.ok;
      } catch {
          return false;
      }
    }

    const localUrl = new URL(alumni.image ?? "", process.env.BASE_URL ?? "http://localhost:3000").href;

    // Check alumni image URL first
    if ((!alumni.image || !(await urlExists(alumni.image)) && !(await urlExists(localUrl)))) {
        alumni.image = fallbackUrl;
    } 

    return;
}

export default async function Alumni({ searchParams }: { searchParams: Promise<{ query?: string; pageSize?: string; page?: string; sortBy?: string; sortDirection?: string; }> }) {
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

  const rawSortBy = awaitedSearchParams.sortBy ?? "grad_year";

  const sortBy = sortByWhitelist.includes(rawSortBy as SortByType)
  ? (rawSortBy as SortByType)
  : "grad_year";

  const sortDirection = ["asc", "desc"].includes(awaitedSearchParams.sortDirection ?? "asc") ? awaitedSearchParams.sortDirection : undefined;

  const {alumniList, total} = await api.alumni.getAlumni({
    page,
    pageSize: pageSize,
    query,
    sortBy: sortBy,
    sortDirection: sortDirection as "asc" | "desc",
  });

  const totalPages = Math.ceil(total / pageSize);

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

      <div className="grid grid-cols-0 sm:grid-cols-3 md:grid-cols-4 gap-6 px-6 pb-20 pt-10 justify-items-center">
        {alumniList.map(async (member) => {
          await replaceInvalidImagesByDefault(member);
          return <AlumniCard key={member.id} alumni={member} />;
        })}
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