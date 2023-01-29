/* eslint-disable @next/next/no-img-element */
import React from "react";
import { User, Report } from "@prisma/client";
import { DeleteImgButton } from "./deleteImgButton";
import { trpc } from "../utils/trpc";
import DocValidation from "./docValidation";

const Profile = (props: {
  user: User & {
    reports: Report[];
  };
}) => {
  const { data: images } = trpc.image.GetSignedUserUrl.useQuery(props.user.id);

  const displayDate = (date: Date) => {
    return (
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      date.getFullYear()
    );
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto rounded-lg p-8 shadow">
      <img
        src={
          props.user.image ||
          "https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
        }
        referrerPolicy="no-referrer"
        alt="image"
        className="mx-auto h-32 rounded-full shadow-xl"
      />
      <div className="mt-2 px-16 text-center">
        <h3 className=" text-4xl font-semibold">
          {props.user.firstName ? props.user.firstName : "Prénom"}{" "}
          {props.user.lastName ? props.user.lastName : "Nom"}
        </h3>
        {props.user.status && props.user.status == "ACTIVE" ? (
          <p className="text-lg text-green-500">{props.user.status}</p>
        ) : (
          <p className="text-lg text-red-500">{props.user.status}</p>
        )}
        <p className="my-5 text-lg text-amber-400">
          {props.user.isPremium ? "Premium" : "Non premium"}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg">
            {props.user.email ? props.user.email : "Email inconnu"}
          </p>
          <p className="text-lg">
            {props.user.phoneNumber
              ? props.user.phoneNumber
              : "Numéro de téléphone inconnu"}
          </p>
          <p className="text-lg">
            {props.user.birthDate
              ? displayDate(props.user.birthDate)
              : "Naissance inconnue"}
          </p>
          <p className="text-lg">
            {props.user.country ? props.user.country : "Pays inconnu"}
          </p>
        </div>
      </div>
      <div className="border-blueGray-200 my-10 border-y py-10 text-center">
        <p className="px-10 text-gray-600">
          {props.user.description
            ? props.user.description
            : "Pas de description"}
        </p>
        {images && images.length > 0 ? (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt="image"
                  className="mx-auto h-32 shadow-xl"
                />
                <DeleteImgButton userId={props.user.id} id={image.id} />
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune image</p>
        )}
      </div>
      {props.user.reports.length > 0 && (
        <div className="px-10">
          <p className="mb-2 text-lg">Signalements :</p>
          <div className="flex flex-wrap gap-4">
            {props.user.reports.map((report, index) => (
              <p key={index} className="text-lg">
                Le {displayDate(report.createdAt)}, {report.createdById} a
                signalé {props.user.firstName || props.user.name} pour{" "}
                {report.reason}
              </p>
            ))}
          </div>
        </div>
      )}
      <DocValidation userId={props.user.id} />
    </div>
  );
};

export default Profile;
