import { User, Image, Document } from "@prisma/client";
import { Button } from "../shared/button/Button";
import Link from "next/link";
import { DialogButton } from "../shared/button/DialogButton";
import { DocumentList } from "../shared/document/DocumentList";

export interface NewUserCardProps {
  user: User;
  isBanned?: boolean;
  onDelete: () => void;
  image?: (Image & { url: string }) | null;
  documents?: (Document & { url: string })[] | null | undefined;
  isLoggedUser: boolean;
}

export function NewUserCard({
  user,
  isBanned = false,
  onDelete,
  isLoggedUser,
  image,
  documents,
}: NewUserCardProps) {
  // isLoggedUser = false;
  // user.isPremium = true;
  return (
    <div className="m-20 flex-grow overflow-scroll rounded-lg bg-white px-12 pt-20">
      <div className="flex gap-12">
        <div className="flex flex-col items-center gap-12 px-16">
          <div className="relative h-40 w-40">
            <div
              className={
                "relative h-full w-full overflow-hidden rounded-full shadow-xl" +
                (user.isPremium ? " border-2 border-yellow-300" : "")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.image || (image && image.url) || "/defaultImage.png"}
                referrerPolicy="no-referrer"
                alt="image"
                className="mx-auto h-full w-full overflow-hidden rounded-full"
              />
              {user.isPremium && (
                <div className="absolute top-[20%] right-0 w-full translate-x-[25%] rotate-45 bg-yellow-300 px-2 text-center font-bold text-white">
                  Premium
                </div>
              )}
            </div>
            <button className="absolute top-0 left-0 flex h-full w-full items-end justify-center rounded-full opacity-0 transition-all hover:opacity-100">
              <span className=" translate-y-[50%] rounded-full bg-white px-4 shadow-md">
                Edit
              </span>
            </button>
          </div>
          {isLoggedUser && (
            <div className="flex gap-4">
              <Link href={`/users/${user.id}/update`}>
                <Button>Update</Button>
              </Link>
              <DialogButton
                buttonText="Delete"
                title="Confirm Account Deletion"
                description="Are you sure you want to delete your Leace account ?"
                confirmButtonText="Yes, Delete my account"
                onDelete={async () => onDelete()}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-semibold">
            {isLoggedUser
              ? "Your Profile"
              : `${user.firstName} ${user.lastName}`}
          </h1>
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
              {user.description}
            </p>
          </section>
          {isLoggedUser && (
            <>
              <section>
                <h2 className="py-4 text-3xl font-medium">
                  Contact Informations
                </h2>
                <ul className="flex flex-wrap gap-4">
                  <li className="pr-8">
                    <h3 className="text-xl font-medium">Email</h3>
                    <p>{user.email}</p>
                  </li>
                  <li>
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
        </div>
      </div>
    </div>
  );
}
