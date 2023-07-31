import { ChangeEventHandler } from "react";
import { Checkbox } from "../shared/forms/Checkbox";
import { HomeType } from "../../types/homeType";
import React from "react";
import { AddressAutocomplete } from "../shared/forms/AddressAutocomplete";
import { NumberInput } from "../shared/forms/NumberInput";
import { TextInput } from "../shared/forms/TextInput";

interface PostAttributesFormProps {
  location: string;
  handleLocationChange: ChangeEventHandler<HTMLInputElement>;
  price: number;
  handlePriceChange: ChangeEventHandler<HTMLInputElement>;
  size: number;
  handleSizeChange: ChangeEventHandler<HTMLInputElement>;
  furnished: boolean;
  handleFurnishedChange: ChangeEventHandler<HTMLInputElement>;
  homeType: HomeType | undefined;
  handleHomeTypeChange: ChangeEventHandler<HTMLInputElement>;
  terrace: boolean;
  handleTerraceChange: ChangeEventHandler<HTMLInputElement>;
  pets: boolean;
  handlePetsChange: ChangeEventHandler<HTMLInputElement>;
  smoker: boolean;
  handleSmokerChange: ChangeEventHandler<HTMLInputElement>;
  disability: boolean;
  handleDisabilityChange: ChangeEventHandler<HTMLInputElement>;
  garden: boolean;
  handleGardenChange: ChangeEventHandler<HTMLInputElement>;
  parking: boolean;
  handleParkingChange: ChangeEventHandler<HTMLInputElement>;
  elevator: boolean;
  handleElevatorChange: ChangeEventHandler<HTMLInputElement>;
  pool: boolean;
  handlePoolChange: ChangeEventHandler<HTMLInputElement>;
  securityAlarm: boolean;
  handleSecurityAlarmChange: ChangeEventHandler<HTMLInputElement>;
  internetFiber: boolean;
  handleInternetFiberChange: ChangeEventHandler<HTMLInputElement>;
}

export function PostAttributesForm({ ...attributes }: PostAttributesFormProps) {
  const attributesList: {
    label: string;
    name: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
  }[] = [
    {
      name: "furnished",
      label: "Furnished",
      handleChange: attributes.handleFurnishedChange,
    },
    {
      name: "terrace",
      label: "Terrace",
      handleChange: attributes.handleTerraceChange,
    },
    {
      name: "pets",
      label: "Pets",
      handleChange: attributes.handlePetsChange,
    },
    {
      name: "smoker",
      label: "Smoker",
      handleChange: attributes.handleSmokerChange,
    },
    {
      name: "disability",
      label: "Disability",
      handleChange: attributes.handleDisabilityChange,
    },
    {
      name: "garden",
      label: "Garden",
      handleChange: attributes.handleGardenChange,
    },
    {
      name: "parking",
      label: "Parking",
      handleChange: attributes.handleParkingChange,
    },
    {
      name: "elevator",
      label: "Elevator",
      handleChange: attributes.handleElevatorChange,
    },
    {
      name: "pool",
      label: "Pool",
      handleChange: attributes.handlePoolChange,
    },
    {
      name: "securityAlarm",
      label: "Security alarm",
      handleChange: attributes.handleSecurityAlarmChange,
    },
    {
      name: "internetFiber",
      label: "Internet fiber",
      handleChange: attributes.handleInternetFiberChange,
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="h-auto w-full border-t py-5 text-center">
        <AddressAutocomplete
          location={attributes.location}
          handleLocationChange={attributes.handleLocationChange}
        />
        <div className="mt-5 px-16">
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            Home type
          </h2>
          <div className="flex w-full justify-center gap-1">
            <Checkbox
              name="homeType"
              onChange={attributes.handleHomeTypeChange}
              checked={attributes.homeType === "HOUSE"}
              value={"HOUSE"}
            >
              House
            </Checkbox>
            <Checkbox
              name="homeType"
              onChange={attributes.handleHomeTypeChange}
              checked={attributes.homeType === "APARTMENT"}
              value={"APARTMENT"}
            >
              Apartment
            </Checkbox>
          </div>
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            Criteria
          </h2>
          <div className="flex w-full justify-center gap-1">
            {attributesList.map((att) => (
              <Checkbox
                key={att.name}
                name={att.name}
                onChange={att.handleChange}
                checked={!!attributes[att.name as keyof typeof attributes]}
              >
                {att.label}
              </Checkbox>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-around gap-4">
          <label>
            <div>Size</div>
            <NumberInput
              placeholder="50"
              aria-describedby="amount-prefix"
              name="size"
              onChange={attributes.handleSizeChange}
              value={attributes.size}
              unit="m²"
            />
          </label>
          <label>
            <div>Price</div>
            <NumberInput
              placeholder="1000"
              aria-describedby="amount-prefix"
              name="price"
              onChange={attributes.handlePriceChange}
              value={attributes.price}
              unit="€"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
