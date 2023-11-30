import { DisplayReports } from "../../moderation/report/DisplayReports";
import { DocumentList } from "../document/DocumentList";
import {
  Post,
  Attribute,
  Report,
  Image,
  Document,
  PostType,
} from "@prisma/client";
import Link from "next/link";
import { DialogButton } from "../button/DialogButton";
import { ImageSelector } from "./ImageSelector";
import { displayDate } from "../../../utils/displayDate";
import { Button } from "../button/Button";
import React from "react";
import { SewingPinIcon } from "@radix-ui/react-icons";
import { IoPricetagsOutline } from "react-icons/io5";
import { RxDimensions } from "react-icons/rx";
import { LiaCouchSolid } from "react-icons/lia";
import {
  MdOutlineShower,
  MdOutlineBed,
  MdPets,
  MdPool,
  MdSecurity,
  MdOutlineWifi,
  MdPark,
  MdDeck,
} from "react-icons/md";
import { IconType } from "react-icons";
import { TbDisabled } from "react-icons/tb";
import { LuCigarette, LuParkingCircle } from "react-icons/lu";
import { PiElevator } from "react-icons/pi";

export interface PostCardProps {
  post: Post & {
    attribute: Attribute | null;
    reports?: Report[];
  };
  onPostDelete?: () => Promise<void>;
  images: (Image & { url: string })[] | null | undefined;
  documents?: (Document & { url: string })[] | null | undefined;
  onDocValidation?: (document: Document & { url: string }) => Promise<void>;
  updateLink?: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onPause?: () => Promise<void>;
  onUnpause?: () => Promise<void>;
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
  securityAlarm: "Alarm / security",
  internetFiber: "Internet",
} as const as Record<keyof Attribute, string>;

const iconMappings = {
  terrace: MdDeck,
  pets: MdPets,
  smoker: LuCigarette,
  disability: TbDisabled,
  garden: MdPark,
  parking: LuParkingCircle,
  elevator: PiElevator,
  pool: MdPool,
  securityAlarm: MdSecurity,
  internetFiber: MdOutlineWifi,
} as const as Record<keyof Attribute, IconType>;

export const PostCard = ({
  post,
  onPostDelete,
  images,
  documents,
  onDocValidation,
  updateLink,
  isLoggedIn,
  isAdmin,
  onPause,
  onUnpause,
}: PostCardProps) => {
  if (!post.attribute) return <h1>Something went wrong</h1>;

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-auto rounded-lg bg-white p-8 shadow">
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
          <div className="flex gap-2">
            {post.certified && (
              <p className="m-auto rounded-full border border-green-500 p-0.5 px-1 text-xs text-green-500">
                Certified
              </p>
            )}
            <p className="text-sm text-slate-500">
              Posted on Leace on {displayDate(post.createdAt)}
            </p>
          </div>
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
          <ul className="gap-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
            <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
              <h3 className="text-xl font-medium">Energy class</h3>
              {post.energyClass ? post.energyClass : "Not specified"}
            </li>
            <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
              <h3 className="text-xl font-medium">GES</h3>
              {post.ges ? post.ges : "Not specified"}
            </li>
            <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
              <h3 className="text-xl font-medium">Construction date</h3>
              {post.constructionDate?.toDateString()
                ? post.constructionDate?.toDateString()
                : "Not specified"}
            </li>
          </ul>
          <ul className="gap-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
            <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
              <h3 className="text-xl font-medium">Estimated fees costs</h3>
              {post.estimatedCosts
                ? post.estimatedCosts + " $"
                : "Not specified"}
            </li>
            <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
              <h3 className="text-xl font-medium">Nearest shops</h3>
              {post.nearestShops ? post.nearestShops + " km" : "Not specified"}
            </li>
          </ul>
          <ul className="mt-6 gap-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
            {Object.entries(attributes).map(([key, value]) => {
              const postAttributes = post.attribute;
              if (!postAttributes) return null;

              const attribute = postAttributes[key as keyof Attribute];

              return (
                <li
                  className="my-2 flex flex-grow items-center gap-2"
                  key={key}
                >
                  {React.createElement(iconMappings[key as keyof Attribute])}
                  <h3 className={`text-xl ${!attribute && " line-through"} `}>
                    {value}
                  </h3>
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
          {post.type != PostType.HIDE ? (
            <Button
              title="Pause"
              onClick={onPause}
              className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700"
            >
              Pause
            </Button>
          ) : post.type == PostType.HIDE ? (
            <Button title="unpause" onClick={onUnpause} theme="success">
              Unpause
            </Button>
          ) : null}
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
