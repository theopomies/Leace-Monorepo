/* eslint-disable @next/next/no-img-element */

export interface TenantBarProps {
  img: string;
  desc: string;
  firstname: string;
  lastName: string;
}

export const TenantBar = ({
  img,
  desc,
  firstname,
  lastName,
}: TenantBarProps) => {
  return (
    <div className="mx-auto my-5 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={img}
            alt="Modern building architecture"
          />
        </div>
        <div className="p-8">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {firstname}
          </div>
          <a
            href="#"
            className="mt-1 block text-lg font-medium leading-tight text-black hover:underline"
          >
            {lastName}
          </a>
          <p className="mt-2 text-slate-500">{desc}</p>
        </div>
      </div>
    </div>
  );
};
