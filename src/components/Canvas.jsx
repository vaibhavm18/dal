import { useCallback, useEffect, useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function Canvas({ onDraw, userUploadedImage}) {
  const drawRef = useRef(null);

  const handleChange = useCallback(async () => {
    try {
      const paths = await drawRef.current?.exportPaths();

      if (paths && paths.length) {
        const data = await drawRef.current?.exportImage("jpeg");
        if (data) {
          onDraw(data);
        }
      }
    } catch (error) {
      console.error("Error exporting image:", error);
    }
  }, [onDraw]);

  useEffect(() => {
    if (userUploadedImage) {
      handleChange();
    }
  }, [userUploadedImage, handleChange]);

  return (
 <div className="w-[300px] h-[300px]"
 >
      {userUploadedImage && (
        <ReactSketchCanvas
          ref={drawRef}
          strokeWidth={18}
          strokeColor="white"
          canvasColor="transparent"
          onChange={handleChange}

        />
      )}
    </div>
  );
}
