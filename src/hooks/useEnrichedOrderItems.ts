import type { Order, OrderLineItem } from "node_modules/square/api";
import { useEffect, useMemo } from "react";
import { enrichItemsWithImageUrls } from "~/lib/square/catalog";
import { api } from "~/trpc/react";

export default function useEnrichedOrderItems(order: Order) {
    const { mutate: batchRetrieveCatalogObjects, data: catalogData, isPending: isCatalogPending, error } = api.square.catalog.batchRetrieveCatalogObjects.useMutation();

    useEffect(() => {
        // we filter with Boolean to only get truthy values (eg. non-empty strings)
        const catalogIds = order?.lineItems?.map(lineItem => lineItem.catalogObjectId).filter((item): item is string => Boolean(item)) ?? [];

        if (catalogIds.length > 0) {
            batchRetrieveCatalogObjects({ objectIds: catalogIds, includeRelatedObjects: true });
        }
    }, [batchRetrieveCatalogObjects, order?.lineItems]);

    const items = useMemo(() => {
        if (!catalogData) return order?.lineItems as (OrderLineItem & { imageUrl?: string | null | undefined })[];
        if (!order?.lineItems) return [];

        // we use order?.lineItems instead of items to not cause an infinite loop
        return enrichItemsWithImageUrls(catalogData, order?.lineItems);
    }, [catalogData, order?.lineItems]);

    return {
        items,
        isCatalogPending,
        error,
    };
}