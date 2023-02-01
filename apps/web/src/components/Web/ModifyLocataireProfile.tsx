/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc, RouterInputs } from "../../utils/trpc";
import { Attribute } from "@prisma/client";
import { LoggedLayout } from "../LoggedLayout";

interface Props {
  setAttData: React.Dispatch<
    React.SetStateAction<RouterInputs["attribute"]["updateUserAtt"]>
  >;
  attData: RouterInputs["attribute"]["updateUserAtt"];
  userAtt: Attribute;
}

const LocataireProfile: React.FC<Props> = ({
  setAttData,
  attData,
  userAtt,
}) => {
  const handleChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number | boolean;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    } else if (event.target.type === "number") {
      value = event.target.value ? parseInt(event.target.value) : 0;
    } else if (event.target.type === "text") {
      value = event.target.value;
    } else {
      value = event.target.value;
    }
    setAttData({
      ...attData,
      [event.target.name]: value,
    });
  };

  useEffect(() => {
    if (userAtt) {
      setAttData({
        ...attData,
        location: userAtt.location || "",
        maxPrice: userAtt.maxPrice || 0,
        minPrice: userAtt.minPrice || 0,
        maxSize: userAtt.maxSize || 0,
        minSize: userAtt.minSize || 0,
        house: userAtt.house || false,
        appartment: userAtt.appartment || false,
        furnished: userAtt.furnished || false,
        terrace: userAtt.terrace || false,
        pets: userAtt.pets || false,
        smoker: userAtt.smoker || false,
        disability: userAtt.disability || false,
        garden: userAtt.garden || false,
        parking: userAtt.parking || false,
        elevator: userAtt.elevator || false,
        pool: userAtt.pool || false,
      });
    }
  }, [userAtt, setAttData]);

  return (
    <div className="flex justify-center">
      <form className="border-blueGray-200 mt-5 h-auto w-full border-t text-center">
        <div className="sticky mt-5 flex w-full items-center justify-between rounded-full bg-white p-2 shadow-lg">
          <input
            className="focus:shadow-outline ml-2 w-full rounded-full bg-gray-100 py-4 pl-4 text-xs font-bold uppercase leading-tight text-gray-700 focus:outline-none lg:text-sm"
            type="text"
            placeholder="Search"
            name="location"
            onChange={handleChange()}
            value={attData.location}
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
            Que recherchez-vous ?
          </h2>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="house"
                onChange={handleChange()}
                checked={attData.house}
              />
            </div>
            <label className="ml-3">Maison</label>
          </div>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="appartment"
                onChange={handleChange()}
                checked={attData.appartment}
              />
            </div>
            <label className="ml-3">Appartement</label>
          </div>
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            Critères additionnels
          </h2>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="terrace"
                onChange={handleChange()}
                checked={attData.terrace}
              />
            </div>
            <label className="ml-3">Terrasse</label>
          </div>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="pets"
                onChange={handleChange()}
                checked={attData.pets}
              />
            </div>
            <label className="ml-3">Animaux de compagnie</label>
          </div>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="smoker"
                onChange={handleChange()}
                checked={attData.smoker}
              />
            </div>
            <label className="ml-3">Fumeur</label>
          </div>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="disability"
                onChange={handleChange()}
                checked={attData.disability}
              />
            </div>
            <label className="ml-3">Handicap</label>
          </div>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="garden"
                onChange={handleChange()}
                checked={attData.garden}
              />
            </div>
            <label className="ml-3">Jardin</label>
          </div>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="parking"
                onChange={handleChange()}
                checked={attData.parking}
              />
            </div>
            <label className="ml-3">Garage</label>
          </div>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="elevator"
                onChange={handleChange()}
                checked={attData.elevator}
              />
            </div>
            <label className="ml-3">Ascenseur</label>
          </div>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="pool"
                onChange={handleChange()}
                checked={attData.pool}
              />
            </div>
            <label className="ml-3">Piscine</label>
          </div>
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">Budget</h2>
          <div className="flex justify-between">
            <div className="relative rounded-md shadow-sm">
              <input
                className="form-input block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 py-3 pr-10 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                type="number"
                placeholder="30000"
                name="minPrice"
                onChange={handleChange()}
                value={attData.minPrice}
              />
              <label className="pl-3">Budget min</label>
            </div>
            <div className="relative rounded-md shadow-sm">
              <input
                className="form-input block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 py-3 pr-10 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                type="number"
                placeholder="50000"
                name="maxPrice"
                onChange={handleChange()}
                value={attData.maxPrice}
              />
              <label className="pl-3">Budget max</label>
            </div>
          </div>
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">Surface</h2>
          <div className="flex justify-between">
            <div className="relative rounded-md shadow-sm">
              <input
                className="form-input block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 py-3 pr-10 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                type="number"
                placeholder="30000"
                name="minSize"
                onChange={handleChange()}
                value={attData.minSize}
              />
              <label className="pl-3">Surface min</label>
            </div>
            <div className="relative rounded-md shadow-sm">
              <input
                className="form-input block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 py-3 pr-10 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                type="number"
                placeholder="50000"
                name="maxSize"
                onChange={handleChange()}
                value={attData.maxSize}
              />
              <label className="pl-3">Surface max</label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocataireProfile;
