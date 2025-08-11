import type { CatalogObject, OrderLineItem } from "node_modules/square/api";

// enrichItemsWithImageUrls enriches the order items with their corresponding image URLs from the catalog data.
export function enrichItemsWithImageUrls(catalogData: {
    objects: CatalogObject[] | undefined;
    relatedObjects: CatalogObject[] | undefined;
}, items: OrderLineItem[]): (OrderLineItem & { imageUrl?: string | null | undefined })[] {
  if (!catalogData.objects || !catalogData.relatedObjects) return items;

  const enrichedItems = items.map(item => {
    const itemVariation = catalogData.objects?.find(obj => obj.id === item.catalogObjectId);

    if (itemVariation?.type !== "ITEM_VARIATION") return item;

    const parentItem = catalogData.relatedObjects?.find(obj => obj.id === itemVariation?.itemVariationData?.itemId && obj.type === "ITEM");

    if (!parentItem || parentItem.type !== "ITEM") return item;

    const imageId = parentItem?.itemData?.imageIds?.[0];
    const image = imageId ? catalogData.relatedObjects?.find(obj => obj.id === imageId) : undefined;

    if (image?.type !== "IMAGE") return item;

    return {
      ...item,
      imageUrl: image.imageData?.url,
    };
  });

  return enrichedItems;
}