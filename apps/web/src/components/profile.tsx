/* eslint-disable @next/next/no-img-element */
import React from "react";
import { User, Image, Report } from "@prisma/client";

const Profile = (props: {
  user: User & {
    images: Image[];
    reports: Report[];
  };
}) => {
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
    <div className="flex h-full w-full justify-center overflow-auto rounded-lg p-4 shadow">
      <div className="space-y-2">
        <img
          src={
            props.user.image ||
            "https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
          }
          referrerPolicy="no-referrer"
          alt="image"
          className="mx-auto h-32 rounded-full shadow-xl"
        />
        <div className="m-10 text-center">
          <h3 className=" text-4xl font-semibold">
            {props.user.firstName ? props.user.firstName : "Prénom"}{" "}
            {props.user.lastName ? props.user.lastName : "Nom"}
          </h3>
          {props.user.status && props.user.status == "ACTIVE" ? (
            <p className="text-lg text-green-500">{props.user.status}</p>
          ) : (
            <p className="text-lg text-red-500">{props.user.status}</p>
          )}
          <p className="mt-4 mb-4 text-lg text-amber-400">
            {props.user.isPremium ? "Premium" : "Non premium"}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4">
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
          <div className="border-blueGray-200 mt-10 border-t py-10 text-center">
            <p className="text-gray-600">
              {props.user.description
                ? props.user.description
                : "Pas de description"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {props.user.images.map((image, index) =>
            image ? (
              <img
                key={index}
                src={image.url}
                alt="image"
                className="mx-auto mb-5 h-32 shadow-xl"
              />
            ) : (
              <p>Aucune image</p>
            ),
          )}
        </div>
        <div className="border-blueGray-200 border-t p-10">
          {props.user.reports.length > 0 && (
            <p className="mb-5 text-lg">Signalements :</p>
          )}
          <div className="flex flex-wrap gap-4">
            {props.user.reports.map((report, index) => (
              <p key={index} className="mr-2 text-lg">
                Le {displayDate(report.createdAt)}, {report.createdById} a
                signalé {props.user.firstName || props.user.name} pour{" "}
                {report.reason}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
