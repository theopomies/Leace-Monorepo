import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Button } from "../shared/button/Button";
import { NumberInput } from "../shared/forms/NumberInput";
import { HomeType } from "@prisma/client";
import { AddressAutocomplete } from "../shared/forms/AddressAutocomplete";
import { Checkbox } from "../shared/forms/Checkbox";

export function PreferencesForm({ userId }: { userId: string }) {
  const utils = trpc.useContext();
  const { mutate: createUserAttributes } =
    trpc.attribute.updateUserAttributes.useMutation({
      async onSuccess() {
        await utils.onboarding.getUserOnboardingStatus.invalidate();
      },
    });

  const [attributes, setAttributes] = useState<{
    location: string | undefined;
    maxPrice: number | undefined;
    minPrice: number | undefined;
    maxSize: number | undefined;
    minSize: number | undefined;
    furnished: boolean | undefined;
    homeType: HomeType | "";
    terrace: boolean | undefined;
    pets: boolean | undefined;
    smoker: boolean | undefined;
    disability: boolean | undefined;
    garden: boolean | undefined;
    parking: boolean | undefined;
    elevator: boolean | undefined;
    pool: boolean | undefined;
  }>({
    location: undefined,
    maxPrice: undefined,
    minPrice: undefined,
    maxSize: undefined,
    minSize: undefined,
    furnished: undefined,
    homeType: "",
    terrace: undefined,
    pets: undefined,
    smoker: undefined,
    disability: undefined,
    garden: undefined,
    parking: undefined,
    elevator: undefined,
    pool: undefined,
  });

  const attributeNames = Object.keys(attributes).filter(
    (value) =>
      !value.toLowerCase().includes("price") &&
      !value.toLowerCase().includes("size") &&
      value !== "location" &&
      value !== "homeType",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserAttributes({ ...attributes, userId });
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
                  <NumberInput
                    value={attributes.minPrice}
                    onChange={(e) => {
                      setAttributes((prevAttributes) => ({
                        ...prevAttributes,
                        minPrice:
                          e.target.value == ""
                            ? undefined
                            : e.target.valueAsNumber,
                      }));
                    }}
                    placeholder="0"
                  />
                </label>
                <label>
                  <h4>Max</h4>
                  <NumberInput
                    value={attributes.maxPrice}
                    onChange={(e) => {
                      setAttributes((prevAttributes) => ({
                        ...prevAttributes,
                        maxPrice:
                          e.target.value == ""
                            ? undefined
                            : e.target.valueAsNumber,
                      }));
                    }}
                    placeholder="1000"
                  />
                </label>
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="mb-2 text-xl">Size</h3>
              <div className="flex gap-8">
                <label>
                  <h4>Min</h4>
                  <NumberInput
                    value={attributes.minSize}
                    onChange={(e) => {
                      setAttributes((prevAttributes) => ({
                        ...prevAttributes,
                        minSize:
                          e.target.value == ""
                            ? undefined
                            : e.target.valueAsNumber,
                      }));
                    }}
                    placeholder="0"
                  />
                </label>
                <label>
                  <h4>Max</h4>
                  <NumberInput
                    value={attributes.maxSize}
                    onChange={(e) => {
                      setAttributes((prevAttributes) => ({
                        ...prevAttributes,
                        maxSize:
                          e.target.value == ""
                            ? undefined
                            : e.target.valueAsNumber,
                      }));
                    }}
                    placeholder="300"
                  />
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
          <section className="mb-12">
            <div className="flex w-full flex-wrap justify-start gap-4">
              <div className="mx-4 flex-grow">
                <h3 className="p-2 text-center text-xl">Type of place</h3>
                <div className="flex justify-center gap-2">
                  <Checkbox
                    checked={
                      attributes.homeType === "APARTMENT" ||
                      !attributes.homeType
                    }
                    onChange={() => {
                      setAttributes((prevAttributes) => ({
                        ...prevAttributes,
                        homeType: !prevAttributes.homeType
                          ? "HOUSE"
                          : prevAttributes.homeType == "HOUSE"
                          ? ""
                          : "HOUSE",
                      }));
                    }}
                  >
                    Apartment
                  </Checkbox>
                  <Checkbox
                    checked={
                      attributes.homeType === "HOUSE" || !attributes.homeType
                    }
                    onChange={() => {
                      setAttributes((prevAttributes) => ({
                        ...prevAttributes,
                        homeType: !prevAttributes.homeType
                          ? "APARTMENT"
                          : prevAttributes.homeType == "APARTMENT"
                          ? ""
                          : "APARTMENT",
                      }));
                    }}
                  >
                    House
                  </Checkbox>
                </div>
              </div>
              {attributeNames.map((name) => (
                <div key={name} className="flex-grow ">
                  <h3 className="p-2 text-center text-xl">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </h3>
                  <div className="flex justify-center gap-2">
                    <Checkbox
                      name={name}
                      onChange={() =>
                        setAttributes((prevAttributes) => ({
                          ...prevAttributes,
                          [name]: false,
                        }))
                      }
                      checked={
                        (attributes[
                          name as keyof typeof attributes
                        ] as boolean) === false
                      }
                    >
                      ❌
                    </Checkbox>
                    <Checkbox
                      name={name}
                      onChange={() =>
                        setAttributes((prevAttributes) => ({
                          ...prevAttributes,
                          [name]: undefined,
                        }))
                      }
                      checked={
                        attributes[name as keyof typeof attributes] == undefined
                      }
                    >
                      Whatever
                    </Checkbox>
                    <Checkbox
                      name={name}
                      onChange={() =>
                        setAttributes((prevAttributes) => ({
                          ...prevAttributes,
                          [name]: true,
                        }))
                      }
                      checked={
                        attributes[name as keyof typeof attributes] as boolean
                      }
                    >
                      ✅
                    </Checkbox>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="flex w-full justify-end pr-12">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </div>
    </>
  );
}
