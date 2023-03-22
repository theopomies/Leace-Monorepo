/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { BanButton } from "../BanButton";
import { Loader } from "../Loader";
import { Documents } from "../Documents";
import { ChatModal } from "../ChatModal";

export interface UserCardProps {
  userId: string;
}

export const UserCard = ({ userId }: UserCardProps) => {
  const { data: user } = trpc.moderation.getUser.useQuery({ userId: userId });

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

  if (user)
    return (
      <div className="flex w-full flex-col overflow-auto rounded-lg bg-white p-8 shadow">
        <img
          src={user.image || "/defaultImage.png"}
          referrerPolicy="no-referrer"
          alt="image"
          className="mx-auto h-32 rounded-full shadow-xl"
        />
        <div className="mt-2 px-16 text-center">
          <h3 className="font-semibold">{user.role}</h3>
          <h3 className=" text-4xl font-semibold">
            {user.firstName ? user.firstName : "Prénom"}{" "}
            {user.lastName ? user.lastName : "Nom"}
          </h3>
          <div></div>
          {user.status && user.status == "ACTIVE" ? (
            <p className="text-lg text-green-500">{user.status}</p>
          ) : (
            <p className="text-lg text-red-500">{user.status}</p>
          )}
          <BanButton userId={userId} />

          <p className="my-5 text-lg text-amber-400">
            {user.isPremium ? "Premium" : "Non premium"}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-lg">
              {user.email ? user.email : "Email inconnu"}
            </p>
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
        <ChatModal userId={user.id} />
        <div className="border-blueGray-200 my-10 border-y py-10 text-center">
          <p className="px-10 text-gray-600">
            {user.description ? user.description : "Pas de description"}
          </p>
        </div>
        <Documents userId={user.id} />
        {user.reports.length > 0 && (
          <div className="px-10">
            <p className="mb-2 text-lg">Signalements :</p>
            <div className="flex flex-wrap gap-4">
              {user.reports.map((report, index) => (
                <p key={index} className="text-lg">
                  Le {displayDate(report.createdAt)}, {report.createdById} a
                  signalé {user.firstName || user.name} pour {report.reason}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  return <Loader />;
};
