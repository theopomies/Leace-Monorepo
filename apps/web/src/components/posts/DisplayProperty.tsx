/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Attribute, Post } from "@prisma/client";
import { Header } from "../users/Header";
import Link from "next/link";
import { DeletePostButton } from "../users/posts/DeletePostButton";

interface DisplayPostProps {
  post: Post;
  attribute: Attribute;
}

export function DisplayPost({ post, attribute }: DisplayPostProps) {
  if (!post) {
    return <div>Not found</div>;
  }

  return (
    <div className="w-full ">
      <Header heading={post.title ?? "Annonce"} />
      <div className="flex justify-center">
        <div className="mx-12 flex justify-center rounded-lg bg-white p-12 shadow">
          <div>
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
            <div className="mt-10 flex justify-center gap-6">
              <Link
                className="rounded bg-indigo-500 py-3 px-4 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
                href={`/posts/${post.id}/update`}
              >
                Update
              </Link>
              <DeletePostButton postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
