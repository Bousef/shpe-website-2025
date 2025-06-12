"use client";

import Navbar from "../_components/NavBar";
import AlumniCard from "../_components/AlumniCard";
import { alumniList } from "./AlumniInfo";

export default function Alumni() {

  return (

    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-yellow-500">2024 - 2025</h1>
      </div>

      <div className="grid grid-cols-0 sm:grid-cols-3 md:grid-cols-3 gap-6 px-6 pb-20 justify-items-center">
        {alumniList.map((member) => (
          <AlumniCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}