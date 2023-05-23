/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { SlideShow } from "../../home/stack/SlideShow";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Documents } from "../documents";
import { displayDate } from "../../../utils/displayDate";
import { GreenCheck } from "./GreenCheck";
import { RedUncheck } from "./RedUncheck";
import { Loader } from "../../shared/Loader";
import { DisplayReports } from "../report/DisplayReports";
import { DeletePostImg } from "./DeletePostImg";

export interface PostProps {
  postId: string;
  setUserId?: (user: string) => void;
}

export const PostCard = ({ postId, setUserId }: PostProps) => {
  const { data: post, isLoading: postLoading } =
    trpc.moderation.post.getPost.useQuery({ postId });
  const { data: images } =
    trpc.moderation.image.getSignedPostUrl.useQuery(postId);

  useEffect(() => {
    if (post && setUserId) setUserId(post.createdById);
  }, [post, setUserId]);

  if (postLoading) return <Loader />;

  if (!post) return <p>Something went wrong</p>;

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
          <div className="border-blueGray-200 my-10 border-y py-10">
            <p className="text-gray-600">
              {post.desc ? post.desc : "Pas de description"}
            </p>
          </div>
          <div className="px-auto justify-center">
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
      <div className="border-blueGray-200 my-10 border-y py-10 text-center">
        {images && images.length > 0 ? (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.url} alt="image" className="mx-auto h-32" />
                <DeletePostImg postId={post.id} id={image.id} />
              </div>
            ))}
          </div>
        ) : (
          <p>No image</p>
        )}
      </div>
      <Documents postId={postId} />
      <DisplayReports reports={post.reports} />
    </div>
  );
};
