/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

interface ImageSelectorProps {
  images: string[];
}

export const ImageSelector = ({ images }: ImageSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageClass, setImageClass] = useState("object-cover");

  const getImageClass = (img: HTMLImageElement): void => {
    if (img.height > img.width) {
      setImageClass("object-contain");
    } else {
      setImageClass("object-cover");
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = images[selectedImage] ?? "";

    img.onload = () => {
      getImageClass(img);
    };
  }, [selectedImage, images]);

  return images.length > 0 ? (
    <div className="flex h-[44vh] min-w-[114vh] gap-2">
      <div className="flex-grow">
        <img
          alt="post"
          src={images[selectedImage]}
          className={`h-full w-full rounded-lg bg-gray-100 ${imageClass}`}
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
    <div className="flex h-[40vh] w-full items-center justify-center rounded-lg bg-gray-100 text-2xl text-indigo-500">
      <h1>No images</h1>
    </div>
  );
};
