/* eslint-disable @next/next/no-img-element */
import { SlideShow } from "../../home/stack/SlideShow";
import { motion } from "framer-motion";
import { displayDate } from "../../../utils/displayDate";
import { GreenCheck } from "./GreenCheck";
import { RedUncheck } from "./RedUncheck";
import { DisplayReports } from "../report/DisplayReports";
import { ImagesList } from "../../shared/ImagesList";
import { DocumentsList } from "../../shared/document/DocumentsList";
import { Post, Attribute, Report, Image, Document } from "@prisma/client";

export interface PostCardProps {
  post: Post & {
    attribute: Attribute | null;
    reports: Report[];
  };
  images: (Image & { url: string })[] | undefined;
  OnImgDelete: (imageId: string) => Promise<void>;
  documents: (Document & { url: string })[] | undefined;
  OnDocDelete: (documentId: string) => Promise<void>;
  OnDocValidation: (document: Document & { url: string }) => Promise<void>;
}

export const PostCard = ({
  post,
  images,
  OnImgDelete,
  documents,
  OnDocDelete,
  OnDocValidation,
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
              <p className="text-2xl uppercase">{post.attribute.location}</p>
              <p className="text-2xl">{post.attribute.price}$/month</p>
            </div>
            <p className="text-2x">{post.attribute.size}m²</p>
            <p className="text-2x">
              Available on{" "}
              {post.attribute.rentStartDate &&
                displayDate(post.attribute.rentStartDate)}{" "}
              to{" "}
              {post.attribute.rentEndDate &&
                displayDate(post.attribute.rentEndDate)}
            </p>
            <p className="text-l">Posted on {displayDate(post.createdAt)}</p>
          </div>
          <div className="border-t py-10">
            <p className="text-gray-600">
              {post.desc ? post.desc : "Pas de description"}
            </p>
          </div>
          <div className="px-auto justify-center border-t py-10">
            <p className="bold mb-5 text-xl font-semibold">
              What this place offer
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-l">
                {post.attribute.terrace ? <GreenCheck /> : <RedUncheck />}
                Terrace
              </div>
              <p className="text-l">
                Elevator: {post.attribute.elevator ? "Yes" : "No"}
              </p>
              <div className="text-l">
                {post.attribute.smoker ? <GreenCheck /> : <RedUncheck />}
                Smoker
              </div>
              <p className="text-l">
                Pets: {post.attribute.pets ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      )}
      <ImagesList images={images} OnDelete={OnImgDelete} />
      <DocumentsList
        documents={documents}
        isLoggedInOrAdmin={true}
        OnDelete={OnDocDelete}
        OnValidation={OnDocValidation}
      />
      <DisplayReports reports={post.reports} />
    </div>
  );
};
