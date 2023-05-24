/* eslint-disable @next/next/no-img-element */
import { Header } from "../users/Header";
import { trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";
import Link from "next/link";
import { Loader } from "../shared/Loader";
import { Button } from "../shared/button/Button";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";
import { DocumentsList } from "../shared/document/DocumentsList";

export interface ProfilePageProps {
  userId: string;
}

export const ProfilePage = ({ userId }: ProfilePageProps) => {
  const { data: user, isLoading } = trpc.user.getUserById.useQuery({ userId });
  const { data: session } = trpc.auth.getSession.useQuery();
  const utils = trpc.useContext();
  const router = useRouter();
  const { signOut } = useClerk();

  const deleteUser = trpc.user.deleteUserById.useMutation({
    onSuccess() {
      router.push("/");
      utils.invalidate();
      signOut();
    },
  });
  const { data: documents, refetch: refetchImages } =
    trpc.document.getSignedUserUrl.useQuery(userId);
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <div>Not found</div>;
  }

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ userId: user.id, documentId });
    refetchImages();
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Header heading={"Profile"} />
      <div className="my-10 flex w-2/4 rounded-lg bg-white p-5 shadow">
        <div className="flex w-full flex-col items-center justify-center">
          <img
            src={
              user.image ||
              "https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
            }
            referrerPolicy="no-referrer"
            alt="image"
            className="mx-auto h-32 rounded-full shadow-xl"
          />
          <form className="mt-5 w-full text-center">
            <div className="flex w-full justify-between p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-400">First Name:</h2>
                <p>
                  <b>{user.firstName}</b>
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-400">Last Name:</h2>
                <p>
                  <b>{user.lastName}</b>
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-400">Birthdate:</h2>
                <p>
                  <b>
                    {user.birthDate
                      ?.toUTCString()
                      .split(" ")
                      .slice(0, 4)
                      .join(" ")}
                  </b>
                </p>
              </div>
            </div>
            <div className="border-t p-5">
              <h2 className="text-xl font-bold text-gray-400">Description:</h2>
              <p className="mx-4 mt-4">
                <b>{user.description}</b>
              </p>
            </div>
            {user.role == Role.TENANT && user.attribute && (
              <div className="w-full">
                <div className="flex h-full justify-between border-t p-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-400">
                      Location:
                    </h2>
                    <p>
                      <b>{user.attribute.location}</b>
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-400">
                      What you are looking for:
                    </h2>
                    <div>
                      <b>
                        {user.attribute.house === true ? (
                          <p>House</p>
                        ) : (
                          <p>Appartment</p>
                        )}
                      </b>
                    </div>
                  </div>
                </div>
                <div className="h-full justify-center border-t p-5">
                  <h2 className="text-xl font-bold text-gray-400">
                    Criterials:
                  </h2>
                  <div className="m-4 h-full">
                    <b>
                      <div className="flex justify-between">
                        Une terrasse :
                        {user.attribute.terrace === true ? (
                          <p>Yes</p>
                        ) : (
                          <p>No</p>
                        )}
                        Une piscine :
                        {user.attribute.pool === true ? <p>Yes</p> : <p>No</p>}
                      </div>
                      <div className="flex justify-between">
                        Fumeur :
                        {user.attribute.smoker === true ? (
                          <p>Yes</p>
                        ) : (
                          <p>No</p>
                        )}
                        Animal :
                        {user.attribute.pets === true ? <p>Yes</p> : <p>No</p>}
                      </div>
                      <div className="flex justify-between">
                        Handicap :
                        {user.attribute.disability === true ? (
                          <p>Yes</p>
                        ) : (
                          <p>No</p>
                        )}
                        Garage :
                        {user.attribute.parking === true ? (
                          <p>Yes</p>
                        ) : (
                          <p>No</p>
                        )}
                      </div>
                      <div className="flex justify-between">
                        Ascenseur :
                        {user.attribute.elevator === true ? (
                          <p>Yes</p>
                        ) : (
                          <p>No</p>
                        )}
                        Jardin :
                        {user.attribute.garden === true ? (
                          <p>Yes</p>
                        ) : (
                          <p>No</p>
                        )}
                      </div>
                    </b>
                  </div>
                </div>
                <div className="border-t p-5">
                  <h2 className="text-xl font-bold text-gray-400">
                    Minimum budget:
                    <b className="pl-3 text-black">
                      {user.attribute.minPrice} $
                    </b>
                  </h2>
                  <h2 className="pt-3 text-xl font-bold text-gray-400">
                    Maximum budget:
                    <b className="pl-3 text-black">
                      {user.attribute.maxPrice} $
                    </b>
                  </h2>
                </div>
                <div className="border-t p-5">
                  <h2 className="text-xl font-bold text-gray-400">
                    Minimum size:
                    <b className="pl-3 text-black">
                      {user.attribute.minSize} m²
                    </b>
                  </h2>
                  <h2 className="pt-3 text-xl font-bold text-gray-400">
                    Maximum size:
                    <b className="pl-3 text-black">
                      {user.attribute.maxSize} m²
                    </b>
                  </h2>
                </div>
              </div>
            )}
            {session && documents && documents.length > 0 && (
              <div className="border-t p-5">
                <h2 className="text-xl font-bold text-gray-400">Documents:</h2>
                <DocumentsList
                  documents={documents}
                  handleDeleteDoc={handleDeleteDoc}
                  isUserLogged={userId == session.userId}
                />
              </div>
            )}
          </form>
          {session && userId == session.userId && (
            <>
              <Link href={`/users/${userId}/update`}>
                <Button>Modify</Button>
              </Link>
              <Button
                className="scale-75 rounded bg-red-500 px-4 font-bold text-white hover:bg-red-600 active:bg-red-700"
                onClick={(e) => {
                  e.preventDefault();
                  deleteUser.mutate({ userId });
                }}
              >
                Delete Account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
