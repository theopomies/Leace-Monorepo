/* eslint-disable @next/next/no-img-element */
import { User, Report } from "@prisma/client";
import { DeleteImgButton } from "./DeleteImgButton";
import { trpc } from "../../utils/trpc";
import { DocValidation } from "./DocValidation";

export interface ProfileProps {
  user: User & {
    reports: Report[];
  };
}

export const Profile = ({ user }: ProfileProps) => {
  const { data: images } = trpc.image.GetSignedUserUrl.useQuery(user.id);

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
    <div className="flex w-full flex-col overflow-auto rounded-lg bg-white p-8 shadow">
      <img
        src={user.image || "/defaultImage.png"}
        referrerPolicy="no-referrer"
        alt="image"
        className="mx-auto h-32 rounded-full shadow-xl"
      />
      <div className="mt-2 px-16 text-center">
        <h3 className=" text-4xl font-semibold">
          {user.firstName ? user.firstName : "Prénom"}{" "}
          {user.lastName ? user.lastName : "Nom"}
        </h3>
        {user.status && user.status == "ACTIVE" ? (
          <p className="text-lg text-green-500">{user.status}</p>
        ) : (
          <p className="text-lg text-red-500">{user.status}</p>
        )}
        <p className="my-5 text-lg text-amber-400">
          {user.isPremium ? "Premium" : "Non premium"}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg">{user.email ? user.email : "Email inconnu"}</p>
          <p className="text-lg">
            {user.phoneNumber
              ? user.phoneNumber
              : "Numéro de téléphone inconnu"}
          </p>
          <p className="text-lg">
            {user.birthDate
              ? displayDate(user.birthDate)
              : "Naissance inconnue"}
          </p>
          <p className="text-lg">
            {user.country ? user.country : "Pays inconnu"}
          </p>
        </div>
      </div>
      <div className="border-blueGray-200 my-10 border-y py-10 text-center">
        <p className="px-10 text-gray-600">
          {user.description ? user.description : "Pas de description"}
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
                <DeleteImgButton userId={user.id} id={image.id} />
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune image</p>
        )}
      </div>
      {user.reports.length > 0 && (
        <div className="px-10">
          <p className="mb-2 text-lg">Signalements :</p>
          <div className="flex flex-wrap gap-4">
            {user.reports.map((report, index) => (
              <p key={index} className="text-lg">
                Le {displayDate(report.createdAt)}, {report.createdById} a
                signalé {user.firstName || user.firstName} pour {report.reason}
              </p>
            ))}
          </div>
        </div>
      )}
      <DocValidation userId={user.id} />
    </div>
  );
};
