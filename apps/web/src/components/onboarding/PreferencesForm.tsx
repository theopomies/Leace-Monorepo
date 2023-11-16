import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { UserAttributesForm } from "../attributes/UserAttributesForm";
import { Button } from "../shared/button/Button";
import { NumberInput } from "../shared/forms/NumberInput";
import { ToastDescription, ToastTitle, useToast } from "../shared/toast/Toast";
import { HomeType } from "@prisma/client";
import { AddressAutocomplete } from "../shared/forms/AddressAutocomplete";

export function PreferencesForm({ userId }: { userId: string }) {
  const utils = trpc.useContext();
  const { mutate: createUserAttributes } =
    trpc.attribute.updateUserAttributes.useMutation();

  const [attributes, setAttributes] = useState<{
    location: string | null;
    maxPrice: number | null;
    minPrice: number | null;
    maxSize: number | null;
    minSize: number | null;
    furnished: boolean | null;
    homeType: HomeType | "";
    terrace: boolean | null;
    pets: boolean | null;
    smoker: boolean | null;
    disability: boolean | null;
    garden: boolean | null;
    parking: boolean | null;
    elevator: boolean | null;
    pool: boolean | null;
  }>({
    location: null,
    maxPrice: null,
    minPrice: null,
    maxSize: null,
    minSize: null,
    furnished: null,
    homeType: "",
    terrace: null,
    pets: null,
    smoker: null,
    disability: null,
    garden: null,
    parking: null,
    elevator: null,
    pool: null,
  });

  const { renderToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    renderToast(
      <>
        <ToastTitle>That&apos;s it, you&apos;re all set ✅</ToastTitle>
        <ToastDescription>
          You can now start trying to match with your dream property
        </ToastDescription>
      </>,
    );
  };

  return (
    <>
      <div className="h-2 w-[75%] bg-indigo-500" />
      <div className=" mx-96 flex flex-grow flex-col gap-24 text-lg">
        <div>
          <h1 className="mt-40 text-center text-4xl">
            One last thing, tell us what you are looking for!
          </h1>
          <h2 className="mt-8 text-center text-xl text-slate-500">
            These are the most important informations, for smaller details, you
            can update your preferences later
          </h2>
        </div>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <section className="flex gap-8">
            <div className="flex-grow">
              <h3 className="mb-2 text-xl">Budget</h3>
              <div className="flex gap-8">
                <label>
                  <h4>Min</h4>
                  <NumberInput />
                </label>
                <label>
                  <h4>Max</h4>
                  <NumberInput />
                </label>
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="mb-2 text-xl">Size</h3>
              <div className="flex gap-8">
                <label>
                  <h4>Min</h4>
                  <NumberInput />
                </label>
                <label>
                  <h4>Max</h4>
                  <NumberInput />
                </label>
              </div>
            </div>
          </section>
          <section>
            <label className="flex flex-col gap-2">
              <h3 className="text-xl">Location</h3>
              <div className="flex w-[50%]">
                <AddressAutocomplete
                  required
                  location={attributes.location ?? ""}
                  handleLocationChange={(e) => {
                    setAttributes((prevAttributes) => ({
                      ...prevAttributes,
                      location: e.target.value,
                    }));
                  }}
                />
              </div>
            </label>
          </section>
          <div className="flex w-full justify-end pr-12">
            <Button type="submit">Finish setting me up</Button>
          </div>
        </form>
      </div>
    </>
  );
}
