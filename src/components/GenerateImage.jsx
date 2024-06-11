import { useEffect, useRef } from "react";


const TransparentImage = ({ maskImageSrc, originalImage, setMask64Base }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }

      const originalImg = new Image();
      const maskImg = new Image();

      const reader = new FileReader();

      reader.onload = (e) => {
        originalImg.src = e.target?.result ;
      };
      reader.readAsDataURL(originalImage);

      originalImg.onload = () => {
        canvas.width = originalImg.width;
        canvas.height = originalImg.height;

        // Draw the original image
        ctx.drawImage(originalImg, 0, 0);

        maskImg.src = maskImageSrc;
        maskImg.onload = () => {
          const offscreenCanvas = document.createElement("canvas");
          const offscreenCtx = offscreenCanvas.getContext("2d");

          if (!offscreenCtx) {
            console.error("Failed to get offscreen canvas context");
            return;
          }

          offscreenCanvas.width = originalImg.width;
          offscreenCanvas.height = originalImg.height;

          // Draw the mask image onto the off-screen canvas
          offscreenCtx.drawImage(
            maskImg,
            0,
            0,
            originalImg.width,
            originalImg.height
          );

          const maskImageData = offscreenCtx.getImageData(
            0,
            0,
            originalImg.width,
            originalImg.height
          );
          const maskData = maskImageData.data;

          const originalImageData = ctx.getImageData(
            0,
            0,
            originalImg.width,
            originalImg.height
          );
          const originalData = originalImageData.data;

          for (let i = 0; i < maskData.length; i += 4) {
            if (
              maskData[i] >= 100 &&
              maskData[i + 1] >= 100 &&
              maskData[i + 2] >= 100
            ) {
              originalData[i + 3] = 0; // Setting image transparency to 0
            }
          }

          ctx.putImageData(originalImageData, 0, 0);
          setMask64Base(canvas.toDataURL("image/png"))
        };

        maskImg.onerror = (e) => {
          console.error("Failed to load mask image", e);
        };
      };

      originalImg.onerror = (e) => {
        console.error("Failed to load original image", e);
      };
    }
       const canvas = canvasRef?.current;
      const dataURL = canvas.toDataURL("image/png");
      setMask64Base(dataURL)
  }, [originalImage, maskImageSrc]);


  const handleDownload = () => {
    if (canvasRef.current) {
     const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL("image/png");
    }
  };

 

  return (
    <div className="text-center absolute mt-8  w-full h-full" >
        <canvas ref={canvasRef} className="border border-gray-300 hidden" />
        {/* <button className="bg-blue-500 py-1 px-2" onClick={handleDownload}>Download</button> */}
    </div>
  );
};

export default TransparentImage;
