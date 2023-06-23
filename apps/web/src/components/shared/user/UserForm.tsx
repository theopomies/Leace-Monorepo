/* eslint-disable @next/next/no-img-element */
import {
  ChangeEvent,
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button } from "../button/Button";
import { TextArea } from "../forms/TextArea";
import { FileInput } from "../forms/FileInput";
import { HomeType } from "../../../types/homeType";
import { DocumentList } from "../document/DocumentList";
import { UserAttributesForm } from "../../attributes/UserAttributesForm";
import { DateInput } from "../forms/DateInput";
import { TextInput } from "../forms/TextInput";
import { User, Attribute, Image, Document, Role } from "@prisma/client";
import { CrossSvg } from "../icons/CrossSvg";

export type UserFormData = {
  birthDate: string;
  firstName: string;
  lastName: string;
  description: string;
  location: string;
  maxPrice: number;
  minPrice: number;
  maxSize: number;
  minSize: number;
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

export interface UserFormProps {
  user: (User & { attribute: Attribute | null }) | undefined;
  onImgUpload?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onImgDelete?: () => Promise<void>;
  imageGet: (Image & { url: string }) | null | undefined;
  onDocsUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onDocDelete: (documentId: string) => Promise<void>;
  documentsGet: (Document & { url: string })[] | null | undefined;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}

export const UserForm = (props: UserFormProps) => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxSize, setMaxSize] = useState(0);
  const [minSize, setMinSize] = useState(0);
  const [furnished, setFurnished] = useState(false);
  const [homeType, setHomeType] = useState<HomeType | undefined>();
  const [terrace, setTerrace] = useState(false);
  const [pets, setPets] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [disability, setDisability] = useState(false);
  const [garden, setGarden] = useState(false);
  const [parking, setParking] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [pool, setPool] = useState(false);

  useEffect(() => {
    if (props.user) {
      const date = props.user.birthDate
        ? `${props.user.birthDate.getUTCFullYear()}-${
            props.user.birthDate.getUTCMonth() + 1 > 9
              ? props.user.birthDate.getUTCMonth() + 1
              : "0" + (props.user.birthDate.getUTCMonth() + 1)
          }-${
            props.user.birthDate.getUTCDate() > 9
              ? props.user.birthDate.getUTCDate()
              : "0" + props.user.birthDate.getUTCDate()
          }`
        : "";
      setBirthDate(date);
      setFirstName(props.user.firstName ?? "");
      setLastName(props.user.lastName ?? "");
      setDescription(props.user.description ?? "");
      if (props.user.role === Role.TENANT) {
        setLocation(props.user.attribute?.location ?? "");
        setHomeType(props.user.attribute?.homeType ?? undefined);
        setMaxPrice(props.user.attribute?.maxPrice ?? 0);
        setMinPrice(props.user.attribute?.minPrice ?? 0);
        setMaxSize(props.user.attribute?.maxSize ?? 0);
        setMinSize(props.user.attribute?.minSize ?? 0);
        setFurnished(props.user.attribute?.furnished ?? false);
        setTerrace(props.user.attribute?.terrace ?? false);
        setPets(props.user.attribute?.pets ?? false);
        setSmoker(props.user.attribute?.smoker ?? false);
        setDisability(props.user.attribute?.disability ?? false);
        setGarden(props.user.attribute?.garden ?? false);
        setParking(props.user.attribute?.parking ?? false);
        setElevator(props.user.attribute?.elevator ?? false);
        setPool(props.user.attribute?.pool ?? false);
      }
    }
  }, [props.user]);

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

    const data: UserFormData = {
      birthDate,
      firstName,
      lastName,
      description,
      location,
      maxPrice,
      minPrice,
      maxSize,
      minSize,
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
    maxPrice,
    handleMaxPriceChange: handleNumberChange(setMaxPrice),
    minPrice,
    handleMinPriceChange: handleNumberChange(setMinPrice),
    maxSize,
    handleMaxSizeChange: handleNumberChange(setMaxSize),
    minSize,
    handleMinSizeChange: handleNumberChange(setMinSize),
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
      <div className="mx-auto flex">
        <div className="relative">
          <img
            src={
              (props.user && props.user.image) ||
              (props.imageGet && props.imageGet.url) ||
              "/defaultImage.png"
            }
            referrerPolicy="no-referrer"
            alt="image"
            className="mx-auto h-32 rounded-full shadow-xl"
          />
          {props.imageGet && props.imageGet.url && props.onImgDelete && (
            <Button
              theme="danger"
              onClick={(e) => {
                e.preventDefault();
                props.onImgDelete && props.onImgDelete();
              }}
              overrideStyles
              className="absolute right-0 top-0 inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 stroke-white p-1.5 hover:bg-red-700"
            >
              <CrossSvg />
            </Button>
          )}
        </div>
        {props.onImgUpload && (
          <div className="ml-2 flex items-center">
            <FileInput onChange={props.onImgUpload}>Choose file</FileInput>
          </div>
        )}
      </div>
      <div className="flex h-full flex-col gap-5 py-5">
        <div className="flex justify-center gap-5">
          <TextInput
            required
            placeholder="First Name"
            onChange={handleChange(setFirstName)}
            value={firstName}
          />
          <TextInput
            required
            placeholder="Last Name"
            onChange={handleChange(setLastName)}
            value={lastName}
          />
          <DateInput
            required
            onChange={handleChange(setBirthDate)}
            value={birthDate}
          />
        </div>
        <TextArea
          placeholder="Description"
          onChange={handleChange(setDescription)}
          value={description}
        />
      </div>
      {props.user?.role === Role.TENANT && (
        <UserAttributesForm {...attributesStates} />
      )}
      <DocumentList
        documents={props.documentsGet}
        onDelete={props.onDocDelete}
        isLoggedInOrAdmin
      />
      <div className="mx-auto">
        <FileInput multiple onChange={props.onDocsUpload} accept=".pdf">
          Upload Document
        </FileInput>
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
