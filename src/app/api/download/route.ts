import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Interface for the request body
interface DownloadRequest {
    imageUrl: string;
}

// Function to handle POST requests
export async function POST(request: NextRequest) {
    // Parse the request body
    const { imageUrl } = await request.json() as DownloadRequest;

    // Check if imageUrl is provided
    if (!imageUrl) {
        return new NextResponse(JSON.stringify({ error: "Image URL is required" }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    try {
        // Fetch the image using axios
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });

        // Prepare headers to force download on the client side
        const headers = new Headers({
            'Content-Type': 'image/png', // Adjust according to your image's MIME type
            'Content-Disposition': 'attachment; filename="download.png"' // Customize filename as needed
        });

        // Create and send the response with the image data
        return new NextResponse(response.data, { headers });
    } catch (error) {
        console.error("Error downloading image:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to download image" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
