import { SquareClient, SquareEnvironment } from "square";
import { Environment, Client as LegacyClient } from "square/legacy";

// New SDK client — needed for payments, orders, etc.
// export const squareClient = new SquareClient({
//   token: process.env.SQUARE_ACCESS_TOKEN!,
//   environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
// });

// for testing purposes: new sdk client working for sandbox token too
export const squareClient = new SquareClient({
  token: process.env.SQUARE_SANDBOX_ACCESS_TOKEN!,
  environment: process.env.NODE_ENV === "production" 
    ? SquareEnvironment.Production 
    : SquareEnvironment.Sandbox, 
});

// Legacy SDK client — needed for Catalog API
// export const legacyClient = new LegacyClient({
//   bearerAuthCredentials: { accessToken: process.env.SQUARE_ACCESS_TOKEN! },
// });

// for testing purposes: legacy sdk client working for  sandbox token too
export const legacyClient = new LegacyClient({
  accessToken: process.env.SQUARE_SANDBOX_ACCESS_TOKEN!,
  environment: process.env.NODE_ENV === "production" ? Environment.Production : Environment.Sandbox,
});

// Export the exact client.handle for catalog:
export const catalogApi = legacyClient.catalogApi;
export const inventoryApi = legacyClient.inventoryApi;