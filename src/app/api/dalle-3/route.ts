import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: "..",
});

// Define the type for the request body
interface RequestBody {
  image?: string;
  prompt: string;
  negative_prompt?: string;
  num_images?: number;
  width?: number;
  height?: number;
  size?: string;
}

export async function POST(request: Request) {
  try {
    const { image, prompt, negative_prompt, num_images, size } =
      (await request.json()) as RequestBody;
    const n = num_images || 1; // Default to 1 if num_images is not provided

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    let imageSize:
      | "1024x1024"
      | "1792x1024"
      | "1024x1792"
      | "256x256"
      | "512x512" = "1024x1024"; // Default size
    if (size === "1792x1024") {
      imageSize = "1792x1024";
    } else if (size === "1024x1792") {
      imageSize = "1024x1792";
    }

    console.log(imageSize);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n,
      size: imageSize,
    });

    const imageUrls = response.data.map((image) => image.url);

    if (!imageUrls.length) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
