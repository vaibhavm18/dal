import { Dropzone } from "./ui/dropzone";


const ImageDrop = ({
  onImageDropped,
}) => {
  return (
    <Dropzone className="max-w-48" onChange={onImageDropped} />
  );
};

export default ImageDrop;
