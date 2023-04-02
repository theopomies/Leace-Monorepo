/* eslint-disable @next/next/no-img-element */
import { DeleteImgButton } from "../DeleteImgButton";
import { trpc } from "../../../utils/trpc";
import { SlideShow } from "../../stack/SlideShow";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Documents } from "../documents";
import { displayDate } from "../../../utils/displayDate";
import { GreenCheck } from "./GreenCheck";
import { RedUncheck } from "./RedUncheck";

export interface PostProps {
  postId: string;
  setUserId?: (user: string) => void;
}

export const PostCard = ({ postId, setUserId }: PostProps) => {
  const { data: post } = trpc.moderation.getPost.useQuery({ postId: postId });
  const { data: images } = trpc.image.getSignedPostUrl.useQuery(postId);

  useEffect(() => {
    if (post && setUserId) setUserId(post.createdById);
  }, [post, setUserId]);

  return (
    <div className="flex w-full flex-col overflow-auto rounded-lg bg-white p-8 shadow">
      {post && (
        <>
          {post.title && (
            <p className="mb-2 text-3xl font-semibold">{post.title}</p>
          )}
          <motion.div
            layout
            className="relative flex items-center justify-center overflow-hidden rounded-md bg-gray-100"
          >
            {/* for example */}
            <SlideShow
              images={[
                "https://ca-times.brightspotcdn.com/dims4/default/b13999c/2147483647/strip/false/crop/2000x1310+0+0/resize/1486x973!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F64%2Ffa%2Fc73b21106f904cb4a6893bedbe7c%2Fla-home-of-the-week-20180425-005",
                "https://foreignbuyerswatch.com/wp-content/uploads/2019/07/Capture-d%E2%80%99e%CC%81cran-2019-07-26-a%CC%80-13.14.52.png",
              ]}
            />
          </motion.div>
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
                    <img
                      src={image.url}
                      alt="image"
                      className="mx-auto h-32 shadow-xl"
                    />
                    <DeleteImgButton postId={post.id} id={image.id} />
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucune image</p>
            )}
          </div>
          <Documents postId={postId} />
          {post.reports.length > 0 && (
            <div className="px-10">
              <p className="mb-2 text-lg">Signalements :</p>
              <div className="flex flex-wrap gap-4">
                {post.reports.map((report, index) => (
                  <p key={index} className="text-lg">
                    Le {displayDate(report.createdAt)}, {report.createdById} a
                    signalé ce post pour {report.reason}
                  </p>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
