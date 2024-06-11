import Link from 'next/link';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aVvtZOdpuqP
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
    return (
        <div className="min-h-screen bg-white p-4 sm:p-8">
            <div className="container mx-auto">
                <header className="flex flex-wrap items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                        <img
                            alt="DDD logo"
                            className="h-10 object-contain"
                            src="/dlogo.png"
                        />
                        <h1 className="text-xl font-bold">Bionic Diamond</h1>
                    </div>
                </header>
                <main>
                    <section className="mt-12 text-center">
                        <h2 className="text-2xl font-bold">
                            Unleash the power of AI to boost creativity and efficiency in your workflow
                        </h2>

                    </section>
                    <section className="mt-12 md:flex md:space-x-6 md:justify-center md:items-center">
                        <div className="md:w-1/3 text-center">
                            <Link href="https://diamond-ai.vercel.app/">
                                <img
                                    alt="Engage with Text"
                                    className="mx-auto h-32 w-full object-cover md:h-auto"
                                    src="/img1.png"
                                    style={{
                                        aspectRatio: "16/9",
                                        objectFit: "cover",
                                    }}
                                />
                            </Link>
                            <h3 className="mt-6 text-xl font-semibold">Engage with Text</h3>
                            <p className="mt-2 text-gray-600">
                                Tap into the world of conversational AI. Whether it's crafting responses, generating content, or digging
                                into data, select from our top-tier models including GPT-4, GPT-3.5, Claude, Gemini, and Llama.
                            </p>
                            <Link href="https://diamond-ai.vercel.app/">
                                <div className="flex justify-center mt-4">
                                    <button className="bg-black text-white w-12 h-12 rounded-full flex justify-center items-center text-2xl font-bold focus:outline-none hover:bg-gray-800">
                                        +
                                    </button>
                                </div>
                            </Link>
                        </div>
                        <div className="mt-12 md:mt-0 md:w-1/3 text-center">
                            <Link href="/Genart">
                                <img
                                    alt="Create with GenArt"
                                    className="mx-auto h-32 w-full object-cover md:h-auto"
                                    src="/img2.png"
                                    style={{
                                        aspectRatio: "16/9",
                                        objectFit: "cover",
                                    }}
                                />
                            </Link>
                            <h3 className="mt-6 text-xl font-semibold">Create with GenArt</h3>
                            <p className="mt-2 text-gray-600">
                                Bring your visions to life with our cutting-edge image generation models. Dall-E 3, Stable Diffusion,
                                and Mid Journey await to transform your textual descriptions into stunning visuals.
                            </p>
                            <Link href="/Genart">
                                <div className="flex justify-center mt-4">
                                    <button className="bg-black text-white w-12 h-12 rounded-full flex justify-center items-center text-2xl font-bold focus:outline-none hover:bg-gray-800">
                                        +
                                    </button>
                                </div>
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
