import type { CatalogObject, CatalogItem } from "node_modules/square/api";
import { getCatalog } from "../actions/actions";

//
// ---- tiny helpers -----------------------------------------------
//
function isCategory(
  obj: CatalogObject
): obj is CatalogObject & { categoryData: { name: string } } {
  return obj.type === "CATEGORY";
}

function isItem(
  obj: CatalogObject
): obj is CatalogObject & { itemData: CatalogItem } {
  return obj.type === "ITEM";
}

//
// ---- page component ---------------------------------------------
//
export default async function CategoryPage({
  params,
}: {
  params: { category: string }; // e.g. /shop/shirt → "shirt"
}) {
  /* 0️⃣  await params once */
  const { category } = await Promise.resolve(params);   // 👈 unwrap the Promise
  const slug = category.toLowerCase();                  // reuse later

  /* 1️⃣  fetch catalog */
  const catalog = await getCatalog();

  /* 2️⃣  find category that matches slug */
  const matchedCategory = catalog.find(
    (o): o is CatalogObject & { categoryData: { name: string } } =>
      isCategory(o) &&
      o.categoryData.name.toLowerCase().replace(/\s+/g, "-") === slug
  );


  if (!matchedCategory) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold capitalize">{params.category}</h1>
        <p className="text-red-600">Category not found.</p>
      </div>
    );
  }

  /* 3️⃣  collect items whose itemData.categoryId matches */
  const items = catalog
    .filter(isItem)
    .filter(
      (item) => item.itemData?.categoryId === matchedCategory.id
    );

  /* 4️⃣  render */
  return (
    <div className="p-4">
      {/* show the category NAME */}
      <h1 className="text-2xl font-semibold capitalize">
        {matchedCategory.categoryData.name}
      </h1>

      {items.length ? (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="p-2 border rounded">
              {item.itemData?.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">
          No items found in this category.
        </p>
      )}
    </div>
  );
}
