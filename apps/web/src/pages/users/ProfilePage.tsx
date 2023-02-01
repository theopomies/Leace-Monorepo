/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import ReportForm from "../../components/Web/ReportUser";
import Header from "../../components/Web/Header";
import { trpc, RouterInputs } from "../../utils/trpc";
import { LoggedLayout } from "../../components/LoggedLayout";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const router = useRouter();
  const get_user_by_id = trpc.user.getUser.useQuery();
  const [showReportForm, setReportForm] = useState(false);
  const handleReportForm = () => {
    setReportForm(!showReportForm);
  };
  const handleCloseContent = () => {
    setReportForm(false);
  };
  if (get_user_by_id.data?.role == "TENANT") {
    return (
      <div className="h-full bg-slate-100">
        <LoggedLayout>
          <Header heading={"Profil utilisateur"} />
          <div className="flex justify-center p-5">
            <div>
              <button
                className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/users/UpdateProfile");
                }} //handleReportForm}
              >
                Modifier
              </button>
              {/* {showReportForm && (
                <ReportForm
                  onClose={handleCloseContent}
                  userId="cldgtjmh70000v2842ehc9afc"
                />
              )} */}
            </div>
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
                          Prénom:
                        </h2>
                        <p>
                          <b>{get_user_by_id.data?.firstName}</b>
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-400">
                          Nom:
                        </h2>
                        <p>
                          <b>{get_user_by_id.data?.lastName}</b>
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-400">
                          Date de naissance:
                        </h2>
                        <p>
                          <b>
                            {get_user_by_id.data?.birthDate?.toDateString()}
                          </b>
                        </p>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div className="m-4 flex h-full justify-center">
                      <div className="pr-20 pt-4 pb-2">
                        <h2 className="text-xl font-bold text-gray-400">
                          Lieu de recherche:
                        </h2>
                        <p>
                          <b>{get_user_by_id.data.attribute?.location}</b>
                        </p>
                      </div>
                      <div className="pr-20 pt-4 pb-2">
                        <h2 className="text-xl font-bold text-gray-400">
                          Type de bien:
                        </h2>
                        <div>
                          <b>
                            {get_user_by_id.data.attribute?.house === true ? (
                              <p>Maison</p>
                            ) : (
                              <p>Appartement</p>
                            )}
                          </b>
                        </div>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div className="m-4 h-full justify-center">
                      <div className="mt-4 border-t border-gray-300 pt-5">
                        <b>
                          <p className="mx-4 mt-4">
                            {get_user_by_id.data?.description}
                          </p>
                        </b>
                      </div>
                      <div className="mt-4 border-t border-gray-300 pt-5"></div>
                      <h2 className="text-xl font-bold text-gray-400">
                        Critères:
                      </h2>
                      <div className="m-4 h-full">
                        <b>
                          <div className="flex justify-between">
                            Une terrasse :
                            {get_user_by_id.data.attribute?.terrace === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                            Une piscine :
                            {get_user_by_id.data.attribute?.pool === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                          </div>
                          <div className="flex justify-between">
                            Fumeur :
                            {get_user_by_id.data.attribute?.smoker === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                            Animal :
                            {get_user_by_id.data.attribute?.pets === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                          </div>
                          <div className="flex justify-between">
                            Handicap :
                            {get_user_by_id.data.attribute?.disability ===
                            true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                            Garage :
                            {get_user_by_id.data.attribute?.parking === true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                          </div>
                          <div className="flex justify-between">
                            Ascenseur :
                            {get_user_by_id.data.attribute?.elevator ===
                            true ? (
                              <p>Oui</p>
                            ) : (
                              <p>Non</p>
                            )}
                            Jardin :
                            {get_user_by_id.data.attribute?.garden === true ? (
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
                          {get_user_by_id.data.attribute?.minPrice} $
                        </b>
                      </h2>
                      <h2 className="pt-3 text-xl font-bold text-gray-600">
                        budget maximum:
                        <b className="pl-3 text-black">
                          {get_user_by_id.data.attribute?.maxPrice} $
                        </b>
                      </h2>
                    </div>
                    <div className="mt-4 border-t border-gray-300 pt-5">
                      <h2 className="text-xl font-bold text-gray-600">
                        Surface demandée au minimum:
                        <b className="pl-3 text-black">
                          {get_user_by_id.data.attribute?.minSize} m²
                        </b>
                      </h2>
                      <h2 className="pt-3 text-xl font-bold text-gray-600">
                        Surface demandée au maximum:
                        <b className="pl-3 text-black">
                          {get_user_by_id.data.attribute?.maxSize} m²
                        </b>
                      </h2>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </LoggedLayout>
      </div>
    );
  } else {
    return (
      <div className="h-full bg-slate-100">
        <LoggedLayout>
          <Header heading={"Profil utilisateur"} />
          <div className="flex justify-center p-5">
            <div>
              <button
                className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/users/UpdateProfile");
                }} //handleReportForm}
              >
                Modifier
              </button>
              {/* {showReportForm && (
                <ReportForm
                  onClose={handleCloseContent}
                  userId="cldgtjmh70000v2842ehc9afc"
                />
              )} */}
            </div>
            <div className="m-14 flex w-2/5 justify-center rounded-lg bg-white p-5 shadow">
              <div className="h-auto w-full p-4 text-center">
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
                    <div className="m-4 flex justify-center gap-20">
                      <div>
                        <h2 className="text-xl font-bold text-gray-400">
                          Prénom:
                        </h2>
                        <p>
                          <b>{get_user_by_id.data?.firstName}</b>
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-400">
                          Nom:
                        </h2>
                        <p>
                          <b>{get_user_by_id.data?.lastName}</b>
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-400">
                          Date de naissance:
                        </h2>
                        <p>
                          <b>
                            {get_user_by_id.data?.birthDate?.toDateString()}
                          </b>
                        </p>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div className="m-4 h-full justify-center">
                      <div className="mt-4 border-t border-gray-300 pt-5">
                        <b>
                          <p className="mx-4 mt-4">
                            {get_user_by_id.data?.description}
                          </p>
                        </b>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </LoggedLayout>
      </div>
    );
  }
};

export default ProfilePage;
