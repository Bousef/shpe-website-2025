// Function to convert address to coordinates

type Coordinates = {
    latitude: number;
    longitude: number;
}


export default async function AddressConvert(
    address: string
): Promise<Coordinates> {

    if (!address || address.trim() === ""){
        throw new Error("Address is required");
    }

    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "shpe-website-2025/1.0",
        },
    });

    if(!response.ok){
        throw new Error("Failed to reach geocoding service");
    }

    const data = await response.json() as Array<{ lat: string; lon: string }>;

    if(!data || data.length === 0) {
        throw new Error("Address not found, try being more specific");
    }

    return { latitude: parseFloat(data[0]!.lat), longitude: parseFloat(data[0]!.lon)};
};