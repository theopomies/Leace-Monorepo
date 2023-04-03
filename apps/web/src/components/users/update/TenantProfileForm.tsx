/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEventHandler } from "react";
import { Checkbox } from "../../shared/forms/Checkbox";

interface TenantProfileFormProps {
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
  house: boolean;
  handleHouseChange: ChangeEventHandler<HTMLInputElement>;
  appartment: boolean;
  handleAppartmentChange: ChangeEventHandler<HTMLInputElement>;
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

export function TenantProfileForm({ ...attributes }: TenantProfileFormProps) {
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
        <div className="sticky mt-5 flex w-full items-center justify-between rounded-full bg-white p-2 shadow-lg">
          <input
            className="focus:shadow-outline ml-2 w-full rounded-full bg-gray-100 py-4 pl-4 text-xs font-bold uppercase leading-tight text-gray-700 focus:outline-none lg:text-sm"
            type="text"
            placeholder="Search"
            name="location"
            onChange={attributes.handleLocationChange}
            value={attributes.location}
          />
          <div className="mx-2 cursor-pointer rounded-full bg-gray-600 p-2 hover:bg-blue-400">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="mt-5 px-16">
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            What are you looking for ?
          </h2>
          <Checkbox
            name="house"
            onChange={attributes.handleHouseChange}
            checked={attributes.house}
          >
            House
          </Checkbox>
          <Checkbox
            name="appartment"
            onChange={attributes.handleAppartmentChange}
            checked={attributes.appartment}
          >
            Appartment
          </Checkbox>
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            Additionnal filters
          </h2>
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
  );
}
