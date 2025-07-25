"use server";

import type { CatalogObject } from "node_modules/square/api";
import { SquareClient, SquareEnvironment } from "square";


export type FormCatalogObject = {
  name: string;
  description: string;
  variationName: string;
  variationPrice: string;     // dollars as text (“19.99”)
  categoryId: string;         // 🟢  <- ID of an existing CATEGORY object
  sizes?: Record<string, number>; // optional
};

export type NewCategoryPayload = { name: string };

const client = new SquareClient({
  token: process.env.NEXT_PUBLIC_SQUARE_SANDBOX_ACCESS_TOKEN!,
  environment: SquareEnvironment.Sandbox,
});


export async function getCatalog() {

  const result = await client.catalog.list({});
  return result.data; // <-- return the array of catalog objects
}

export async function getCatalogObject(id: string) {

  const result = await client.catalog.object.get({
    objectId: id,
  });

  return result;
}

export async function getObjectURL(imageId: string) {
  const result = await client.catalog.object.get({
    objectId: imageId,
  });
  const obj = result.object;
  if (obj?.type === "IMAGE")
    console.log("Image URL: " + obj.imageData?.url)
  else 
    console.log("Not an IMAGE?")

  if (obj?.type === "IMAGE" && obj.imageData?.url) {
    return obj.imageData.url;
  }
  return null;
}

export async function wipeCatalog() {

  const list = await client.catalog.list({});

  const ids = list.data.map(o => o.id).filter(Boolean) as string[];
  if (ids.length > 0) {
    const resp = await client.catalog.batchDelete({ objectIds: ids });
    console.log("Deleted IDs:", resp.deletedObjectIds);
  } else {
    console.log("Catalog already empty.");
  }
}

export async function insertItemWithImage(
  form: FormCatalogObject,
  file: File
) {
  /* ---------- 0. derive reusable bits ---------- */
  const tempItemId = `#${crypto.randomUUID()}`;
  const priceCents = BigInt(Math.round(parseFloat(form.variationPrice) * 100));

  /* ---------- 1. BUILD VARIATIONS LIST ---------- */
  const variations: CatalogObject[] =
    form.sizes && Object.keys(form.sizes).length > 0
      ? Object.keys(form.sizes).map((sz) => ({
        type: "ITEM_VARIATION" as const,   // keeps literal type
        id: `#${sz}`,
        itemVariationData: {
          itemId: tempItemId,
          name: sz,                        // S, M, L …
          pricingType: "FIXED_PRICING",
          priceMoney: { amount: priceCents, currency: "USD" },
        },
      }))
      : [
        {
          type: "ITEM_VARIATION" as const,
          id: "#default",
          itemVariationData: {
            itemId: tempItemId,
            name: form.variationName || "Regular",
            pricingType: "FIXED_PRICING",
            priceMoney: { amount: priceCents, currency: "USD" },
          },
        },
      ];

  /* ---------- 1. BUILD ITEM DATA ---------- */
  const itemData: any = {
    name: form.name,
    description: form.description,
    categoryId: form.categoryId,     // ✅ camelCase for the SDK → becomes category_id on wire
    variations,                       // built earlier
  };
  /* ---------- 2. UPSERT THE ITEM ---------- */
  const upsertRes = await client.catalog.object.upsert({
    idempotencyKey: crypto.randomUUID(),
    object: {
      type: "ITEM",
      id: tempItemId,
      itemData,
    },
  });

  /* ---------- 3. GET THE REAL ITEM ID ---------- */
  const realItemId =
    (upsertRes as any).object?.id ??
    (upsertRes as any).catalogObject?.id ??
    (upsertRes as any).result?.object?.id;

  if (!realItemId) throw new Error("Square did not return an item ID.");

  /* ---------- 4. ATTACH IMAGE ---------- */
  await client.catalog.images.create({
    imageFile: file,
    request: {
      idempotencyKey: crypto.randomUUID(),
      objectId: realItemId,
      image: {
        id: "#item-image",
        type: "IMAGE",
        imageData: { caption: `Image for ${form.name}` },
      },
    },
  });

  return { id: realItemId };
}


export async function insertCategoryWithImage(
  data: NewCategoryPayload,
  file: File                // real File / Blob from <input type="file">
) {
  /* ---------- 1. CREATE THE CATEGORY ---------- */
  const tempCategoryId = "#temp-category";

  const upsertRes = await client.catalog.object.upsert({
    idempotencyKey: crypto.randomUUID(),
    object: {
      type: "CATEGORY",
      id: tempCategoryId,               // temp ID
      categoryData: {
        name: data.name,                // the category name from form
        onlineVisibility: true,         // optional fields below
        isTopLevel: true,
      },
    },
  });

  /* ---------- 2. GET THE REAL CATEGORY ID ---------- */
  const realCategoryId =
    (upsertRes as any).object?.id ??
    (upsertRes as any).catalogObject?.id ??
    (upsertRes as any).result?.object?.id;

  if (!realCategoryId) {
    throw new Error("Square did not return a category ID after upsert.");
  }

  /* ---------- 3. ATTACH THE IMAGE ---------- */
  await client.catalog.images.create({
    imageFile: file,
    request: {
      idempotencyKey: crypto.randomUUID(),
      objectId: realCategoryId,     // attach to the new category
      image: {
        id: "#category-image",
        type: "IMAGE",
        imageData: {
          caption: `Image for ${data.name}`,
        },
      },
    },
  });

  return { id: realCategoryId };
}
