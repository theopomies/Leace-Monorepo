/* eslint-disable @next/next/no-img-element */
import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
} from "react";
import { Button } from "../button/Button";
import { Input } from "../forms/Input";
import { TextArea } from "../forms/TextArea";
import { FileInput } from "../forms/FileInput";
import { HomeType } from "../../../types/homeType";
import { DocumentsList } from "../document/DocumentsList";
import { ImagesList } from "./ImagesList";
import { Image, Document } from "@prisma/client";
import { AttributesPostForm } from "../../attributes/AttributesPostForm";

export interface PostFormProps {
  title: string;
  setTitle: ChangeEventHandler;
  description: string;
  setDescription: ChangeEventHandler;
  location: string;
  setLocation: ChangeEventHandler;
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
  garden: boolean;
  setGarden: ChangeEventHandler;
  parking: boolean;
  setParking: ChangeEventHandler;
  elevator: boolean;
  setElevator: ChangeEventHandler;
  disability: boolean;
  setDisability: ChangeEventHandler;
  pool: boolean;
  setPool: ChangeEventHandler;
  size: number;
  setSize: ChangeEventHandler;
  price: number;
  setPrice: ChangeEventHandler;
  images: File[] | undefined;
  setImages: ChangeEventHandler;
  imagesGet?: (Image & { url: string })[] | undefined;
  documents: File[] | undefined;
  setDocuments: ChangeEventHandler;
  documentsGet?: (Document & { url: string })[] | undefined;
  onSubmit: FormEventHandler;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}

export const PostForm = (props: PostFormProps) => {
  const attributesStates = {
    location: props.location,
    handleLocationChange: props.setLocation,
    price: props.price,
    handlePriceChange: props.setPrice,
    size: props.size,
    handleSizeChange: props.setSize,
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
      <div className="h-auto">
        <div>
          <label className="text-lg font-medium">Title</label>
          <Input
            placeholder="Appartment in Central Park"
            name="title"
            onChange={props.setTitle}
            value={props.title}
            className="w-full"
          />
        </div>
        <div className="mt-5">
          <label>Description</label>
          <TextArea
            placeholder="Description"
            name="description"
            onChange={props.setDescription}
            value={props.description}
            className="w-full"
          />
        </div>
        <AttributesPostForm {...attributesStates} />
        <div className="mt-10 text-center">
          <ImagesList images={props.imagesGet} />
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <FileInput multiple onChange={props.setImages}>
              Upload Image
            </FileInput>
            {props.images?.map((image, index) => (
              <p key={index}>{image.name}</p>
            ))}
          </div>
        </div>
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
        <div className="mt-10 flex justify-center gap-4">
          <Button type="button" theme="danger" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button>Submit</Button>
        </div>
      </div>
    </form>
  );
};
