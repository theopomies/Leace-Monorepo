/* eslint-disable @next/next/no-img-element */
import { SlideShow } from "../../home/stack/SlideShow";
import { motion } from "framer-motion";
import { displayDate } from "../../../utils/displayDate";
import { GreenCheck } from "../../moderation/post/GreenCheck";
import { RedUncheck } from "../../moderation/post/RedUncheck";
import { DisplayReports } from "../../moderation/report/DisplayReports";
import { ImagesList } from "./ImagesList";
import { DocumentsList } from "../document/DocumentsList";
import { Post, Attribute, Report, Image, Document } from "@prisma/client";
import Link from "next/link";
import { Button } from "../button/Button";

export interface PostCardProps {
  post: Post & {
    attribute: Attribute | null;
    reports?: Report[];
  };
  OnPostDelete: () => Promise<void>;
  images: (Image & { url: string })[] | undefined;
  OnImgDelete: (imageId: string) => Promise<void>;
  documents: (Document & { url: string })[] | undefined;
  OnDocDelete: (documentId: string) => Promise<void>;
  OnDocValidation?: (document: Document & { url: string }) => Promise<void>;
  updateLink: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export const PostCard = ({
  post,
  OnPostDelete,
  images,
  OnImgDelete,
  documents,
  OnDocDelete,
  OnDocValidation,
  updateLink,
  isLoggedIn,
  isAdmin,
}: PostCardProps) => {
  return (
    <div className="flex w-full flex-col overflow-auto rounded-lg bg-white p-8 shadow">
      {post.title && (
        <p className="mb-2 text-3xl font-semibold">{post.title}</p>
      )}
      <div className="flex justify-center">
        {images && images.length > 0 && (
          <motion.div
            layout
            className="relative flex h-[500px] max-w-[2/3] overflow-hidden rounded-md"
          >
            <div className="flex h-full w-full items-center justify-center">
              <SlideShow images={images.map((image) => image.url)} />
            </div>
          </motion.div>
        )}
      </div>
      {post.attribute && (
        <div className="mt-2">
          <div className="py-10">
            <div className="flex justify-between">
              <p className="text-xl">
                {post.attribute.homeType
                  ? post.attribute.homeType.charAt(0) +
                    post.attribute.homeType.slice(1).toLowerCase()
                  : "Whatever"}
              </p>
              <p className="text-xl">{post.attribute.price}$/month</p>
            </div>
            <p>{post.attribute.size}m²</p>
            <p>{post.attribute.location}</p>
            <p>
              Available on{" "}
              {post.attribute.rentStartDate &&
                displayDate(post.attribute.rentStartDate)}{" "}
              to{" "}
              {post.attribute.rentEndDate &&
                displayDate(post.attribute.rentEndDate)}
            </p>
            <p>Posted on {displayDate(post.createdAt)}</p>
          </div>
          <div className="border-t py-10">
            <p className="text-gray-600">
              {post.desc ? post.desc : "Pas de description"}
            </p>
          </div>
          <div className="px-auto justify-center border-t py-10">
            <p className="mb-5 text-xl font-semibold">What this place offer</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                {post.attribute.terrace ? <GreenCheck /> : <RedUncheck />}
                Terrace
              </div>
              <div>
                {post.attribute.smoker ? <GreenCheck /> : <RedUncheck />}
                Smoker
              </div>
              <p>Elevator: {post.attribute.elevator ? "✅" : "❌"}</p>
              <p>Pets: {post.attribute.pets ? "✅" : "❌"}</p>
              <p>Piscine: {post.attribute.pool ? "✅" : "❌"}</p>
              <p>Accessible: {post.attribute.disability ? "✅" : "❌"}</p>
              <p>Garage: {post.attribute.parking ? "✅" : "❌"}</p>
              <p>Jardin: {post.attribute.garden ? "✅" : "❌"}</p>
            </div>
          </div>
        </div>
      )}
      {(isLoggedIn || isAdmin) && (
        <ImagesList images={images} OnDelete={OnImgDelete} />
      )}
      <DocumentsList
        documents={documents}
        isLoggedInOrAdmin={isLoggedIn || isAdmin}
        OnDelete={OnDocDelete}
        OnValidation={OnDocValidation}
      />
      {isAdmin && <DisplayReports reports={post.reports} />}
      {isLoggedIn && (
        <div className="flex justify-between">
          <>
            <Link
              className="rounded bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
              href={updateLink.replace("[postId]", post.id)}
            >
              Update
            </Link>
            <Button theme="danger" onClick={OnPostDelete}>
              Delete
            </Button>
          </>
        </div>
      )}
    </div>
  );
};
