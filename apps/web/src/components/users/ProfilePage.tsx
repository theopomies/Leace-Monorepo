/* eslint-disable @next/next/no-img-element */
import { Header } from "../users/Header";
import { trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";
import Link from "next/link";
import { Loader } from "../shared/Loader";
import { Button } from "../shared/button/Button";
import { DocumentsList } from "../shared/document/DocumentsList";

export interface ProfilePageProps {
  userId: string;
}

export const ProfilePage = ({ userId }: ProfilePageProps) => {
  const { data: user, isLoading } = trpc.user.getUserById.useQuery({ userId });
  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: documents } = trpc.document.getSignedUserUrl.useQuery(userId);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <div>Not found</div>;
  }

  return (
    <div className="w-full">
      <Header heading={"Profile"} />
      <div className="flex w-full justify-center p-5">
        <div className="m-14 flex w-2/5 justify-center rounded-lg bg-white p-5 shadow">
          <div className="h-auto p-4 text-center">
            <div>
              <img
                src={
                  user.image ||
                  "https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                }
                referrerPolicy="no-referrer"
                alt="image"
                className="mx-auto h-32 rounded-full shadow-xl"
              />
              <form className="border-blueGray-200 mt-5 h-auto w-full border-t text-center">
                <div className="m-4 flex h-full w-full justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-400">
                      First Name:
                    </h2>
                    <p>
                      <b>{user.firstName}</b>
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-400">
                      Last Name:
                    </h2>
                    <p>
                      <b>{user.lastName}</b>
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-400">
                      Birthdate:
                    </h2>
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
                <div className="mt-4 border-t border-gray-300 pt-5">
                  <b>
                    <p className="mx-4 mt-4">{user.description}</p>
                  </b>
                </div>
                <hr className="my-4" />
                {user.role == Role.TENANT && user.attribute && (
                  <div>
                    <div className="m-4 flex h-full justify-center">
                      <div className="pb-2 pr-20 pt-4">
                        <h2 className="text-xl font-bold text-gray-400">
                          Location:
                        </h2>
                        <p>
                          <b>{user.attribute.location}</b>
                        </p>
                      </div>
                      <div className="pb-2 pr-20 pt-4">
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
                    <hr className="my-4" />
                    <div className="m-4 h-full justify-center">
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
                            {user.attribute.pool === true ? (
                              <p>Yes</p>
                            ) : (
                              <p>No</p>
                            )}
                          </div>
                          <div className="flex justify-between">
                            Fumeur :
                            {user.attribute.smoker === true ? (
                              <p>Yes</p>
                            ) : (
                              <p>No</p>
                            )}
                            Animal :
                            {user.attribute.pets === true ? (
                              <p>Yes</p>
                            ) : (
                              <p>No</p>
                            )}
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
                    <div className="mt-4 border-t border-gray-300 pt-5">
                      <h2 className="text-xl font-bold text-gray-600">
                        budget minimum:
                        <b className="pl-3 text-black">
                          {user.attribute.minPrice} $
                        </b>
                      </h2>
                      <h2 className="pt-3 text-xl font-bold text-gray-600">
                        budget maximum:
                        <b className="pl-3 text-black">
                          {user.attribute.maxPrice} $
                        </b>
                      </h2>
                    </div>
                    <div className="mt-4 border-t border-gray-300 pt-5">
                      <h2 className="text-xl font-bold text-gray-600">
                        Surface demandée au minimum:
                        <b className="pl-3 text-black">
                          {user.attribute.minSize} m²
                        </b>
                      </h2>
                      <h2 className="pt-3 text-xl font-bold text-gray-600">
                        Surface demandée au maximum:
                        <b className="pl-3 text-black">
                          {user.attribute.maxSize} m²
                        </b>
                      </h2>
                    </div>
                    {documents && documents.length > 0 && (
                      <DocumentsList documents={documents} />
                    )}
                  </div>
                )}
              </form>
              {session && userId == session.userId && (
                <div>
                  <Link href={`/users/${userId}/update`}>
                    <Button>Modifier</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
