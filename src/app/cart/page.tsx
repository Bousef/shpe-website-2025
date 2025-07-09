import Navbar from "../_components/NavBar";
import { api } from "~/trpc/server";
import CartItemsContainer from "./_components/CartItemsContainer";

export default async function Cart() {
  const items = await api.user.cart.getItems();

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <CartItemsContainer items={items} />
    </div>
    </>
  );
}
