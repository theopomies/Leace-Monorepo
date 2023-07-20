import { DisplayReports } from "../../moderation/report/DisplayReports";
import { DocumentList } from "../document/DocumentList";
import { Post, Attribute, Report, Image, Document } from "@prisma/client";
import Link from "next/link";
import { DialogButton } from "../button/DialogButton";
import { ImageSelector } from "./ImageSelector";
import { SewingPinIcon } from "@radix-ui/react-icons";
import { IoPricetagsOutline } from "react-icons/io5";
import { RxDimensions } from "react-icons/rx";
import { LiaCouchSolid } from "react-icons/lia";
import { MdOutlineShower, MdOutlineBed } from "react-icons/md";
import { displayDate } from "../../../utils/displayDate";

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

const attributes = {
  terrace: "Terrace",
  pets: "Pet friendly",
  smoker: "Smoker friendly",
  disability: "Accessibility",
  garden: "Garden",
  parking: "Parking",
  elevator: "Elevator",
  pool: "Pool",
} as const as Record<keyof Attribute, string>;

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
  if (!post.attribute) return <h1>Something went wrong</h1>;

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-scroll rounded-lg bg-white p-8 shadow">
      <section>
        {images && images.length > 0 && (
          <div className="h-[40vh]">
            <ImageSelector images={images?.map((image) => image.url) ?? []} />
          </div>
        )}
        <div className="flex items-end justify-between">
          <div>
            {post.title && (
              <p className="py-2 text-xl font-semibold">{post.title} </p>
            )}
            <div className="flex items-center text-slate-400">
              <SewingPinIcon height={30} width={30} />
              <p className="text-lg font-medium">{post.attribute.location}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Posted on Leace on {displayDate(post.createdAt)}
          </p>
        </div>
        <div className="my-12 w-full border-t border-slate-200" />
        <div className="flex justify-between px-6">
          <div className="flex items-center gap-4 rounded-lg p-2">
            <div className="rounded-full bg-indigo-400 p-3 text-white shadow">
              <IoPricetagsOutline size={30} />
            </div>
            <div>
              <p className="text-slate-500">Rent</p>
              <p className="text-lg font-medium">
                {post.attribute.price} €
                <span className="text-sm font-light text-slate-400"> /mo</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg p-2">
            <div className="rounded-full bg-indigo-400 p-3 text-white shadow">
              <RxDimensions size={30} />
            </div>
            <div>
              <p className="text-slate-500">Size</p>
              <p className="text-lg font-medium">{post.attribute.size} m²</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg p-2">
            <div className="rounded-full bg-indigo-400 p-3 text-white shadow">
              <MdOutlineBed size={30} />
            </div>
            <div>
              <p className="text-slate-500">Bedrooms</p>
              <p className="text-lg font-medium">3</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg p-2">
            <div className="rounded-full bg-indigo-400 p-3 text-white shadow">
              <MdOutlineShower size={30} />
            </div>
            <div>
              <p className="text-slate-500">Bathrooms</p>
              <p className="text-lg font-medium">2</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg p-2">
            <div className="rounded-full bg-indigo-400 p-3 text-white shadow">
              <LiaCouchSolid size={30} />
            </div>
            <div>
              <p className="text-slate-500">Furnished</p>
              <p className="text-lg font-medium">
                {post.attribute.furnished ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4">
          <h2 className="pb-2 text-xl font-medium">Property details</h2>
          {!!post.desc && (
            <p className="rounded-lg border border-dashed border-slate-300 p-4">
              {post.desc}
            </p>
          )}
          <ul className="mt-6 gap-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
            {Object.entries(attributes).map(([key, value]) => {
              const postAttributes = post.attribute;
              if (!postAttributes) return null;

              const attribute = postAttributes[key as keyof Attribute];

              return (
                <li
                  className="mr-8 flex flex-grow gap-4 border-b border-indigo-300 py-2"
                  key={key}
                >
                  <h3 className="text-xl font-medium">{value}</h3>
                  {postAttributes && (
                    <p className={attribute !== null ? "" : " text-indigo-600"}>
                      {typeof attribute === "boolean"
                        ? attribute
                          ? "✅"
                          : "❌"
                        : typeof attribute === "number"
                        ? attribute
                        : typeof attribute === "string"
                        ? attribute
                        : typeof attribute === "object" && attribute !== null
                        ? displayDate(attribute)
                        : "Whatever"}{" "}
                      {value.toLowerCase().includes("price")
                        ? "€"
                        : value.toLowerCase().includes("surface")
                        ? "m²"
                        : ""}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <DocumentList documents={documents} onValidation={onDocValidation} />
        <DisplayReports reports={post.reports} />
      </section>
      {(isLoggedIn || isAdmin) && (
        <div className="mt-10 flex justify-center gap-4">
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
