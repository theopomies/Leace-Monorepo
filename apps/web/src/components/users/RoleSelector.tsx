import { RouterInputs, trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";

export const RoleSelector = () => {
  const utils = trpc.useContext();
  const userRole = trpc.user.updateUserRole.useMutation({
    onSuccess() {
      utils.auth.getSession.invalidate();
    },
  });

  const handleClick = async (
    e: { preventDefault: () => void },
    role: RouterInputs["user"]["updateUserRole"],
  ) => {
    e.preventDefault();
    userRole.mutate(role);
  };

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
            onClick={(e) => handleClick(e, Role.TENANT)}
          >
            Tenant
          </button>
          <button
            className="m-2 rounded-lg bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-700"
            onClick={(e) => handleClick(e, Role.OWNER)}
          >
            Owner
          </button>
          <button
            className="m-2 rounded-lg bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-700"
            onClick={(e) => handleClick(e, Role.AGENCY)}
          >
            Agency
          </button>
        </div>
      </div>
    </div>
  );
};
