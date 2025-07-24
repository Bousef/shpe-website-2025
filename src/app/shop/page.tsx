"use client";

import { useEffect, useState } from "react";
import { getCatalog } from "./actions/actions";
import CreateItemForm from "./_components/CreateItemForm";
import Navbar from "../_components/NavBar";
import Link from "next/link";
import { api } from "~/trpc/react";


export default function ShopPage() {
    const [categories, setCategories] = useState<any[]>([]);

    const {
        data: data,
        isLoading,
        error, // <---- will only exist if getCurrentMember throws an exception
    } = api.user.getCurrentMember.useQuery();

    let showEdit = false;

    if (error) {
        console.log(error.message);
    }

    if (data?.position === "Treasurer") {
        showEdit = true;
    } else if (!data && !isLoading) {
        console.log("No user Found");
    }


    useEffect(() => {
        async function fetchData() {
            try {
                const catalogObjects = await getCatalog();
                console.log("Fetched catalog:", catalogObjects);

                const onlyCategories = catalogObjects?.filter(
                    (obj: any) => obj.type === "CATEGORY"
                );

                setCategories(onlyCategories);
            } catch (err) {
                console.error("Failed to load catalog:", err);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center">

                <h1>Shop Categories</h1>

                {showEdit && (
                    <Link
                        href="/manage_inv"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow mr-2">
                        Manage Inventory
                    </Link>
                )}

                <ul>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <Link href={`/shop/${cat.categoryData?.name?.toLowerCase()}`}>
                                <span className="text-blue-600 underline cursor-pointer">
                                    {cat.categoryData?.name ?? "Unnamed"}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

            </div>
        </>
    );
}
