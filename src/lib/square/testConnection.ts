import { catalogApi } from "./client";

export const testSquareConnection = async () => {
  try {
    const res = await catalogApi.listCatalog(undefined, "CATEGORY");

    return {
      success: true,
      categories: res.result?.objects ?? [],
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Unknown error",
    };
  }
};