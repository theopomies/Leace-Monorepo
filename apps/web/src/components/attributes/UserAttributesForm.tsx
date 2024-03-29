import { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { Checkbox } from "../shared/forms/Checkbox";
import { HomeType } from "../../types/homeType";
import React from "react";
import { AddressAutocomplete } from "../shared/forms/AddressAutocomplete";
import { NumberInput } from "../shared/forms/NumberInput";

interface UserAttributesFormProps {
  location?: string;
  handleLocationChange: ChangeEventHandler<HTMLInputElement>;
  range?: number;
  handleRangeChange: ChangeEventHandler<HTMLInputElement>;
  maxPrice?: number;
  handleMaxPriceChange: ChangeEventHandler<HTMLInputElement>;
  minPrice?: number;
  handleMinPriceChange: ChangeEventHandler<HTMLInputElement>;
  maxSize?: number;
  handleMaxSizeChange: ChangeEventHandler<HTMLInputElement>;
  minSize?: number;
  handleMinSizeChange: ChangeEventHandler<HTMLInputElement>;
  maxBedrooms?: number;
  handleMaxBedroomsChange: ChangeEventHandler<HTMLInputElement>;
  minBedrooms?: number;
  handleMinBedroomsChange: ChangeEventHandler<HTMLInputElement>;
  maxBathrooms?: number;
  handleMaxBathroomsChange: ChangeEventHandler<HTMLInputElement>;
  minBathrooms?: number;
  handleMinBathroomsChange: ChangeEventHandler<HTMLInputElement>;
  furnished?: boolean;
  handleFurnishedChange: Dispatch<SetStateAction<boolean | undefined>>;
  homeType?: HomeType;
  handleHomeTypeChange: ChangeEventHandler<HTMLInputElement>;
  terrace?: boolean;
  handleTerraceChange: Dispatch<SetStateAction<boolean | undefined>>;
  pets?: boolean;
  handlePetsChange: Dispatch<SetStateAction<boolean | undefined>>;
  smoker?: boolean;
  handleSmokerChange: Dispatch<SetStateAction<boolean | undefined>>;
  disability?: boolean;
  handleDisabilityChange: Dispatch<SetStateAction<boolean | undefined>>;
  garden?: boolean;
  handleGardenChange: Dispatch<SetStateAction<boolean | undefined>>;
  parking?: boolean;
  handleParkingChange: Dispatch<SetStateAction<boolean | undefined>>;
  elevator?: boolean;
  handleElevatorChange: Dispatch<SetStateAction<boolean | undefined>>;
  pool?: boolean;
  handlePoolChange: Dispatch<SetStateAction<boolean | undefined>>;
  securityAlarm?: boolean;
  handleSecurityAlarmChange: Dispatch<SetStateAction<boolean | undefined>>;
  internetFiber?: boolean;
  handleInternetFiberChange: Dispatch<SetStateAction<boolean | undefined>>;
}

export function UserAttributesForm({ ...attributes }: UserAttributesFormProps) {
  const attributesList: {
    label: string;
    name: string;
    handleChange: Dispatch<SetStateAction<boolean | undefined>>;
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
      <div className="h-auto w-full pb-5 text-center">
        <ul className="flex flex-wrap gap-4">
          <li className="flex-grow pr-8">
            <h3 className="text-left text-xl">Location</h3>
            <AddressAutocomplete
              location={attributes.location ?? ""}
              handleLocationChange={attributes.handleLocationChange}
            />
          </li>
          <li>
            <h3 className="text-left text-xl">Range</h3>
            <NumberInput
              placeholder="50 by default"
              aria-describedby="amount-prefix"
              name="range"
              onChange={attributes.handleRangeChange}
              value={attributes.range || ""}
              unit="km"
            />
          </li>
        </ul>
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
              Apartment
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
          <div className="flex w-full flex-wrap justify-start gap-4">
            {attributesList.map((att) => (
              <div key={att.name} className="flex-grow">
                <h3 className="p-2 text-lg font-semibold">{att.label}</h3>
                <div className="flex justify-center gap-2">
                  <Checkbox
                    name={att.name}
                    onChange={() => att.handleChange(false)}
                    checked={
                      (attributes[
                        att.name as keyof typeof attributes
                      ] as boolean) === false
                    }
                  >
                    ❌
                  </Checkbox>
                  <Checkbox
                    name={att.name}
                    onChange={() => att.handleChange(undefined)}
                    checked={
                      attributes[att.name as keyof typeof attributes] ===
                      undefined
                    }
                  >
                    Whatever
                  </Checkbox>
                  <Checkbox
                    name={att.name}
                    onChange={() => att.handleChange(true)}
                    checked={
                      attributes[att.name as keyof typeof attributes] as boolean
                    }
                  >
                    ✅
                  </Checkbox>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-around gap-4">
          <label>
            <div>Min price</div>
            <NumberInput
              placeholder="500"
              aria-describedby="amount-prefix"
              name="price"
              onChange={attributes.handleMinPriceChange}
              value={attributes.minPrice || ""}
              unit="$"
            />
          </label>
          <label>
            <div>Max price</div>
            <NumberInput
              placeholder="2000"
              aria-describedby="amount-prefix"
              name="price"
              onChange={attributes.handleMaxPriceChange}
              value={attributes.maxPrice || ""}
              unit="$"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-around gap-4">
          <label>
            <div>Min size</div>
            <NumberInput
              placeholder="10"
              aria-describedby="amount-prefix"
              name="size"
              onChange={attributes.handleMinSizeChange}
              value={attributes.minSize || ""}
              unit="m²"
            />
          </label>
          <label>
            <div>Max size</div>
            <NumberInput
              placeholder="100"
              aria-describedby="amount-prefix"
              name="size"
              onChange={attributes.handleMaxSizeChange}
              value={attributes.maxSize || ""}
              unit="m²"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-around gap-4">
          <label>
            <div>Min bedrooms</div>
            <NumberInput
              placeholder="2"
              aria-describedby="amount-prefix"
              name="bedrooms"
              onChange={attributes.handleMinBedroomsChange}
              value={attributes.minBedrooms || ""}
            />
          </label>
          <label>
            <div>Max bedrooms</div>
            <NumberInput
              placeholder="5"
              aria-describedby="amount-prefix"
              name="bedrooms"
              onChange={attributes.handleMaxBedroomsChange}
              value={attributes.maxBedrooms || ""}
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-around gap-4">
          <label>
            <div>Min bathrooms</div>
            <NumberInput
              placeholder="1"
              aria-describedby="amount-prefix"
              name="bathrooms"
              onChange={attributes.handleMinBathroomsChange}
              value={attributes.minBathrooms || ""}
            />
          </label>
          <label>
            <div>Max bathrooms</div>
            <NumberInput
              placeholder="3"
              aria-describedby="amount-prefix"
              name="bahtrooms"
              onChange={attributes.handleMaxBathroomsChange}
              value={attributes.maxBathrooms || ""}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
