import { useState } from "react";
import Canvas from "./Canvas";
import { Button } from "./ui/button";

import { base64ToFile } from "../lib/base64ToPng";
import GenerateImage from "./GenerateImage";

export default function EditImage({ file, removeFile, updateMaskedImage }) {
  const [maskImage, setMaskImage] = useState(null);
  const [mask64Base, setMask64Base] = useState(null);
  const startOver = (e, removeMask, removeFile) => {
    e.preventDefault();
    removeFile(null);
    removeMask(null);
  };

  return (
    <>
      <div
        className=" relative z-10"
        onMouseLeave={() => {
          if (mask64Base) {
            const maskFile = base64ToFile(mask64Base, "masked.png");
            updateMaskedImage(maskFile);
          }
        }}
      >
        <Canvas
          file={file}
          onDraw={setMaskImage}
          maskImage={maskImage}
          userUploadedImage={file}
        />
      </div>
      {maskImage && (
        <div className="">
          <Button
            onClick={(e) => {
              startOver(e, setMaskImage, removeFile);
            }}
            className="px-4 py-2 mt-4 bg-black text-white font-semibold rounded-md  focus:outline-none focus:ring-2 "
          >
            New Image
          </Button>
        </div>
      )}
      {maskImage && (
        <GenerateImage
          setMask64Base={setMask64Base}
          maskImageSrc={maskImage}
          originalImage={file}
        />
      )}
    </>
  );
}
