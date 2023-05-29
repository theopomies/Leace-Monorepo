/* eslint-disable @next/next/no-img-element */
import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
} from "react";
import { Button } from "../shared/button/Button";
import { Input } from "../shared/forms/Input";
import { Checkbox } from "../shared/forms/Checkbox";
import { TextArea } from "../shared/forms/TextArea";
import { NumberInput } from "../shared/forms/NumberInput";
import { FileInput } from "../shared/forms/FileInput";
import { HomeType } from "../../types/homeType";
import { AddressAutocomplete } from "../shared/forms/AddressAutocomplete";
import { DocumentsList } from "../shared/document/DocumentsList";
import { ImagesList } from "../shared/post/ImagesList";

type Image =
  | {
      url: string;
      id: string;
      ext: string;
      postId: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[]
  | undefined;

type Document =
  | {
      url: string;
      id: string;
      userId: string | null;
      leaseId: string | null;
      postId: string | null;
      valid: boolean;
      ext: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  | undefined;

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
  imagesGet?: Image;
  documents: File[] | undefined;
  setDocuments: ChangeEventHandler;
  documentsGet?: Document;
  onSubmit: FormEventHandler;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}

export const PostForm = (props: PostFormProps) => {
  return (
    <form className="flex justify-center" onSubmit={props.onSubmit}>
      <div className="my-10 flex justify-center rounded-lg bg-white p-12 shadow">
        <div className="h-auto">
          <div className="flex w-full">
            <label className="w-full">
              <div className="text-lg font-medium">Title</div>
              <Input
                placeholder="Appartment in Central Park"
                name="title"
                onChange={props.setTitle}
                value={props.title}
                className="w-full"
              />
            </label>
          </div>
          <div className="mt-6 flex w-full">
            <label className="w-full">
              <div className="text-lg font-medium">Location</div>
              <AddressAutocomplete
                location={props.location}
                handleLocationChange={props.setLocation}
              ></AddressAutocomplete>
            </label>
          </div>

          <div className="mt-6">
            <h2 className="text-center text-xl font-medium text-gray-700">
              Type de logement
            </h2>
            <div className="flex justify-center gap-4 p-4">
              <label>
                <Checkbox
                  name="homeType"
                  onChange={props.setHomeType}
                  checked={props.homeType === "HOUSE"}
                  value={"HOUSE"}
                >
                  Maison
                </Checkbox>
              </label>
              <label>
                <Checkbox
                  name="homeType"
                  onChange={props.setHomeType}
                  checked={props.homeType === "APARTMENT"}
                  value={"APARTMENT"}
                >
                  Appartement
                </Checkbox>
              </label>
            </div>
          </div>
          <div>
            <TextArea
              placeholder="Description"
              name="description"
              onChange={props.setDescription}
              value={props.description}
              className="w-full"
            />
          </div>
          <div className="mt-6">
            <h2 className="text-center text-xl font-medium text-gray-700">
              Critères
            </h2>
            <div className="flex flex-wrap justify-center gap-4 p-4">
              <Checkbox
                name="furnished"
                onChange={props.setFurnished}
                checked={props.furnished}
              >
                Fournis
              </Checkbox>
              <Checkbox
                name="pool"
                onChange={props.setPool}
                checked={props.pool}
              >
                Piscine
              </Checkbox>
              <Checkbox
                name="smoker"
                onChange={props.setSmoker}
                checked={props.smoker}
              >
                Fumer
              </Checkbox>
              <Checkbox
                name="terrace"
                onChange={props.setTerrace}
                checked={props.terrace}
              >
                Terasse
              </Checkbox>
              <Checkbox
                name="elevator"
                onChange={props.setElevator}
                checked={props.elevator}
              >
                Ascenseur
              </Checkbox>
              <Checkbox
                name="parking"
                onChange={props.setParking}
                checked={props.parking}
              >
                Parking
              </Checkbox>
              <Checkbox
                name="garden"
                onChange={props.setGarden}
                checked={props.garden}
              >
                Jardin
              </Checkbox>
              <Checkbox
                name="pets"
                onChange={props.setPets}
                checked={props.pets}
              >
                Animaux
              </Checkbox>
              <Checkbox
                name="disability"
                onChange={props.setDisability}
                checked={props.disability}
              >
                Handicap
              </Checkbox>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-around gap-4">
            <label>
              <div>Surface</div>
              <NumberInput
                placeholder="Surface"
                aria-describedby="amount-prefix"
                name="size"
                onChange={props.setSize}
                value={props.size}
                unit="m²"
              />
            </label>
            <label>
              <div>Prix du loyer</div>
              <NumberInput
                placeholder="Prix"
                aria-describedby="amount-prefix"
                name="price"
                onChange={props.setPrice}
                value={props.price}
                unit="€"
              />
            </label>
          </div>
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
      </div>
    </form>
  );
};
