/* eslint-disable @next/next/no-img-element */
import { Button } from "../button/Button";
import { Image } from "@prisma/client";
import { CrossSvg } from "../icons/CrossSvg";

export interface ImagesListProps {
  images: (Image & { url: string })[] | undefined;
  OnDelete?: (imageId: string) => Promise<void>;
}

export const ImagesList = ({ images, OnDelete }: ImagesListProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="border-t py-5 text-center">
      <h2 className="mb-5 text-xl">Images:</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img src={image.url} alt="image" className="mx-auto h-32" />
            {OnDelete && (
              <Button
                theme="danger"
                onClick={() => OnDelete(image.id)}
                overrideStyles
                className="absolute -right-1 -top-1 inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 stroke-white p-1.5 hover:bg-red-700 "
              >
                <CrossSvg />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
