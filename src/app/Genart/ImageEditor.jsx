import Image from 'next/image';
import EditImage from "../../components/EditImage";
import ImageDrop from '../../components/ImageDrop';

export function ImageEditor({userImage, setUserImage, updatedMaskedImage, setEditedImage}) {
  return (
 <>
      {!userImage && (
        <ImageDrop
          onImageDropped={setUserImage}
          userUploadedImage={userImage}
        />
      )}
      {userImage && (
        <EditImage setUpdatedImage={setEditedImage} removeFile={setUserImage} file={userImage} updateMaskedImage={updatedMaskedImage} />
      )}

      <div className="absolute top-4">
        {userImage && (
          <Image
            src={URL.createObjectURL(userImage)}
            alt="preview image"
            width={300}
            height={300}
            objectFit="contain"
            className="relative aspect-square "
          />
        )}
      </div>
 </> 
  );
}
