/* eslint-disable @next/next/no-img-element */
import Header from "../users/Header";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { Roles } from "@prisma/client";

export interface ProfilePageProps {
  userId?: string;
}

const ProfilePage = ({ userId }: ProfilePageProps) => {
  const router = useRouter();
  const { data: user, isLoading } = trpc.user.getUser.useQuery(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not found</div>;
  }

  return (
    <div className="w-full">
      <Header heading={"Profile"} />
      <div className="flex w-full justify-center p-5">
        {!userId && (
          <div>
            <button
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              onClick={(e) => {
                e.preventDefault();
                router.push("/users/me/update");
              }}
            >
              Modifier
            </button>
          </div>
        )}
        <div className="m-14 flex w-2/5 justify-center rounded-lg bg-white p-5 shadow">
          <div className="h-auto p-4 text-center">
            <div>
              <img
                src={
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
                      <b>{user.birthDate?.toDateString()}</b>
                    </p>
                  </div>
                </div>
                <hr className="my-4" />
                {user.role == Roles.TENANT && user.attribute ? (
                  <div>
                    <div className="m-4 flex h-full justify-center">
                      <div className="pr-20 pt-4 pb-2">
                        <h2 className="text-xl font-bold text-gray-400">
                          Location:
                        </h2>
                        <p>
                          <b>{user.attribute.location}</b>
                        </p>
                      </div>
                      <div className="pr-20 pt-4 pb-2">
                        <h2 className="text-xl font-bold text-gray-400">
                          What you are looking for:
                        </h2>
                        <div>
                          <b>
                            {user.attribute.house === true ? (
                              <p>Home</p>
                            ) : (
                              <p>Appartment</p>
                            )}
                          </b>
                        </div>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div className="m-4 h-full justify-center">
                      <div className="mt-4 border-t border-gray-300 pt-5">
                        <b>
                          <p className="mx-4 mt-4">{user.description}</p>
                        </b>
                      </div>
                      <div className="mt-4 border-t border-gray-300 pt-5"></div>
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
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                            Animal :
                            {user.attribute.pets === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                          </div>
                          <div className="flex justify-between">
                            Handicap :
                            {user.attribute.disability === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                            Garage :
                            {user.attribute.parking === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                          </div>
                          <div className="flex justify-between">
                            Ascenseur :
                            {user.attribute.elevator === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                            Jardin :
                            {user.attribute.garden === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
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
                  </div>
                ) : (
                  <></>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
