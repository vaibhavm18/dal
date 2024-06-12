import { Dropzone } from "./ui/dropzone";

const ImageDrop = ({ onImageDropped }) => {
  const handelFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      // Convert the canvas content to a PNG blob
      canvas.toBlob((blob) => {
        const pngFile = new File([blob], "convertedImage.png", {
          type: 'image/png',
        });
        onImageDropped(pngFile);
      }, 'image/png');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

  return <Dropzone className="max-w-48" onChange={handelFile} />;
};

export default ImageDrop;
