import { User, Document, Role, Attribute, Report } from "@prisma/client";
import { Button } from "../button/Button";
import Link from "next/link";
import { DialogButton } from "../button/DialogButton";
import { DocumentList } from "../document/DocumentList";
import { displayDate } from "../../../utils/displayDate";
import { UserLayout } from "./UserLayout";
import { DisplayReports } from "../../moderation/report/DisplayReports";
import { UserImage } from "./UserImage";
import React from "react";
import { attributesIcons } from "../icons/attributesIcons";
import { IconType } from "react-icons";
import { IoBed } from "react-icons/io5";
import {
  MdShower,
  MdEuroSymbol,
  MdOutlineLocationSearching,
  MdHomeWork,
} from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdResize } from "react-icons/io";

export interface UserCardProps {
  user: User & {
    attribute: Attribute | null;
    reports?: Report[];
  };
  isBanned?: boolean;
  onUserDelete: () => void;
  documents?: (Document & { url: string })[] | null | undefined;
  onDocValidation?: (document: Document & { url: string }) => Promise<void>;
  updateLink?: string;
  isLoggedUser?: boolean;
  isAdmin?: boolean;
}

const details = {
  location: "Location",
  range: "Range",
  minPrice: "Min price",
  maxPrice: "Max price",
  minSize: "Min surface",
  maxSize: "Max surface",
  minBedrooms: "Min bedrooms",
  maxBedrooms: "Max bedrooms",
  minBathrooms: "Min bathrooms",
  maxBathrooms: "Max bathrooms",
  homeType: "House type",
} as const as Record<keyof Attribute, string>;

export const detailsIcons = {
  location: FaLocationDot,
  range: MdOutlineLocationSearching,
  minPrice: MdEuroSymbol,
  minSize: IoMdResize,
  minBedrooms: IoBed,
  minBathrooms: MdShower,
  homeType: MdHomeWork,
} as const as Record<keyof Attribute, IconType>;

const attributes = {
  furnished: "Furnished",
  terrace: "Terrace",
  pets: "Pet friendly",
  smoker: "Smoker friendly",
  disability: "Disability friendly",
  garden: "Garden",
  parking: "Parking",
  elevator: "Elevator",
  pool: "Pool",
} as const as Record<keyof Attribute, string>;

const userSituation = {
  job: "Job",
  employmentContract: "Type of contract",
  income: "Annual salary",
  creditScore: "Credit score",
  maritalStatus: "Family situation",
} as const as Record<keyof User, string>;

