"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type modificationProps = {
    placeholder: string;
    name: string;
    href: string;
}

const Boxes = [
    { name: "Add User", placeholder: "Add a new user to the system", href: "/admin/add" },
    { name: "Edit User", placeholder: "Edit existing user details", href: "/admin/edit" },
    { name: "Delete User", placeholder: "Remove a user from the system", href: "/admin/delete" },
]
const UserCard = ({ placeholder, name, href }: modificationProps) => {
    return (
        <motion.div 
        className="bg-white rounded-lg shadow-md p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h2 className="text-xl font-semibold mb-2 text-[#001f5b]">{name}</h2>
            <p className="text-gray-600">{placeholder}</p>
            {href && (
                <a 
                    href={href}
                    className="mt-4 inline-block bg-[var(--shpe-navy-blue)] text-white px-4 py-2 rounded-lg hover:bg-[var(--shpe-blue)]"
                >
                    Manage {name}
                </a>
            )}
        </motion.div>
    )

}

export default function ManageUsers() {
    return (
        <main className="min-h-screen w-full">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-6 text-[#001f5b]">Manage Users</h1>
                <motion.div initial="hidden" animate="visible">
                    {Boxes.map((box, index) => (
                        <UserCard key={index} name={box.name} placeholder={box.placeholder} href={box.href} />
                    ))}
                </motion.div>
            </div>
        </main>
    )
}