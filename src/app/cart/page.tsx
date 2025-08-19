import { api } from "~/trpc/server";
import CartItemsContainer from "./_components/CartItemsContainer";
import { redirect } from "next/navigation";

export default async function Cart() {
  // Fetch the current member to check if the user is logged in
  // This is done server-side to avoid client-side hooks in the app directory
  const member = await api.user.getCurrentMember();

  if (!member) {
    redirect("/login"); // this performs a server-side redirect properly
  }
  const items = await api.user.cart.getItems();

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <CartItemsContainer items={items} />
      </div>
    </>
  );
}
