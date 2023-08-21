import { User, Image, Document, Role, Attribute } from "@prisma/client";
import { Button } from "../shared/button/Button";
import Link from "next/link";
import { DialogButton } from "../shared/button/DialogButton";
import { DocumentList } from "../shared/document/DocumentList";
import { displayDate } from "../../utils/displayDate";
import { UserLayout } from "./UserLayout";

export interface UserCardProps {
  user: User & {
    attribute: Attribute | null;
  };
  isBanned?: boolean;
  onDelete: () => void;
  image?: (Image & { url: string }) | null;
  documents?: (Document & { url: string })[] | null | undefined;
  isLoggedUser: boolean;
}

const attributes = {
  location: "Location",
  maxPrice: "Max price",
  minPrice: "Min price",
  maxSize: "Max surface",
  minSize: "Min surface",
  range: "Range",
  furnished: "Furnished",
  homeType: "Housing type",
  terrace: "Terrace",
  pets: "Pet friendly",
  smoker: "Smoker friendly",
  disability: "Disability friendly",
  garden: "Garden",
  parking: "Parking",
  elevator: "Elevator",
  pool: "Pool",
} as const as Record<keyof Attribute, string>;

export function UserCard({
  user,
  isBanned = false,
  onDelete,
  isLoggedUser,
  image,
  documents,
}: UserCardProps) {
  return (
    <UserLayout
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.image || (image && image.url) || "/defaultImage.png"}
                referrerPolicy="no-referrer"
                alt="image"
                className="mx-auto h-full w-full overflow-hidden rounded-full"
              />
              {user.isPremium && !isBanned && (
                <div className="absolute right-0 top-[20%] w-full translate-x-[25%] rotate-45 bg-yellow-300 px-2 text-center font-bold text-white">
                  Premium
                </div>
              )}
              {isBanned && (
                <div className="absolute right-0 top-[20%] w-full translate-x-[25%] rotate-45 bg-red-600 px-2 text-center font-bold text-white">
                  Banned
                </div>
              )}
            </div>
          </div>
          {isLoggedUser && (
            <div className="flex gap-4">
              <DialogButton
                buttonText="Delete"
                title="Confirm Account Deletion"
                description="Are you sure you want to delete your Leace account ?"
                confirmButtonText="Yes, Delete my account"
                onDelete={async () => onDelete()}
              />
              <Link href={`/users/${user.id}/update`}>
                <Button>Update</Button>
              </Link>
            </div>
          )}
        </>
      }
      mainPanel={
        <div className="flex flex-grow flex-col gap-5">
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-semibold">
              {isLoggedUser
                ? "Your Profile"
                : `${user.firstName} ${user.lastName}`}
            </h1>
            <h2 className="text-sm font-medium text-slate-500">
              Member since: <i>{user.createdAt.toDateString()}</i>
            </h2>
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
          {isLoggedUser && (
            <>
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
                          (user.emailVerified
                            ? "text-green-400"
                            : "text-red-600")
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
              <section>
                <h2 className="py-4 text-3xl font-medium">Documents</h2>
                {documents && documents.length > 0 ? (
                  <DocumentList documents={documents} />
                ) : (
                  <p className="text-indigo-600">
                    No document available, please add any necessary documents by
                    updating your profile
                  </p>
                )}
              </section>
            </>
          )}
          {user.role === Role.TENANT && user.attribute && (
            <section>
              <h2 className="py-4 text-3xl font-medium">Preferences</h2>
              <ul className="gap-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
                {Object.entries(attributes).map(([key, value]) => {
                  const userAttributes = user.attribute;
                  if (!userAttributes) return null;

                  const attribute = userAttributes[key as keyof Attribute];

                  return (
                    <li
                      className="mr-8 flex-grow border-b border-indigo-300 pb-2"
                      key={key}
                    >
                      <h3 className="text-xl font-medium">{value}</h3>
                      {user.attribute && (
                        <p
                          className={
                            attribute !== null ? "" : " text-indigo-600"
                          }
                        >
                          {typeof attribute === "boolean"
                            ? attribute
                              ? "✅"
                              : "❌"
                            : typeof attribute === "number"
                            ? attribute
                            : typeof attribute === "string"
                            ? attribute
                            : typeof attribute === "object" &&
                              attribute !== null
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
              <ul className="gap-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
                <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
                  <h3 className="text-xl font-medium">Job</h3>
                  <p className={user.job ? "" : " text-indigo-600"}>
                    {user.job ??
                      (isLoggedUser
                        ? "Please add your job by updating your profile"
                        : "Not specified")}
                  </p>
                </li>
                <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
                  <h3 className="text-xl font-medium">Type of contract</h3>
                  <p
                    className={
                      user.employmentContract ? "" : " text-indigo-600"
                    }
                  >
                    {user.employmentContract ??
                      (isLoggedUser
                        ? "Please add your type of contract by updating your profile"
                        : "Not specified")}
                  </p>
                </li>
                <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
                  <h3 className="text-xl font-medium">Annual salary</h3>
                  <p className={user.income ? "" : " text-indigo-600"}>
                    {user.income + " $" ??
                      (isLoggedUser
                        ? "Please add your annual income by updating your profile"
                        : "Not specified")}
                  </p>
                </li>
              </ul>
              <ul className="gap-4 sm:flex sm:flex-wrap md:grid md:grid-cols-3">
                <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
                  <h3 className="text-xl font-medium">Credit score</h3>
                  <p className={user.creditScore ? "" : " text-indigo-600"}>
                    {user.creditScore ??
                      (isLoggedUser
                        ? "Please add your credit score by updating your profile"
                        : "Not specified")}
                  </p>
                </li>
                {/* <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
                  <h3 className="text-xl font-medium">Desired rental period</h3>
                  <p className={"2 years" ? "" : " text-indigo-600"}>
                    {"2 years" ??
                      (isLoggedUser
                        ? "Please add your desired rental period by updating your profile"
                        : "Not specified")}
                  </p>
                </li> */}
                <li className="mr-8 flex-grow border-b border-indigo-300 pb-2">
                  <h3 className="text-xl font-medium">Family situation</h3>
                  <p className={user.maritalStatus ? "" : " text-indigo-600"}>
                    {user.maritalStatus ??
                      (isLoggedUser
                        ? "Please add your family situation by updating your profile"
                        : "Not specified")}
                  </p>
                </li>
              </ul>
            </section>
          )}
        </div>
      }
    />
  );
}
