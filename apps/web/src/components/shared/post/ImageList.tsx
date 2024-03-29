/* eslint-disable @next/next/no-img-element */
import { Button } from "../button/Button";
import { Image } from "@prisma/client";
import { CrossSvg } from "../icons/CrossSvg";

export interface ImageListProps {
  images: (Image & { url: string })[] | null | undefined;
  onDelete?: (imageId: string) => Promise<void>;
}

export const ImageList = ({ images, onDelete }: ImageListProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 pb-5">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <img src={image.url} alt="image" className="mx-auto h-32" />
          {onDelete && (
            <Button
              theme="danger"
              onClick={(e) => {
                e.preventDefault();
                onDelete(image.id);
              }}
              overrideStyles
              className="absolute -right-1 -top-1 inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 stroke-white p-1.5 hover:bg-red-700 "
            >
              <CrossSvg />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
