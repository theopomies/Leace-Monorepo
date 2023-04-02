import { useEffect, useState } from "react";
import { RouterInputs, trpc } from "../../../utils/trpc";
import { Role } from "@prisma/client";
import { Header } from "../../../components/users/Header";
import { LocataireProfile } from "./ModifyLocataireProfile";
import { useRouter } from "next/router";

export interface UpdateUserPageProps {
  userId: string;
}

export function UpdateUserPage({ userId }: UpdateUserPageProps) {
  const router = useRouter();
  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: userProfile } = trpc.user.getUserById.useQuery({ userId });
  const updateUser = trpc.user.updateUserById.useMutation();
  const [userData, setUserData] = useState<
    RouterInputs["user"]["updateUserById"]
  >({
    userId: "",
    birthDate: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    description: "",
  });

  const updateAtt = trpc.attribute.updateUserAttributes.useMutation();
  const [attData, setAttData] = useState<
    RouterInputs["attribute"]["updateUserAttributes"]
  >({
    userId: "",
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

  const handleClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await updateUser.mutateAsync(userData);
    updateAtt.mutate(attData);
    router.push("/users/me");
  };

  useEffect(() => {
    if (userProfile) {
      setUserData({
        userId: userProfile.id,
        birthDate: userProfile.birthDate?.toDateString() ?? "",
        firstName: userProfile.firstName ?? "",
        lastName: userProfile.lastName ?? "",
        phoneNumber: userProfile.phoneNumber ?? "",
        description: userProfile.description ?? "",
      });
    }
  }, [userProfile]);
  return (
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
              userProfile &&
              userProfile.attribute &&
              session.role === Role.TENANT && (
                <LocataireProfile
                  attData={attData}
                  setAttData={setAttData}
                  userAtt={userProfile.attribute}
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
  );
}