export function UserCard({
  user,
  isBanned = false,
  onUserDelete,
  documents,
  onDocValidation,
  updateLink,
  isLoggedUser,
  isAdmin = false,
}: UserCardProps) {
  return (
    <UserLayout
      className={onDocValidation ? "" : "m-10"}
      sidePanel={
        <>
          <div className="relative h-40 w-40">
            <div
              className={
                "relative h-full w-full overflow-hidden rounded-full shadow-xl" +
                (isBanned
                  ? " border-2 border-red-600"
                  : user.isPremium
                  ? " border-2 border-yellow-300"
                  : "")
              }
            >
              <UserImage user={user} />
              {isBanned && (
                <div className="absolute right-0 top-[20%] w-full translate-x-[25%] rotate-45 bg-red-600 px-2 text-center font-bold text-white">
                  Banned
                </div>
              )}
            </div>
          </div>
          {(isLoggedUser || isAdmin) && (
            <div className="flex gap-4">
              <DialogButton
                buttonText="Delete"
                title="Confirm Account Deletion"
                description="Are you sure you want to delete your Leace account ?"
                confirmButtonText="Yes, Delete my account"
                onDelete={async () => onUserDelete()}
              />
              {updateLink && (
                <Link href={updateLink.replace("[userId]", user.id)}>
                  <Button>Update</Button>
                </Link>
              )}
            </div>
          )}
        </>
      }
      mainPanel={
        <div className="flex flex-grow flex-col gap-8">
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-semibold">
              {isLoggedUser
                ? "Your Profile"
                : `${user.firstName} ${user.lastName}`}
            </h1>
            <div className="flex gap-2">
              {user.isPremium && (
                <p className="m-auto rounded-full border border-yellow-500 p-0.5 px-1 text-xs text-yellow-500">
                  Premium
                </p>
              )}
              {user.certified && (
                <p className="m-auto rounded-full border border-indigo-500 p-0.5 px-1 text-xs text-indigo-500">
                  Certified
                </p>
              )}
              <h2 className="text-sm font-medium text-slate-500">
                Member since: <i>{user.createdAt.toDateString()}</i>
              </h2>
            </div>
          </div>
          {isLoggedUser && (
            <p className="text-sm text-slate-500">
              These informations will be shared across Leace to help build trust
              and find you suitable prospects.
            </p>
          )}
          <section>
            <h2 className="py-4 text-3xl font-medium">
              About {isLoggedUser ? "You" : user.firstName}
            </h2>
            <p className=" rounded-lg border border-dashed border-slate-300 p-4">
              {user.description || (
                <span className="text-indigo-600">
                  {isLoggedUser
                    ? "Please add a description by updating your profile"
                    : "Not specified"}
                </span>
              )}
            </p>
            <ul className="flex flex-wrap gap-4 pt-4">
              <li className="flex-grow pr-8">
                <h3 className="text-xl font-medium">Country</h3>
                <p className={user.country ? "" : " text-indigo-600"}>
                  {user.country ??
                    (isLoggedUser
                      ? "Please add your country by updating your profile"
                      : "Not specified")}
                </p>
              </li>
              <li className="flex-grow">
                <h3 className="text-xl font-medium">Birthdate</h3>
                <p className={user.birthDate ? "" : " text-indigo-600"}>
                  {user.birthDate
                    ? displayDate(user.birthDate)
                    : isLoggedUser
                    ? "Please add your birthdate by updating your profile"
                    : "Not specified"}
                </p>
              </li>
            </ul>
          </section>
          {(isLoggedUser || isAdmin) && (
            <section>
              <h2 className="py-4 text-3xl font-medium">
                Contact Informations
              </h2>
              <ul className="flex flex-wrap gap-4">
                <li className="flex-grow pr-8">
                  <div className="flex gap-2">
                    <h3 className="text-xl font-medium">Email</h3>
                    <p
                      className={
                        "text-xs " +
                        (user.emailVerified ? "text-green-400" : "text-red-600")
                      }
                    >
                      {user.emailVerified ? "verified" : "Not Verified"}
                    </p>
                  </div>
                  <p>{user.email}</p>
                </li>
                <li className="flex-grow">
                  <h3 className="text-xl font-medium">Phone</h3>
                  <p className={user.phoneNumber ? "" : " text-indigo-600"}>
                    {user.phoneNumber ??
                      "Please add a phone number by updating your profile"}
                  </p>
                </li>
              </ul>
            </section>
          )}
          {user.role === Role.TENANT && user.attribute && (
            <section>
              <h2 className="pt-4 text-3xl font-medium">Situation</h2>
              <ul className="gap-4 py-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
                {Object.entries(userSituation).map(([key, value]) => {
                  const attribute = user[key as keyof User];

                  return (
                    <li className="flex-grow items-center gap-2" key={key}>
                      <h3 className="text-lg">{value}</h3>
                      {user.attribute && (
                        <p className={`${!attribute && "text-indigo-500"}`}>
                          {attribute
                            ? (attribute as string | number)
                            : isLoggedUser
                            ? "Please add your job by updating your profile"
                            : "Not specified"}
                          {value.toLowerCase().includes("salary") && attribute
                            ? "€"
                            : ""}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          {user.role === Role.TENANT && user.attribute && (
            <section>
              <h2 className="pt-4 text-3xl font-medium">Preferences</h2>
              <ul className="gap-4 py-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
                {Object.entries(details).map(([key, value]) => {
                  const userAttributes = user.attribute;
                  if (!userAttributes || key.startsWith("max")) return null;

                  const attribute = userAttributes[key as keyof Attribute];

                  let displayValue = attribute as string | number;

                  let cleanValue = value;

                  if (key.startsWith("min")) {
                    const maxKey = key.replace("min", "max") as keyof Attribute;
                    const minValue = attribute ?? 0;
                    const maxValue = userAttributes[maxKey] ?? "∞";

                    cleanValue = key.replace(/^(min|max)/, "");
                    displayValue = `${minValue} - ${maxValue}`;
                  }

                  return (
                    <li className="flex flex-grow items-center gap-2" key={key}>
                      {React.createElement(
                        detailsIcons[key as keyof Attribute],
                      )}
                      <h3 className="text-lg">{cleanValue}</h3>
                      <span>•</span>
                      {user.attribute && (
                        <p className="text-lg">
                          {displayValue ?? "Whatever"}
                          {cleanValue.toLowerCase().includes("price")
                            ? "€"
                            : cleanValue.toLowerCase().includes("size")
                            ? "m²"
                            : cleanValue.toLowerCase().includes("range") &&
                              "km"}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
              <ul className="gap-4 border-t py-4 sm:flex sm:flex-wrap md:grid md:grid-cols-4">
                {Object.entries(attributes).map(([key, value]) => {
                  const userAttributes = user.attribute;
                  if (!userAttributes) return null;

                  const attribute = userAttributes[key as keyof Attribute];

                  if (attribute == null) return null;

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
            </section>
          )}
          {(isLoggedUser || isAdmin) && (
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
                  {isLoggedUser &&
                    ", please add any necessary documents by updating your profile"}
                </p>
              )}
            </section>
          )}
          <DisplayReports reports={user.reports} />
        </div>
      }
    />
  );
}
