import { Spinner } from "./Spinner";

export const Loader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
};
