/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { displayDate } from "../../../utils/displayDate";
import { DisplayReports } from "../../moderation/report/DisplayReports";
import { DocumentList } from "../document/DocumentList";
import { User, Attribute, Report, Image, Document } from "@prisma/client";
import { Button } from "../button/Button";
import { DialogButton } from "../button/DialogButton";

export interface UserCardProps {
  user: User & {
    attribute: Attribute | null;
    reports?: Report[];
  };
  isBanned: boolean | undefined;
  OnUserDelete?: () => Promise<void>;
  image: (Image & { url: string }) | null | undefined;
  documents: (Document & { url: string })[] | null | undefined;
  OnDocValidation?: (document: Document & { url: string }) => Promise<void>;
  updateLink?: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export const UserCard = ({
  user,
  isBanned,
  OnUserDelete,
  image,
  documents,
  OnDocValidation,
  updateLink,
  isLoggedIn,
  isAdmin,
}: UserCardProps) => {
  return (
    <div className="flex w-full flex-col overflow-auto rounded-lg bg-white p-8 shadow">
      <div className="flex justify-center">
        <img
          src={user.image || (image && image.url) || "/defaultImage.png"}
          referrerPolicy="no-referrer"
          alt="image"
          className="mx-auto h-32 rounded-full shadow-xl"
        />
      </div>
      <div className="mt-2 px-16 pb-10 text-center">
        <h3 className="font-semibold">{user.role}</h3>
        <h3 className=" text-4xl font-semibold">
          {user.firstName ? user.firstName : "FirstName"}{" "}
          {user.lastName ? user.lastName : "LastName"}
        </h3>
        <p className={`${!isBanned ? "text-green-500" : "text-red-500"}`}>
          {!isBanned ? user.status : "BANNED"}
        </p>
        <p className="my-5 text-lg text-amber-400">
          {user.isPremium ? "Premium" : "No premium"}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg">{user.email ? user.email : "No email"}</p>
          <p className="text-lg">
            {user.phoneNumber ? user.phoneNumber : "No phone number"}
          </p>
          <p className="text-lg">
            {user.birthDate ? displayDate(user.birthDate) : "No birth date"}
          </p>
          <p className="text-lg">
            {user.country ? user.country : "No country"}
          </p>
        </div>
      </div>
      <div className="border-t py-10 text-center">
        <p className="px-10 text-gray-600">
          {user.description ? user.description : "No description"}
        </p>
      </div>
      {user.attribute && (
        <div>
          <div className="flex justify-between border-t p-5">
            <div>
              <h2 className="text-xl">What you are looking for</h2>
              <p>
                {user.attribute.homeType
                  ? user.attribute.homeType.charAt(0) +
                    user.attribute.homeType.slice(1).toLowerCase()
                  : "Whatever"}
              </p>
            </div>
            <div>
              <h2 className="text-xl">Location</h2>
              <p>{user.attribute.location}</p>
            </div>
          </div>
          <div className="justify-center border-t p-5">
            <h2 className="text-xl">Criterials:</h2>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>Terrace:{user.attribute.terrace ? "✅" : "❌"}</div>
              <div>Smoker:{user.attribute.smoker ? "✅" : "❌"}</div>
              <p>Elevator: {user.attribute.elevator ? "✅" : "❌"}</p>
              <p>Pets: {user.attribute.pets ? "✅" : "❌"}</p>
              <p>Piscine: {user.attribute.pool ? "✅" : "❌"}</p>
              <p>Accessible: {user.attribute.disability ? "✅" : "❌"}</p>
              <p>Garage: {user.attribute.parking ? "✅" : "❌"}</p>
              <p>Jardin: {user.attribute.garden ? "✅" : "❌"}</p>
            </div>
          </div>
          <div className="flex justify-evenly border-t p-5">
            <h2 className="flex gap-2 text-xl">
              Minimum budget:
              <b>{user.attribute.minPrice} $</b>
            </h2>
            <h2 className="flex gap-2 text-xl">
              Maximum budget:
              <b>{user.attribute.maxPrice} $</b>
            </h2>
          </div>
          <div className="flex justify-evenly border-t p-5">
            <h2 className="flex gap-2 text-xl">
              Minimum size:
              <b>{user.attribute.minSize} m²</b>
            </h2>
            <h2 className="flex gap-2 text-xl">
              Maximum size:
              <b>{user.attribute.maxSize} m²</b>
            </h2>
          </div>
        </div>
      )}
      <DocumentList documents={documents} OnValidation={OnDocValidation} />
      <DisplayReports reports={user.reports} />
      {(isLoggedIn || isAdmin) && (
        <div
          className={`mt-10 flex ${
            OnUserDelete ? "justify-between" : "justify-center"
          }`}
        >
          {updateLink && (
            <Link href={updateLink.replace("[userId]", user.id)}>
              <Button>Update</Button>
            </Link>
          )}
          {OnUserDelete && (
            <DialogButton
              buttonText="Delete my account"
              title="Delete my account"
              description="Are you sure you want to delete your account?"
              confirmButtonText="Yes, delete my account"
              onDelete={OnUserDelete}
            />
          )}
        </div>
      )}
    </div>
  );
};
