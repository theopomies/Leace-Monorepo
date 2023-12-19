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
  MdConstruction,
  MdEuroSymbol,
} from "react-icons/md";
import { IconType } from "react-icons";
import { FaHouseFlag } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { attributesIcons } from "../icons/attributesIcons";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";

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
  isReduced?: boolean;
}

const details = {
  energyClass: "Energy class",
  constructionDate: "Built in",
  estimatedCosts: "Charge fees",
  nearestShops: "Nearest Shops",
} as const as Record<keyof Post, string>;

const detailsIcons = {
  energyClass: FaHouseFlag,
  constructionDate: MdConstruction,
  estimatedCosts: MdEuroSymbol,
  nearestShops: FaShoppingCart,
} as const as Record<keyof Post, IconType>;

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
  isReduced,
}: PostCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    if (isExpanded) {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  });

  if (!post.attribute) return <h1>Something went wrong</h1>;

  const formatValue = (
    key: keyof Post,
    value: string | number | boolean | Date | null,
  ): React.ReactNode => {
    if (value instanceof Date) {
      return value.getFullYear();
    }
    if (key === "estimatedCosts" && value === 0) {
      return "included";
    }
    const unit = getUnit(key);
    return `${value}${unit}`;
  };

  const getUnit = (key: keyof Post): string => {
    switch (key) {
      case "nearestShops":
        return "km";
      case "estimatedCosts":
        return "€";
      default:
        return "";
    }
  };

  const filterDetails = () => {
    return Object.entries(details)
      .map(([key, label]) => {
        const value = post[key as keyof Post] as
          | string
          | number
          | boolean
          | Date
          | null;

        return (
          (!!value || value === 0) && (
            <li className="flex flex-grow items-center gap-2" key={key}>
              {React.createElement(detailsIcons[key as keyof Post])}
              <h3 className="text-lg">
                {label}{" "}
                {formatValue(key as keyof Post, post[key as keyof Post])}
              </h3>
            </li>
          )
        );
      })
      .filter(Boolean);
  };

  const detailsList = filterDetails();

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-auto rounded-lg bg-white p-8 shadow">
      <ImageSelector images={images?.map((image) => image.url) ?? []} />
      <section>
        <div className="mt-4 flex items-end justify-between">
          <div>
            {post.title && (
              <h2 className="py-2 text-2xl font-medium">{post.title}</h2>
            )}
            <div className="flex items-center text-slate-400">
              <p className="text-lg font-medium">{post.attribute.location}</p>
              <SewingPinIcon height={30} width={30} />
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
        <div className="my-5 w-full border-t border-slate-200" />
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
              <p className="text-lg font-medium">{post.attribute.bedrooms}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg p-2">
            <div className="rounded-full bg-indigo-400 p-3 text-white shadow">
              <MdOutlineShower size={30} />
            </div>
            <div>
              <p className="text-slate-500">Bathrooms</p>
              <p className="text-lg font-medium">{post.attribute.bathrooms}</p>
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
        {isReduced && (
          <div
            className="mt-5 flex cursor-pointer justify-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {!isExpanded ? (
              <div className="rounded-full bg-indigo-400 p-1 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <IoIosArrowDropdownCircle size={30} />
              </div>
            ) : (
              <div className="rounded-full bg-indigo-400 p-1 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <IoIosArrowDropupCircle size={30} />
              </div>
            )}
          </div>
        )}
        {(!isReduced || isExpanded) && (
          <div className={`${!isReduced && "mt-10"} flex flex-col gap-10`}>
            {!!post.desc && (
              <div>
                <h2 className="py-4 text-3xl font-medium">Description</h2>
                <p className="rounded-lg border border-dashed border-slate-300 p-4">
                  {post.desc}
                </p>
              </div>
            )}
            <div>
              <h2 className="pt-4 text-3xl font-medium">Property details</h2>
              {detailsList.length > 0 && (
                <ul className="flex gap-4 border-b py-6 sm:flex sm:flex-wrap md:grid md:grid-cols-4">
                  {detailsList}
                </ul>
              )}
              <ul className="gap-4 py-6 sm:flex sm:flex-wrap md:grid md:grid-cols-4">
                {Object.entries(attributes).map(([key, value]) => {
                  if (!post.attribute) return null;

                  const attribute = post.attribute[key as keyof Attribute];

                  return (
                    <li className="flex flex-grow items-center gap-2" key={key}>
                      {React.createElement(
                        attributesIcons[key as keyof Attribute],
                      )}
                      <h3
                        className={`text-lg ${!attribute && " line-through"} `}
                      >
                        {value}
                      </h3>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
        {(isLoggedIn || isAdmin) && (
          <section>
            <h2 className="py-4 text-3xl font-medium">Documents</h2>
            {documents && documents.length > 0 ? (
              <DocumentList
                documents={documents}
                onValidation={onDocValidation}
              />
            ) : (
              <p className="text-indigo-600">
                No document available
                {isLoggedIn &&
                  ", please add any necessary documents by updating your profile"}
              </p>
            )}
          </section>
        )}
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
