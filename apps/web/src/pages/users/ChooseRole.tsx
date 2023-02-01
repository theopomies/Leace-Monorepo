import React from "react";
import { useRouter } from "next/router";
import { RouterInputs, trpc } from "../../utils/trpc";
import { Roles } from "@prisma/client";

const ChooseRoles = () => {
  const router = useRouter();
  const { data: session } = trpc.auth.getSession.useQuery();
  const userRole = trpc.user.updateUserRole.useMutation();

  const handleClick = async (
    e: { preventDefault: () => void },
    role: RouterInputs["user"]["updateUserRole"],
  ) => {
    e.preventDefault();
    if (!session) return;
    userRole.mutate(role);
    router.push("/users/UpdateProfile");
  };
  if (session?.user.role === Roles.NONE) {
    return (
      <div className="h-full bg-slate-100">
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Welcome
          </h1>
          <p className="text-xl font-medium">Choose your role</p>
          <div className="flex justify-center">
            <button
              className="m-2 rounded-lg bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-700"
              onClick={(e) => handleClick(e, Roles.TENANT)}
            >
              Locataire
            </button>
            <button
              className="m-2 rounded-lg bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-700"
              onClick={(e) => handleClick(e, Roles.OWNER)}
            >
              Propriétaire
            </button>
            <button
              className="m-2 rounded-lg bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-700"
              onClick={(e) => handleClick(e, Roles.AGENCY)}
            >
              Agence
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ChooseRoles;
