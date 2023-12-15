/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

interface ImageSelectorProps {
  images: string[];
}

export const ImageSelector = ({ images }: ImageSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return images.length > 0 ? (
    <div className="flex h-[40vh] gap-2">
      <div className="flex-grow">
        <img
          alt="post"
          src={images[selectedImage]}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {images.map((image, index) => (
          <img
            alt="post image"
            key={image}
            src={image}
            className="h-44 cursor-pointer rounded-lg object-cover"
            onClick={() => setSelectedImage(index)}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex h-[40vh] w-full items-center justify-center bg-gray-100 text-2xl text-indigo-500">
      <h1>No images</h1>
    </div>
  );
};
