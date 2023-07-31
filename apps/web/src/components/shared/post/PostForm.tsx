/* eslint-disable @next/next/no-img-element */
import React, {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button } from "../button/Button";
import { Input } from "../forms/Input";
import { TextArea } from "../forms/TextArea";
import { FileInput } from "../forms/FileInput";
import { HomeType } from "../../../types/homeType";
import { DocumentList } from "../document/DocumentList";
import { ImageList } from "./ImageList";
import { Post, Attribute, Image, Document } from "@prisma/client";
import { PostAttributesForm } from "../../attributes/PostAttributesForm";

export type PostFormData = {
  title: string;
  description: string;
  location: string;
  price: number;
  size: number;
  furnished: boolean;
  homeType: HomeType | undefined;
  terrace: boolean;
  pets: boolean;
  smoker: boolean;
  disability: boolean;
  garden: boolean;
  parking: boolean;
  elevator: boolean;
  pool: boolean;
};

export interface PostFormProps {
  post?: (Post & { attribute: Attribute | null }) | undefined;
  images?: File[] | undefined;
  setImages?: ChangeEventHandler;
  onImgsUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImgDelete?: (imageId: string) => Promise<void>;
  imagesGet?: (Image & { url: string })[] | null | undefined;
  documents?: File[] | undefined;
  setDocuments?: ChangeEventHandler;
  onDocsUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDocDelete?: (documentId: string) => Promise<void>;
  documentsGet?: (Document & { url: string })[] | null | undefined;
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}

export const PostForm = (props: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [location, setLocation] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [homeType, setHomeType] = useState<HomeType | undefined>();
  const [terrace, setTerrace] = useState(false);
  const [pets, setPets] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [garden, setGarden] = useState(false);
  const [parking, setParking] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [disability, setDisability] = useState(false);
  const [pool, setPool] = useState(false);
  const [size, setSize] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (props.post) {
      setTitle(props.post.title ?? "");
      setDescription(props.post.desc ?? "");
      setLocation(props.post.attribute?.location ?? "");
      setHomeType(props.post.attribute?.homeType ?? undefined);
      setSize(props.post.attribute?.size ?? 0);
      setPrice(props.post.attribute?.price ?? 0);
      setFurnished(props.post.attribute?.furnished ?? false);
      setTerrace(props.post.attribute?.terrace ?? false);
      setPets(props.post.attribute?.pets ?? false);
      setSmoker(props.post.attribute?.smoker ?? false);
      setGarden(props.post.attribute?.garden ?? false);
      setParking(props.post.attribute?.parking ?? false);
      setElevator(props.post.attribute?.elevator ?? false);
      setPool(props.post.attribute?.pool ?? false);
      setDisability(props.post.attribute?.disability ?? false);
    }
  }, [props.post]);

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
    };

  const handleBooleanChange =
    (setter: Dispatch<SetStateAction<boolean>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.checked);
    };

  const handleNumberChange =
    (setter: Dispatch<SetStateAction<number>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.valueAsNumber);
    };

  const handleHomeTypeChange =
    (setter: Dispatch<SetStateAction<HomeType | undefined>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value as HomeType);
    };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data: PostFormData = {
      title,
      description,
      location,
      price,
      size,
      furnished,
      homeType,
      terrace,
      pets,
      smoker,
      disability,
      garden,
      parking,
      elevator,
      pool,
    };
    props.onSubmit(data);
  };

  const attributesStates = {
    location,
    handleLocationChange: handleChange(setLocation),
    price,
    handlePriceChange: handleNumberChange(setPrice),
    size,
    handleSizeChange: handleNumberChange(setSize),
    furnished,
    handleFurnishedChange: handleBooleanChange(setFurnished),
    homeType,
    handleHomeTypeChange: handleHomeTypeChange(setHomeType),
    terrace,
    handleTerraceChange: handleBooleanChange(setTerrace),
    pets,
    handlePetsChange: handleBooleanChange(setPets),
    smoker,
    handleSmokerChange: handleBooleanChange(setSmoker),
    disability,
    handleDisabilityChange: handleBooleanChange(setDisability),
    garden,
    handleGardenChange: handleBooleanChange(setGarden),
    parking,
    handleParkingChange: handleBooleanChange(setParking),
    elevator,
    handleElevatorChange: handleBooleanChange(setElevator),
    pool,
    handlePoolChange: handleBooleanChange(setPool),
  };

  return (
    <form
      className="m-auto my-5 flex w-fit flex-col justify-center rounded-lg bg-white p-12 shadow"
      onSubmit={handleSubmit}
    >
      <div className="pb-5">
        <div>
          <label className="text-lg font-medium">Title</label>
          <Input
            placeholder="Apartment in Central Park"
            name="title"
            onChange={handleChange(setTitle)}
            value={title}
            className="w-full"
          />
        </div>
        <div className="mt-5">
          <label>Description</label>
          <TextArea
            placeholder="Description"
            name="description"
            onChange={handleChange(setDescription)}
            value={description}
            className="w-full"
          />
        </div>
      </div>
      <PostAttributesForm {...attributesStates} />
      <ImageList images={props.imagesGet} onDelete={props.onImgDelete} />
      <div className="mb-5 mt-2 flex flex-wrap justify-center gap-4">
        <FileInput multiple onChange={props.setImages || props.onImgsUpload}>
          Upload Image
        </FileInput>
        {props.images?.map((image, index) => (
          <p key={index}>{image.name}</p>
        ))}
      </div>
      <DocumentList
        documents={props.documentsGet}
        onDelete={props.onDocDelete}
        isLoggedInOrAdmin
      />
      <div className="mt-2 flex flex-wrap justify-center gap-4">
        <FileInput
          multiple
          onChange={props.setDocuments || props.onDocsUpload}
          accept=".pdf"
        >
          Upload Document
        </FileInput>
        {props.documents?.map((document, index) => (
          <p key={index}>{document.name}</p>
        ))}
      </div>
      <div className="mt-10 flex justify-center gap-4">
        <Button type="button" theme="danger" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button>Submit</Button>
      </div>
    </form>
  );
};
