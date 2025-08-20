import { api } from "~/trpc/server";
import CartItemsContainer from "./_components/CartItemsContainer";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Cart() {
  // Fetch the current member to check if the user is logged in
  // This is done server-side to avoid client-side hooks in the app directory
  const member = await api.user.getCurrentMember();

  if (!member) {
    redirect("/login"); // this performs a server-side redirect properly
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-brand">
      <Navbar />
      <main className="flex-grow w-full px-4 py-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/shop"
            className="mb-6 inline-flex items-center text-sm text-white/80 hover:text-white transition-colors"
          >
            ← Back to Shop
          </Link>
          
          <h1 className="mb-8 text-3xl font-semibold text-white">Shopping Cart</h1>
          <CartItemsContainer />
        </div>
      </main>
    </div>
  );
}
