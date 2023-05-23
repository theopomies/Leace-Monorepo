import { ChangeEventHandler } from "react";
import { Checkbox } from "../shared/forms/Checkbox";
import { HomeType } from "../../types/homeType";
import React from "react";
import { AddressAutocomplete } from "../shared/forms/AddressAutocomplete";
interface AttributesFormProps {
  location: string;
  handleLocationChange: ChangeEventHandler<HTMLInputElement>;
  maxPrice: number;
  handleMaxPriceChange: ChangeEventHandler<HTMLInputElement>;
  minPrice: number;
  handleMinPriceChange: ChangeEventHandler<HTMLInputElement>;
  maxSize: number;
  handleMaxSizeChange: ChangeEventHandler<HTMLInputElement>;
  minSize: number;
  handleMinSizeChange: ChangeEventHandler<HTMLInputElement>;
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
}

export function AttributesForm({ ...attributes }: AttributesFormProps) {
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
  ];

  return (
    <div className="flex justify-center">
      <div className="border-blueGray-200 mt-5 h-auto w-full border-t text-center">
        <AddressAutocomplete
          location={attributes.location}
          handleLocationChange={attributes.handleLocationChange}
        />
        <div className="mt-5 px-16">
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            What are you looking for ?
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
              Appartment
            </Checkbox>
            <Checkbox
              name="homeType"
              onChange={attributes.handleHomeTypeChange}
              checked={!attributes.homeType}
              value={undefined}
            >
              Whatever
            </Checkbox>
          </div>
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            Additionnal filters
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
      </div>
    </div>
  );
}
