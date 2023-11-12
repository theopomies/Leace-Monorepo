/* eslint-disable @next/next/no-img-element */
import { User } from "@prisma/client";
import { useEffect, useRef } from "react";

export interface UserImageProps {
  user: User;
  imagePreview?: string;
}

export const UserImage = ({ user, imagePreview }: UserImageProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bubbleRef.current) {
      const bubbleHeight = bubbleRef.current.clientHeight;
      const bubbleWidth = bubbleRef.current.clientWidth;
      const fontSize = bubbleHeight / 1.6; // Ajust

      bubbleRef.current.style.fontSize = `${fontSize}px`;
      if (bubbleHeight > bubbleWidth) {
        bubbleRef.current.style.width = `${bubbleHeight}px`;
      } else {
        bubbleRef.current.style.height = `${bubbleWidth}px`;
      }
    }
  }, [user]);

  return (
    <div
      ref={bubbleRef}
      className={`flex h-full flex-shrink-0 items-center justify-center rounded-full text-center ${
        !user.image && !imagePreview && "bg-indigo-500"
      }`}
    >
      {imagePreview ? (
        <img
          src={imagePreview}
          referrerPolicy="no-referrer"
          alt="image"
          className="mx-auto h-full rounded-full"
        />
      ) : user.image ? (
        <img
          src={user.image}
          referrerPolicy="no-referrer"
          alt="image"
          className="mx-auto h-full rounded-full"
        />
      ) : (
        user.firstName && (
          <span className="flex-grow rounded-full uppercase text-white">
            {user.firstName[0]}
          </span>
        )
      )}
    </div>
  );
};
