import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY!,
});

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const originalImage: File | null = data.get(
      "originalImage"
    ) as unknown as File;

    const maskImage: File | null = data.get("maskImage") as unknown as File;
    const prompt: string | null = data.get("prompt") as string;

    if (!originalImage || !maskImage) {
      return NextResponse.json(
        { error: "Mask image and original image needed." },
        { status: 404 }
      );
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt needed" });
    }

    const res = await openai.images.edit({
      image: originalImage,
      prompt: prompt,
      mask: maskImage,
    });

    console.log("result", res.data);

    return NextResponse.json({ message: "Success", url: res.data[0].url });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
