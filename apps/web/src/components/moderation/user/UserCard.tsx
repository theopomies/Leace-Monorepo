/* eslint-disable @next/next/no-img-element */
import { displayDate } from "../../../utils/displayDate";
import { DisplayReports } from "../report/DisplayReports";
import { DeleteUserImg } from "./DeleteUserImg";
import { DocumentsList } from "../../shared/document/DocumentsList";
import { User, Attribute, Report, Document } from "@prisma/client";

export interface UserCardProps {
  user: User & {
    attribute: Attribute | null;
    reports: Report[];
  };
  isBan?: boolean;
  documents: (Document & { url: string })[] | undefined;
  OnDocDelete: (documentId: string) => Promise<void>;
  OnDocValidation: (document: Document & { url: string }) => Promise<void>;
}

export const UserCard = ({
  user,
  isBan,
  documents,
  OnDocDelete,
  OnDocValidation,
}: UserCardProps) => {
  return (
    <div className="flex w-full flex-col overflow-auto rounded-lg bg-white p-8 shadow">
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={user.image || "/defaultImage.png"}
            referrerPolicy="no-referrer"
            alt="image"
            className="mx-auto h-32 rounded-full shadow-xl"
          />
          {user.image && <DeleteUserImg userId={user.id} />}
        </div>
      </div>
      <div className="mt-2 px-16 pb-10 text-center">
        <h3 className="font-semibold">{user.role}</h3>
        <h3 className=" text-4xl font-semibold">
          {user.firstName ? user.firstName : "FirstName"}{" "}
          {user.lastName ? user.lastName : "LastName"}
        </h3>
        <p className={`text-lg ${!isBan ? "text-green-500" : "text-red-500"}`}>
          {user.status}
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
      <DocumentsList
        documents={documents}
        isLoggedInOrAdmin={true}
        OnDelete={OnDocDelete}
        OnValidation={OnDocValidation}
      />
      <DisplayReports reports={user.reports} />
    </div>
  );
};
