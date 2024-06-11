import { useState } from 'react';
import Link from 'next/link';

const Faq = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <Link href="#" onClick={toggleOverlay} className="text-black underline text-sm font-medium">
                How-To
            </Link>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-scroll ">
                    <div className="relative max-w-4xl mx-auto my-8 p-4 bg-white border-8 border-gray-600 rounded-lg">
                        <button onClick={toggleOverlay} className="absolute top-4 right-4 text-black">
                            ✖
                        </button>

                        <div className="p-4 space-y-6">
                            <h2 className="text-2xl font-bold">FAQ</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">What is this app for?</h3>
                                <p>This app allows you to create AI-generated images by entering descriptive prompts. You can select different models and styles to achieve various artistic effects.</p>

                                <h3 className="text-xl font-semibold">What models are available?</h3>
                                <ul className="list-disc list-inside">
                                    <li>
                                        <strong>Stable Diffusion:</strong> This model creates high-quality images based on the text descriptions you provide. It's known for generating detailed and realistic images.
                                    </li>
                                    <li>
                                        <strong>DALL-E 3:</strong> A model developed by OpenAI that can generate creative and unique images from textual descriptions. It is known for its versatility and ability to understand complex prompts.
                                    </li>
                                    <li>
                                        <strong>ControlNet:</strong> This model allows for more control over the image generation process. It requires you to upload an image as a reference to guide the diffusion process, making it ideal for enhancing or modifying existing images.
                                    </li>
                                </ul>

                                <h3 className="text-xl font-semibold">How do I use the ControlNet model?</h3>
                                <ol className="list-decimal list-inside">
                                    <li>Select "ControlNet" from the model dropdown.</li>
                                    <li>Upload an image that you want to use as a reference.</li>
                                    <li>Enter your prompt to describe how you want the final image to look.</li>
                                    <li>Adjust other settings like style and aspect ratio as needed.</li>
                                    <li>Click "Create" to generate the image.</li>
                                </ol>

                                <h3 className="text-xl font-semibold">What styles can I choose from?</h3>
                                <ul className="list-disc list-inside">
                                    <li>Artistic: Produces images with a creative and artistic touch.</li>
                                    <li>Photorealistic: Generates images that look like real photographs.</li>
                                    <li>Cartoon: Creates images with a cartoonish, animated style.</li>
                                    <li>Fantasy: Generates fantastical and imaginative scenes.</li>
                                    <li>Pixel: Produces images with a pixel art style, reminiscent of retro video games.</li>
                                    <li>Watercolor: Creates images that look like watercolor paintings.</li>
                                </ul>

                                <h3 className="text-xl font-semibold">What is the purpose of the "Negative Prompt" box?</h3>
                                <p>The Negative Prompt box allows you to specify elements you do not want in your generated image. For example, if you don't want cars or animals in your image, you can list them here.</p>

                                <h3 className="text-xl font-semibold">What does the "Seed" box do?</h3>
                                <p>The Seed box allows you to enter a specific seed number to reproduce the same image in future generations. If left blank, the app will generate a random seed for each image.</p>

                                <h3 className="text-xl font-semibold">How do I choose the aspect ratio?</h3>
                                <p>The aspect ratio determines the dimensions of your image. You can choose:</p>
                                <ul className="list-disc list-inside">
                                    <li>1:1: A square image.</li>
                                    <li>4:3: A standard landscape or portrait ratio.</li>
                                    <li>16:9: A widescreen ratio, ideal for cinematic or desktop backgrounds.</li>
                                </ul>

                                <h3 className="text-xl font-semibold">What is the "Ethnically Diverse" checkbox for?</h3>
                                <p>Checking this box ensures that the generated images include a diverse representation of people.</p>

                                <h2 className="text-2xl font-bold">How-To</h2>
                                <h3 className="text-xl font-semibold">Creating an Image</h3>
                                <ol className="list-decimal list-inside">
                                    <li>Select Model: Choose the model that suits your needs (Stable Diffusion, DALL-E 3, or ControlNet).</li>
                                    <li>Select Style: Pick a style from the dropdown menu (e.g., Artistic, Photorealistic, Cartoon).</li>
                                    <li>Enter Prompt: Type a detailed description of the image you want to create.</li>
                                    <li>Seed (Optional): Enter a seed number if you want to reproduce the image later.</li>
                                    <li>Negative Prompt (Optional): List any elements you want to exclude from the image.</li>
                                    <li>Choose Aspect Ratio: Select the aspect ratio that fits your desired output.</li>
                                    <li>Check Ethnically Diverse (Optional): If you want a diverse representation of people.</li>
                                    <li>Click Create: Generate your image.</li>
                                </ol>

                                <h3 className="text-xl font-semibold">Using ControlNet</h3>
                                <ol className="list-decimal list-inside">
                                    <li>Select ControlNet: From the model dropdown.</li>
                                    <li>Upload Reference Image: Click the upload button to choose your reference image.</li>
                                    <li>Enter Prompt: Describe how you want the final image to look.</li>
                                    <li>Adjust Settings: Choose the style, aspect ratio, and other settings.</li>
                                    <li>Click Create: Generate your modified or enhanced image.</li>
                                </ol>

                                <h3 className="text-xl font-semibold">Additional Tips</h3>
                                <ul className="list-disc list-inside">
                                    <li>Experiment with Prompts: Try different descriptions to see how the model responds.</li>
                                    <li>Use Detailed Descriptions: More detailed prompts usually yield better results.</li>
                                    <li>Combine Styles: Mix elements from different styles for unique images.</li>
                                    <li>Save Your Seeds: If you get an image you like, note the seed number for future use.</li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export {Faq};
