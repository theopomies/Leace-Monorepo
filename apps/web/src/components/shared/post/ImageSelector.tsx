import Image from "next/image";
import { useState } from "react";

interface ImageSelectorProps {
  images: string[];
}

export const ImageSelector = ({ images }: ImageSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="relative h-full">
      <div className="absolute inset-0 h-full w-4/5 p-6">
        <img
          alt="post"
          src={images[selectedImage]}
          className="h-full w-full rounded-2xl object-contain"
        />
      </div>

      <div className="absolute inset-y-0 right-0 flex w-1/5 flex-col gap-4 overflow-y-auto shadow-inner">
        {images.map((image, index) => (
          <img
            alt="post image"
            key={image}
            src={image}
            className="h-auto w-full rounded-xl"
            onClick={() => setSelectedImage(index)}
          />
        ))}
      </div>
    </div>
  );
};
