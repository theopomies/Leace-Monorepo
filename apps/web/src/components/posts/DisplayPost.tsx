/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Attribute, Post } from "@prisma/client";
import { Header } from "../users/Header";
import Link from "next/link";
import { DeletePostButton } from "../users/posts/DeletePostButton";
import { motion } from "framer-motion";
import { SlideShow } from "../home/stack/SlideShow";
import { DeletePostImg } from "../shared/DeleteImgPost";
import { DocumentsList } from "../shared/document/DocumentsList";

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

type Document =
  | {
      url: string;
      id: string;
      userId: string | null;
      leaseId: string | null;
      postId: string | null;
      valid: boolean;
      ext: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  | undefined;

interface DisplayPostProps {
  post: Post;
  attribute: Attribute;
  images: Image;
  documents: Document;
  handleDeleteDoc: (documentId: string) => Promise<void>;
  userId: string;
}

export function DisplayPost({
  post,
  attribute,
  images,
  documents,
  handleDeleteDoc,
  userId,
}: DisplayPostProps) {
  if (!post) {
    return <div>Not found</div>;
  }

  return (
    <div className="w-full">
      <Header heading={post.title ?? "Annonce"} />
      <div className="flex justify-center">
        <div className="my-10 flex flex-col justify-center rounded-lg bg-white p-10 shadow">
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

          <div className="p-10">
            <div>
              <h2 className="text-xl">Lieu:</h2>
              <strong>{attribute.location}</strong>
            </div>
            <div className="my-4">
              <h2 className="text-xl">Type de logement:</h2>
              <strong>
                {attribute.homeType
                  ? attribute.homeType.charAt(0) +
                    attribute.homeType.slice(1).toLowerCase()
                  : "Whatever"}
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
              <div className="flex flex-grow pt-1">
                <div className="w-full">
                  <h2 className="text-xl">Monthly price:</h2>
                  <b>{attribute.price} €</b>
                </div>
                <div className="w-full">
                  <h2 className="text-xl">Size:</h2>
                  <b>{attribute.size} m²</b>
                </div>
              </div>
            </div>
            <h2 className="mt-4 text-xl">Description:</h2>
            <p className="pt-1">{post.desc}</p>
          </div>
          {post.createdById === userId && images && images.length > 0 && (
            <div className="border-t py-5 text-center">
              <h2 className="mb-5 text-xl">Images:</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image.url} alt="image" className="mx-auto h-32" />
                    <DeletePostImg postId={post.id} id={image.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {documents && documents.length > 0 && (
            <div className="border-t py-5 text-center">
              <h2 className="mb-5 text-xl">Documents:</h2>
              <DocumentsList
                documents={documents}
                handleDeleteDoc={handleDeleteDoc}
                isUserLogged={post.createdById === userId}
              />
            </div>
          )}
          <div className="mt-5 flex justify-center gap-6">
            {post.createdById === userId && (
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
  );
}
