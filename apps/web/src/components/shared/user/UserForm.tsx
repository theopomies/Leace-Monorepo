/* eslint-disable @next/next/no-img-element */
import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
} from "react";
import { Button } from "../button/Button";
import { TextArea } from "../forms/TextArea";
import { FileInput } from "../forms/FileInput";
import { HomeType } from "../../../types/homeType";
import { DocumentsList } from "../document/DocumentsList";
import { Document } from "@prisma/client";
import { AttributesUserForm } from "../../attributes/AttributesUserForm";
import { DateInput } from "../forms/DateInput";
import { TextInput } from "../forms/TextInput";
import { User, Role } from "@prisma/client";

export interface UserFormProps {
  user: User | undefined;
  firstName: string;
  setFirstName: ChangeEventHandler;
  lastName: string;
  setLastName: ChangeEventHandler;
  birthDate: string;
  setBirthDate: ChangeEventHandler;
  description: string;
  setDescription: ChangeEventHandler;
  location: string;
  setLocation: ChangeEventHandler;
  maxPrice: number;
  setMaxPrice: ChangeEventHandler;
  minPrice: number;
  setMinPrice: ChangeEventHandler;
  maxSize: number;
  setMaxSize: ChangeEventHandler;
  minSize: number;
  setMinSize: ChangeEventHandler;
  furnished: boolean;
  setFurnished: ChangeEventHandler;
  homeType: HomeType | undefined;
  setHomeType: ChangeEventHandler;
  terrace: boolean;
  setTerrace: ChangeEventHandler;
  pets: boolean;
  setPets: ChangeEventHandler;
  smoker: boolean;
  setSmoker: ChangeEventHandler;
  disability: boolean;
  setDisability: ChangeEventHandler;
  garden: boolean;
  setGarden: ChangeEventHandler;
  parking: boolean;
  setParking: ChangeEventHandler;
  elevator: boolean;
  setElevator: ChangeEventHandler;
  pool: boolean;
  setPool: ChangeEventHandler;
  documents: File[] | undefined;
  setDocuments: ChangeEventHandler;
  documentsGet?: (Document & { url: string })[] | undefined;
  onSubmit: FormEventHandler;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}

export const UserForm = (props: UserFormProps) => {
  const attributesStates = {
    location: props.location,
    handleLocationChange: props.setLocation,
    maxPrice: props.maxPrice,
    handleMaxPriceChange: props.setMaxPrice,
    minPrice: props.minPrice,
    handleMinPriceChange: props.setMinPrice,
    maxSize: props.maxSize,
    handleMaxSizeChange: props.setMaxSize,
    minSize: props.minSize,
    handleMinSizeChange: props.setMinSize,
    furnished: props.furnished,
    handleFurnishedChange: props.setFurnished,
    homeType: props.homeType,
    handleHomeTypeChange: props.setHomeType,
    terrace: props.terrace,
    handleTerraceChange: props.setTerrace,
    pets: props.pets,
    handlePetsChange: props.setPets,
    smoker: props.smoker,
    handleSmokerChange: props.setSmoker,
    disability: props.disability,
    handleDisabilityChange: props.setDisability,
    garden: props.garden,
    handleGardenChange: props.setGarden,
    parking: props.parking,
    handleParkingChange: props.setParking,
    elevator: props.elevator,
    handleElevatorChange: props.setElevator,
    pool: props.pool,
    handlePoolChange: props.setPool,
  };

  return (
    <form
      className="m-auto my-5 flex w-fit flex-col justify-center rounded-lg bg-white p-12 shadow"
      onSubmit={props.onSubmit}
    >
      <div>
        <img
          src={
            props.user && props.user.image
              ? props.user.image
              : "/defaultImage.png"
          }
          referrerPolicy="no-referrer"
          alt="image"
          className="mx-auto h-32 rounded-full shadow-xl"
        />
        <div className="m-4 flex h-full flex-col gap-5">
          <div className="flex justify-center gap-5">
            <TextInput
              required
              placeholder="First Name"
              onChange={props.setFirstName}
              value={props.firstName}
            />
            <TextInput
              required
              placeholder="Last Name"
              onChange={props.setLastName}
              value={props.lastName}
            />
            <DateInput
              required
              value={props.birthDate}
              onChange={props.setBirthDate}
            />
          </div>
          <TextArea
            placeholder="Description"
            onChange={props.setDescription}
            value={props.description}
          />
        </div>
      </div>
      {props.user?.role === Role.TENANT && (
        <AttributesUserForm {...attributesStates} />
      )}
      <div className="mt-10">
        <DocumentsList documents={props.documentsGet} />
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <FileInput multiple onChange={props.setDocuments} accept=".pdf">
            Upload Document
          </FileInput>
          {props.documents?.map((document, index) => (
            <p key={index}>{document.name}</p>
          ))}
        </div>
      </div>
      <div className="mt-10 flex justify-center gap-8">
        <Button theme="danger" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button theme="primary">Update</Button>
      </div>
    </form>
  );
};
