/* eslint-disable @next/next/no-img-element */
import { SlideShow } from "../../home/stack/SlideShow";
import { motion } from "framer-motion";
import { displayDate } from "../../../utils/displayDate";
import { DisplayReports } from "../../moderation/report/DisplayReports";
import { DocumentList } from "../document/DocumentList";
import { Post, Attribute, Report, Image, Document } from "@prisma/client";
import Link from "next/link";
import { DialogButton } from "../button/DialogButton";

export interface PostCardProps {
  post: Post & {
    attribute: Attribute | null;
    reports?: Report[];
  };
  onPostDelete?: () => Promise<void>;
  images: (Image & { url: string })[] | null | undefined;
  documents: (Document & { url: string })[] | null | undefined;
  onDocValidation?: (document: Document & { url: string }) => Promise<void>;
  updateLink?: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export const PostCard = ({
  post,
  onPostDelete,
  images,
  documents,
  onDocValidation,
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
                  : "Whatever"}{" "}
                - {post.attribute.size}m²
              </p>
              <p className="text-xl">{post.attribute.price}$/month</p>
            </div>
            <p>{post.attribute.location}</p>
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
              <p>Terrace: {post.attribute.terrace ? "✅" : "❌"}</p>
              <p>Smoker: {post.attribute.smoker ? "✅" : "❌"}</p>
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
      <DocumentList documents={documents} onValidation={onDocValidation} />
      <DisplayReports reports={post.reports} />
      {(isLoggedIn || isAdmin) && (
        <div
          className={`mt-10 flex ${
            onPostDelete ? "justify-between" : "justify-center"
          }`}
        >
          {updateLink && (
            <Link
              className="rounded bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
              href={updateLink.replace("[postId]", post.id)}
            >
              Update
            </Link>
          )}
          {onPostDelete && (
            <DialogButton
              buttonText="Delete my post"
              title="Delete my post"
              description="Are you sure you want to delete your post?"
              confirmButtonText="Yes, delete my post"
              onDelete={onPostDelete}
            />
          )}
        </div>
      )}
    </div>
  );
};
