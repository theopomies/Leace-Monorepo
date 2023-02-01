/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import ReportForm from "../../components/Web/ReportUser";
import Header from "../../components/Web/Header";
import { trpc } from "../../utils/trpc";
import { LoggedLayout } from "../../components/LoggedLayout";
import { useRouter } from "next/router";
import { Roles } from "@prisma/client";

const ProfilePage = () => {
  const router = useRouter();
  const me = trpc.user.getUser.useQuery();
  const [showReportForm, setReportForm] = useState(false);
  const handleReportForm = () => {
    setReportForm(!showReportForm);
  };
  const handleCloseContent = () => {
    setReportForm(false);
  };
  if (me.data) {
    return (
      <LoggedLayout title="Profile Page | Leace">
        <div className="w-full">
          <Header heading={"Profile"} />
          <div className="flex w-full justify-center p-5">
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
                          First Name:
                        </h2>
                        <p>
                          <b>{me.data.firstName}</b>
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-400">
                          Last Name:
                        </h2>
                        <p>
                          <b>{me.data.lastName}</b>
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-400">
                          Birthdate:
                        </h2>
                        <p>
                          <b>{me.data.birthDate?.toDateString()}</b>
                        </p>
                      </div>
                    </div>
                    <hr className="my-4" />
                    {me.data.role == Roles.TENANT && me.data.attribute ? (
                      <div>
                        <div className="m-4 flex h-full justify-center">
                          <div className="pr-20 pt-4 pb-2">
                            <h2 className="text-xl font-bold text-gray-400">
                              Location:
                            </h2>
                            <p>
                              <b>{me.data.attribute.location}</b>
                            </p>
                          </div>
                          <div className="pr-20 pt-4 pb-2">
                            <h2 className="text-xl font-bold text-gray-400">
                              What you are looking for:
                            </h2>
                            <div>
                              <b>
                                {me.data.attribute.house === true ? (
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
                              <p className="mx-4 mt-4">{me.data.description}</p>
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
                                {me.data.attribute.terrace === true ? (
                                  <p>Yes</p>
                                ) : (
                                  <p>No</p>
                                )}
                                Une piscine :
                                {me.data.attribute.pool === true ? (
                                  <p>Yes</p>
                                ) : (
                                  <p>No</p>
                                )}
                              </div>
                              <div className="flex justify-between">
                                Fumeur :
                                {me.data.attribute.smoker === true ? (
                                  <p>Oui</p>
                                ) : (
                                  <p>Non</p>
                                )}
                                Animal :
                                {me.data.attribute.pets === true ? (
                                  <p>Oui</p>
                                ) : (
                                  <p>Non</p>
                                )}
                              </div>
                              <div className="flex justify-between">
                                Handicap :
                                {me.data.attribute.disability === true ? (
                                  <p>Oui</p>
                                ) : (
                                  <p>Non</p>
                                )}
                                Garage :
                                {me.data.attribute.parking === true ? (
                                  <p>Oui</p>
                                ) : (
                                  <p>Non</p>
                                )}
                              </div>
                              <div className="flex justify-between">
                                Ascenseur :
                                {me.data.attribute.elevator === true ? (
                                  <p>Oui</p>
                                ) : (
                                  <p>Non</p>
                                )}
                                Jardin :
                                {me.data.attribute.garden === true ? (
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
                              {me.data.attribute.minPrice} $
                            </b>
                          </h2>
                          <h2 className="pt-3 text-xl font-bold text-gray-600">
                            budget maximum:
                            <b className="pl-3 text-black">
                              {me.data.attribute.maxPrice} $
                            </b>
                          </h2>
                        </div>
                        <div className="mt-4 border-t border-gray-300 pt-5">
                          <h2 className="text-xl font-bold text-gray-600">
                            Surface demandée au minimum:
                            <b className="pl-3 text-black">
                              {me.data.attribute.minSize} m²
                            </b>
                          </h2>
                          <h2 className="pt-3 text-xl font-bold text-gray-600">
                            Surface demandée au maximum:
                            <b className="pl-3 text-black">
                              {me.data.attribute.maxSize} m²
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
      </LoggedLayout>
    );
  }
};

export default ProfilePage;
