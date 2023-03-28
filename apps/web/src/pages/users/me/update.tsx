/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { trpc, RouterInputs } from "../../../utils/trpc";
import { Roles } from "@prisma/client";
import { useRouter } from "next/router";
import Header from "../../../components/Web/Header";
import { LoggedLayout } from "../../../components/LoggedLayout";
import LocataireProfile from "../../../components/Web/ModifyLocataireProfile";

const Update = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const userProfile = trpc.user.getUser.useQuery();
  const updateUser = trpc.user.updateUser.useMutation();
  const [userData, setUserData] = useState<RouterInputs["user"]["updateUser"]>({
    birthDate: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    description: "",
  });

  const updateAtt = trpc.attribute.updateUserAtt.useMutation();
  const [attData, setAttData] = useState<
    RouterInputs["attribute"]["updateUserAtt"]
  >({
    location: "",
    maxPrice: 0,
    minPrice: 0,
    maxSize: 0,
    minSize: 0,
    rentStartDate: new Date(),
    rentEndDate: new Date(),
    furnished: false,
    house: false,
    appartment: false,
    terrace: false,
    pets: false,
    smoker: false,
    disability: false,
    garden: false,
    parking: false,
    elevator: false,
    pool: false,
  });
  const handleChange =
    (prop: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUserData({
        ...userData,
        [prop]: event.target.value,
      });
    };

  const router = useRouter();
  const handleClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const user = await updateUser.mutateAsync(userData);
    if (!user) {
      return null;
    }
    updateAtt.mutate(attData);
    router.push("/users/me");
  };

  useEffect(() => {
    if (userProfile.data) {
      setUserData({
        birthDate: userProfile.data.birthDate?.toDateString() ?? "",
        firstName: userProfile.data.firstName ?? "",
        lastName: userProfile.data.lastName ?? "",
        phoneNumber: userProfile.data.phoneNumber ?? "",
        description: userProfile.data.description ?? "",
      });
    }
  }, [userProfile.data]);
  return (
    <LoggedLayout title="Profile Page | Leace">
      <div className="w-full">
        <Header heading={"Update Profile"} />
        <div className="flex justify-center p-5">
          <div className="m-14 flex w-3/6 justify-center rounded-lg bg-white p-5 shadow">
            <div>
              <div>
                <img
                  src={
                    //userData.image ||
                    "https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                  }
                  referrerPolicy="no-referrer"
                  alt="image"
                  className="mx-auto h-32 rounded-full shadow-xl"
                />
                <div className="m-4 flex h-full flex-col">
                  <div className="flex justify-center gap-5">
                    <input
                      required
                      className="rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
                      placeholder="Prénom"
                      onChange={handleChange("firstName")}
                      value={userData.firstName}
                    />
                    <input
                      className="rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
                      placeholder="Nom de famille"
                      required
                      onChange={handleChange("lastName")}
                      value={userData.lastName}
                    />
                    <input
                      type="date"
                      className="rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
                      value={userData.birthDate}
                      onChange={handleChange("birthDate")}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <textarea
                    className="mt-5 rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-start text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
                    placeholder="Description"
                    required
                    rows={4}
                    onChange={handleChange("description")}
                    value={userData.description}
                  />
                </div>
              </div>
              {session &&
                userProfile.data &&
                userProfile.data.attribute &&
                session.role === Roles.TENANT && (
                  <LocataireProfile
                    attData={attData}
                    setAttData={setAttData}
                    userAtt={userProfile.data.attribute}
                  />
                )}
              {
                <div className=" flex justify-center pt-4">
                  <button
                    className="rounded-md bg-indigo-500 p-3 text-white "
                    onClick={handleClick}
                  >
                    Enregistrer
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </LoggedLayout>
  );
};

export default Update;
