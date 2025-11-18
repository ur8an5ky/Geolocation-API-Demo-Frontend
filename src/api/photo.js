const API_BASE_URL = 'http://127.0.0.1:8001';

/**
 * Downloads photos from the area defined by the map boundaries.
 * @param {object} bounds - Object returning min_lat, min_lon, max_lat, max_lon.
 */
export async function fetchPhotosInArea(bounds) {
    const url = new URL(`${API_BASE_URL}/photos/area`);
    url.searchParams.append('min_lat', bounds.min_lat);
    url.searchParams.append('min_lon', bounds.min_lon);
    url.searchParams.append('max_lat', bounds.max_lat);
    url.searchParams.append('max_lon', bounds.max_lon);

    try {
        const response = await fetch(url);
        
        const data = await response.json(); 
        
        return data; 
    } catch (error) {
        console.error("Error while retrieving data from FastAPI:", error);
        return [];
    }
}

export async function createTestPhoto(photoData) {
    try {
        const response = await fetch(`${API_BASE_URL}/photos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(photoData),
        });
        return response.json();
    } catch (error) {
        console.error("POST error:", error);
    }
}