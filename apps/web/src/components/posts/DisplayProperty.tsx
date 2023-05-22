/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Attribute, Post, Role } from "@prisma/client";
import { Header } from "../users/Header";
import Link from "next/link";
import { DeletePostButton } from "../users/posts/DeletePostButton";
import { motion } from "framer-motion";
import { SlideShow } from "../home/stack/SlideShow";
import { DeletePostImg } from "../shared/DeleteImgPost";

type Image =
  | {
      url: string;
      id: string;
      ext: string;
      postId: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[]
  | undefined;
interface DisplayPostProps {
  post: Post;
  attribute: Attribute;
  images: Image;
  role: Role | undefined;
}

export function DisplayPost({
  post,
  attribute,
  images,
  role,
}: DisplayPostProps) {
  if (!post) {
    return <div>Not found</div>;
  }

  return (
    <div className="w-full">
      <Header heading={post.title ?? "Annonce"} />
      <div className="flex justify-center">
        <div className="mx-12 flex justify-center rounded-lg bg-white p-12 shadow">
          <div>
            <div className="flex justify-center">
              {images && images.length > 0 && (
                <motion.div
                  layout
                  className="relative flex h-[500px] max-w-[2/3] overflow-hidden rounded-md bg-gray-100"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <SlideShow images={images.map((image) => image.url)} />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mb-4">
              <h2 className="text-xl">Lieu:</h2>
              <strong>{attribute.location}</strong>
            </div>
            <div className="my-4">
              <h2 className="text-xl">Type de logement:</h2>
              <strong>
                {attribute.house === true ? "Maison" : "Appartement"}
              </strong>
            </div>
            <div className="my-4">
              <h2 className="text-xl">Critères:</h2>
              <div className="flex flex-wrap gap-4">
                <p>Terrasse: {attribute.terrace ? "✅" : "❌"}</p>
                <p>Piscine: {attribute.pool ? "✅" : "❌"}</p>
                <p>Fumeur: {attribute.smoker ? "✅" : "❌"}</p>
                <p>Animal: {attribute.pets ? "✅" : "❌"}</p>
                <p>Accessible: {attribute.disability ? "✅" : "❌"}</p>
                <p>Garage: {attribute.parking ? "✅" : "❌"}</p>
                <p>Ascenseur: {attribute.elevator ? "✅" : "❌"}</p>
                <p>Jardin: {attribute.garden ? "✅" : "❌"}</p>
              </div>
            </div>
            <div className="my-4">
              <h2 className="center text-xl">Les chiffres</h2>
              <div className="flex flex-grow pt-1">
                <div className="w-full">
                  <h2>Le prix demandé:</h2>
                  <b>{attribute.price} €</b>
                </div>
                <div className="w-full">
                  <h2>Les charges:</h2>
                  <b>TODO €</b>
                </div>
                <div className="w-full">
                  <h2>Surface:</h2>
                  <b>{attribute.size} m²</b>
                </div>
              </div>
            </div>
            <h2 className="mt-4 text-xl">Description:</h2>
            <p className="pt-1">{post.desc}</p>
            <div className="border-blueGray-200 my-10 border-y py-10 text-center">
              {images && images.length > 0 ? (
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt="image"
                        className="mx-auto h-32"
                      />
                      <DeletePostImg postId={post.id} id={image.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No image</p>
              )}
            </div>
            <div className="mt-10 flex justify-center gap-6">
              {(role == Role.OWNER || role == Role.AGENCY) && (
                <>
                  <Link
                    className="rounded bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
                    href={`/posts/${post.id}/update`}
                  >
                    Update
                  </Link>
                  <DeletePostButton postId={post.id} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
