"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Dropzone } from "../../components/ui/dropzone";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Textarea } from "../../components/ui/textarea";
import { ImageEditor } from "./ImageEditor";
import { Faq } from "./faq";

function CustomCheckbox({ id, label, onChange }) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleCheckboxChange}
        className="form-checkbox"
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

// Component to display images or a loading skeleton

export default function Component() {
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000)); // Random seed initialization

  const [file, setFile] = useState(undefined);
  // Dall-e-2 Editing image
  const [originalImage, setOriginalImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);

  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(""); // State for prompt input
  const [negativePrompt, setNegativePrompt] = useState(""); // State for negative prompt input
  const [model, setModel] = useState(""); // State for selected model
  const [style, setStyle] = useState(""); // State for selected style
  const [numImages, setNumImages] = useState(1); // State for number of images
  const [isEthicallyDiverse, setIsEthicallyDiverse] = useState(false); // State for the ethically diverse checkbox
  const [aspectRatio, setAspectRatio] = useState("1024x1024"); // State for selected aspect ratio
  const [error, setError] = useState({ file: "", prompt: "" });
  const [isCopied, setIsCopied] = useState(false);
  // Function to generate a random seed
  const generateRandomSeed = () => Math.floor(Math.random() * 1000000);

  // State for the displayed seed value in the input
  const [displayedSeed, setDisplayedSeed] = useState("");

  // Actual seed value to use in the backend
  const [actualSeed, setActualSeed] = useState(generateRandomSeed());

  // Handler for when the seed input changes
  const handleSeedChange = (event) => {
    const inputSeed = event.target.value;
    setDisplayedSeed(inputSeed); // Update displayed seed
    if (inputSeed === "" || /^\d+$/.test(inputSeed)) {
      // Allow only numbers or empty string
      setActualSeed(
        inputSeed === "" ? generateRandomSeed() : parseInt(inputSeed, 10)
      );
    }
  };

  // Handler to update prompt state and clear prompt error if text is entered
  // Handler for when the seed input changes

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
    if (event.target.value.trim() !== "") {
      setError((prev) => ({ ...prev, prompt: "" }));
    }
  };

  const ImagesDisplay = ({ isLoading, images }) => {
    const [activeImage, setActiveImage] = useState(null);

    const toggleImageView = (imageUrl) => {
      if (activeImage === imageUrl) {
        // Hide the overlay and remove the active image
        setActiveImage(null);
      } else {
        // Show the overlay with the new image
        setActiveImage(imageUrl);
      }
    };

    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          {Array.from({ length: numImages }).map((_, index) => (
            <div key={index} className="bg-gray-300 h-48 rounded-md"></div>
          ))}
        </div>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-1 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                alt={`Generated image ${index + 1}`}
                className="w-full h-auto rounded-md"
                src={imageUrl}
                onClick={() => toggleImageView(imageUrl)}
                style={{ objectFit: "cover" }}
              />
              <Button
                onClick={() => handleDownload(imageUrl, index)}
                className="mt-2"
              >
                <DownloadIcon className="w-6 h-6" />
              </Button>
            </div>
          ))}
        </div>
        {activeImage && (
          <div
            id="js-overlay"
            className="p-4 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 border-b-gray-600"
            onClick={() => toggleImageView(null)}
          >
            <img
              src={activeImage}
              className="max-w-full max-h-full border-8 border-gray-600 rounded-lg"
              alt="Active"
            />
          </div>
        )}
      </div>
    );
  };

  // Function to handle file upload and clear file error if file is provided
  const handleFileChange = (file) => {
    setFile(file);
    if (file) {
      setError((prev) => ({ ...prev, file: "" }));
    }
  };

  // Handler to create images, with added validation

  // Verify component mount
  useEffect(() => {
    console.log("Component mounted");
  }, []);

  // Handler to update negative prompt state
  const handleNegativePromptChange = (event) => {
    setNegativePrompt(event.target.value);
  };

  // Handler to update model state
  const handleModelChange = (value) => {
    setModel(value);
    if (value) {
      setError((prev) => ({ ...prev, model: "" }));
    }
  };

  // Handler to update style state
  const handleStyleChange = (value) => {
    setStyle(value);
  };

  // Handler to update number of images
  const handleNumImagesChange = (value) => {
    setNumImages(value[0]);
  };

  // Handler to update aspect ratio
  const handleAspectRatioChange = (value) => {
    setAspectRatio(value);
  };

  // Handler to create images
  const handleCreate = async () => {
    let errorFlag = false;
    let errors = { file: "", prompt: "", model: "" };

    // Check if a model is selected
    if (!model) {
      errors.model = "Please select a model";
      errorFlag = true;
    }

    // Check if a file is needed and provided
    if (model === "ControlNet" && !file) {
      errors.file = "Please upload an image";
      errorFlag = true;
    }

    if (model === "dall-e-2" && !originalImage) {
      errors.file = "Please upload an image";
      errorFlag = true;
    }

    // Check if a prompt is provided
    if (!prompt) {
      errors.prompt = "Please include a prompt";
      errorFlag = true;
    }

    // If any errors, update the state and stop processing
    if (errorFlag) {
      setError(errors);
      return;
    }

    setIsLoading(true);
    try {
      let imageDataURL = null;
      if (file) {
        imageDataURL = await readAsDataURL(file); // Convert file to Data URL
      }

      const isControlNetWithFile = model === "ControlNet" && file;
      const endpoint =
        file || isControlNetWithFile || model === "ControlNet"
          ? "/api/generate"
          : model === "dall-e-2"
          ? "/api/dall-e-2"
          : model === "dall-e-3"
          ? "/api/dalle-3"
          : model === "stable-diffusion"
          ? "/api/sdxl"
          : "/api/generate";

      let finalPrompt = `${prompt}`; // Initial prompt
      if (isEthicallyDiverse) {
        finalPrompt = `${finalPrompt}, ethnically diverse`; // Add ethically diverse context
      }
      finalPrompt = `${finalPrompt} in ${style} style`; // Append style to prompt
      console.log(finalPrompt);

      const [width, height] = aspectRatio.split("x").map(Number);

      const response = await axios.post(endpoint, {
        image: imageDataURL, // Use the converted Data URL
        prompt: finalPrompt,
        negative_prompt: negativePrompt,
        num_images: numImages, // Send number of images
        width: width, // Send width
        height: height, // Send height
        size: aspectRatio, // Send aspect ratio
        seed: actualSeed, // Send seed
      });

      setGeneratedImages(
        response.data.imageUrls || [response.data.imageUrl] || [
            "/placeholder.svg",
          ]
      );
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error", error.message);
      }
    }
    setIsLoading(false);
  };

  async function handleEditImage() {
    if (!originalImage) {
      return;
    }

    if (!maskImage) {
      alert("Please mark the image");
      return;
    }

    if (!prompt) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("originalImage", originalImage);
    formData.append("maskImage", maskImage);
    formData.append("prompt", prompt);

    try {
      const res = await axios.post("/api/dall-e-2", formData);
      setEditedImage(res.data.url);
      await handleDownload(res.data.url);
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  }

  function copySeedToClipboard() {
    navigator.clipboard.writeText(seed.toString()).then(
      () => {
        console.log("Seed copied to clipboard!");
        setIsCopied(true); // Set copy status to true
        setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
      },
      (err) => {
        console.error("Failed to copy seed:", err);
      }
    );
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleDownload(imageUrl, index) {
    try {
      const response = await axios.post(
        "/api/download",
        { imageUrl },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `generated-image-${index + 1}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row max-w-5xl mx-auto my-8 space-y-8 lg:space-y-0">
        <div className="flex flex-col w-full lg:w-1/2 p-4 space-y-6 bg-white border rounded-lg lg:rounded-l-lg">
          <Link href="/">
            <img
              alt="DDD logo"
              className="h-10 object-cover"
              src="/dlogo.png"
            />
          </Link>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="Model">Model</Label>
              <Select onValueChange={handleModelChange}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stable-diffusion">
                    Stable Diffusion
                  </SelectItem>
                  <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                  <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                  <SelectItem value="ControlNet">ControlNet</SelectItem>
                </SelectContent>
              </Select>
              {error.model && (
                <div style={{ color: "red", fontSize: "0.75rem" }}>
                  {error.model}
                </div>
              )}
            </div>
            {model === "ControlNet" && (
              <div className="space-y-2">
                <Label htmlFor="product-image">Product Image</Label>
                <Dropzone
                  width={200}
                  height={200}
                  value={file}
                  onChange={(file) => {
                    setFile(file);
                  }}
                />
                {error.file && (
                  <div style={{ color: "red", fontSize: "0.75rem" }}>
                    {error.file}
                  </div>
                )}
              </div>
            )}
            {model === "dall-e-2" && (
              <div className="relative flex flex-col space-y-2">
                <Label>Image</Label>
                <ImageEditor
                  setUserImage={setOriginalImage}
                  userImage={originalImage}
                  updatedMaskedImage={setMaskImage}
                />
                {error.file && (
                  <div style={{ color: "red", fontSize: "0.75rem" }}>
                    {error.file}
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="Style">Style</Label>
              <Select onValueChange={handleStyleChange}>
                <SelectTrigger id="image-style">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Artistic">Artistic</SelectItem>
                  <SelectItem value="Photorealistic">Photorealistic</SelectItem>
                  <SelectItem value="Cartoon">Cartoon</SelectItem>
                  <SelectItem value="Fantasy art">Fantasy</SelectItem>
                  <SelectItem value="Pixel art">Pixel</SelectItem>
                  <SelectItem value="Watercolor">Watercolor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {["stable-diffusion"].includes(model) && (
              <div className="space-y-2">
                <Label htmlFor="num-images">Number of Images</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="num-images"
                    min={1}
                    max={4}
                    step={1}
                    value={[numImages]}
                    onValueChange={handleNumImagesChange}
                  />
                  <span>{numImages}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                onChange={handlePromptChange}
                value={prompt}
                id="prompt"
                placeholder="Enter a detailed description of your desired image scene"
              />
              {error.prompt && (
                <div style={{ color: "red", fontSize: "0.75rem" }}>
                  {error.file}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Seed</Label>
              <Input
                type="text"
                id="seed"
                placeholder="Enter seed or leave blank for random"
                onChange={handleSeedChange}
                value={displayedSeed}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="negative-prompt">Negative Prompt</Label>
              <Textarea
                id="negative-prompt"
                value={negativePrompt}
                onChange={handleNegativePromptChange}
                placeholder="Specify elements to exclude from the image (e.g., 'no cars, no animals')"
              />
            </div>
            {model !== "ControlNet" && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                <RadioGroup
                  defaultValue="1024x1024"
                  onValueChange={handleAspectRatioChange}
                >
                  {model === "dall-e-3" ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1024x1024" id="aspect-ratio-1" />
                        <Label htmlFor="aspect-ratio-1">1:1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1792x1024" id="aspect-ratio-2" />
                        <Label htmlFor="aspect-ratio-2">16:9</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1024x1792" id="aspect-ratio-3" />
                        <Label htmlFor="aspect-ratio-3">9:16</Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1024x1024" id="aspect-ratio-1" />
                        <Label htmlFor="aspect-ratio-1">1:1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1024x768" id="aspect-ratio-2" />
                        <Label htmlFor="aspect-ratio-2">4:3</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1024x576" id="aspect-ratio-3" />
                        <Label htmlFor="aspect-ratio-3">16:9</Label>
                      </div>
                    </>
                  )}
                </RadioGroup>
              </div>
            )}
            <CustomCheckbox
              id="ethically-diverse"
              label="Ethnically Diverse"
              onChange={(checked) => setIsEthicallyDiverse(checked)}
            />
          </div>
          <Button
            className="w-full bg-black hover:bg-blue-600 text-white"
            onClick={model === "dall-e-2" ? handleEditImage : handleCreate}
          >
            Create
          </Button>
        </div>
        {originalImage && (
          <div className="w-[350px] h-[350px]">
            <Image
              width={300}
              height={300}
              src={URL.createObjectURL(originalImage)}
            />
          </div>
        )}
        <div className="relative w-full lg:w-1/2 p-4 space-y-6 bg-white border rounded-lg lg:rounded-r-lg">
          {!isLoading && generatedImages.length > 0 && (
            <div className="flex justify-between items-center">
              <span>Seed: {seed}</span>
              <Button onClick={copySeedToClipboard}>
                {isCopied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="green"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                )}
              </Button>
            </div>
          )}
          <Suspense
            fallback={
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 h-48 rounded-md"
                  ></div>
                ))}
              </div>
            }
          >
            <ImagesDisplay isLoading={isLoading} images={generatedImages} />
          </Suspense>
        </div>
      </div>
      <div className="flex justify-end max-w-5xl mx-auto my-8 ">
        <Faq />
      </div>
    </>
  );
}

function DownloadIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}
