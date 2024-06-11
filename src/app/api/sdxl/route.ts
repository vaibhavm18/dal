import { NextResponse } from 'next/server';
import Replicate from "replicate";

export const maxDuration = 60;
const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";
const replicate = new Replicate({
    auth: '..',
});

interface RequestBody {
    num_images?: number;
    [key: string]: any; // Allow any additional properties
}

export async function POST(req: Request) {
    console.log("Received request with body:", req.body);

    if (req.method === 'OPTIONS') {
        // Handle preflight requests for CORS
        const response = new NextResponse(null, { status: 204 }); // 204 No Content
        response.headers.append('Access-Control-Allow-Origin', '*');
        response.headers.append('Access-Control-Allow-Methods', 'POST, OPTIONS');
        response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    }

    if (req.method !== 'POST') {
        // Only allow POST requests, respond with 405 if other methods are used
        return new NextResponse('Method Not Allowed', { status: 405 });
    }

    const jsonBody: RequestBody = await req.json();

    // Remove null and undefined values from jsonBody
    const cleanedBody: RequestBody = Object.entries(jsonBody).reduce(
        (acc, [key, value]) => {
            if (value != null) {
                acc[key] = value;
            }
            return acc;
        },
        {} as RequestBody
    );

    // Change the key name from num_images to num_outputs
    if (cleanedBody.num_images !== undefined) {
        cleanedBody.num_outputs = cleanedBody.num_images;
        delete cleanedBody.num_images;
    }

    console.log("Processed request body:", cleanedBody);
    const output = await replicate.run(
        // This is the ID of the replicate model you are running
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
            input: cleanedBody,
        },
    );
    console.log("API call successful, prediction:", output);

    const imageUrls = output; // Replicate returns a list of URLs
    return NextResponse.json({ imageUrls });
}
