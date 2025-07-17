import { SquareClient } from "square";
import { Client as LegacyClient } from "square/legacy";

// New SDK client — needed for payments, orders, etc.
export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

// Legacy SDK client — needed for Catalog API
export const legacyClient = new LegacyClient({
  bearerAuthCredentials: { accessToken: process.env.SQUARE_ACCESS_TOKEN! },
});

// Export the exact client.handle for catalog:
export const catalogApi = legacyClient.catalogApi;