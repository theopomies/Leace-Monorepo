/* eslint-disable @next/next/no-img-element */
import React, {
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
import { HomeType } from "../../../types/homeType";
import { DocumentList } from "../document/DocumentList";
import { ImageList } from "./ImageList";
import { Post, Attribute, Image, Document, EnergyClass } from "@prisma/client";
import { PostAttributesForm } from "../../attributes/PostAttributesForm";
import { TextInput } from "../forms/TextInput";
import { NumberInput } from "../forms/NumberInput";
import { FileUploadSection } from "../button/FileUploadSection";
import { ToastDescription, ToastTitle } from "@radix-ui/react-toast";
import { useRouter } from "next/router";
import { useToast } from "../toast/Toast";

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
  energyClass?: EnergyClass;
  ges?: EnergyClass;
  constructionDate?: string;
  estimatedCosts?: number;
  nearestShops?: number;
  securityAlarm?: boolean;
  internetFiber?: boolean;
};

export interface PostFormProps {
  post?: (Post & { attribute: Attribute | null }) | undefined;
  onImgsUpload: (file: File[], postId?: string) => void;
  onImgDelete?: (imageId: string) => Promise<void>;
  images?: (Image & { url: string })[] | null | undefined;
  onDocsUpload: (files: File[], postId?: string) => void;
  onDocDelete?: (documentId: string) => Promise<void>;
  documents?: (Document & { url: string })[] | null | undefined;
  onSubmit?: (data: PostFormData) => Promise<void>;
  onSubmitNew?: (data: PostFormData) => Promise<Post>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}

export const PostForm = (props: PostFormProps) => {
  const router = useRouter();
  const { renderToast } = useToast();
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
  const [securityAlarm, setSecurityAlarm] = useState(false);
  const [internetFiber, setInternetFiber] = useState(false);
  const [size, setSize] = useState(0);
  const [price, setPrice] = useState(0);
  const [energyClass, setEnergyClass] = useState<EnergyClass | undefined>(
    undefined,
  );
  const [ges, setGes] = useState<EnergyClass | undefined>(undefined);
  const [constructionDate, setConstructionDate] = useState<string>("");
  const [estimatedCosts, setEstimatedCosts] = useState<number>(0);
  const [nearestShops, setNearestShops] = useState<number>(0);

  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    const date = props.post?.constructionDate
      ? `${props.post?.constructionDate.getUTCFullYear()}-${
          props.post?.constructionDate.getUTCMonth() + 1 > 9
            ? props.post?.constructionDate.getUTCMonth() + 1
            : "0" + (props.post?.constructionDate.getUTCMonth() + 1)
        }-${
          props.post?.constructionDate.getUTCDate() > 9
            ? props.post?.constructionDate.getUTCDate()
            : "0" + props.post?.constructionDate.getUTCDate()
        }`
      : "";
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
      setEnergyClass(props.post.energyClass ?? undefined);
      setGes(props.post.ges ?? undefined);
      setConstructionDate(date);
      setEstimatedCosts(props.post.estimatedCosts ?? 0);
      setNearestShops(props.post.nearestShops ?? 0);
      setSecurityAlarm(props.post.securityAlarm ?? false);
      setInternetFiber(props.post.internetFiber ?? false);
    }
  }, [props.post]);

  const handleChange =
    (
      setter:
        | Dispatch<SetStateAction<string | undefined>>
        | Dispatch<SetStateAction<string>>,
    ) =>
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

  const handleEnergyClassChange =
    (setter: Dispatch<SetStateAction<EnergyClass | undefined>>) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setter(event.target.value as EnergyClass);
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
      energyClass,
      ges,
      constructionDate,
      estimatedCosts,
      nearestShops,
      securityAlarm,
      internetFiber,
    };
    if (props.onSubmitNew) {
      props.onSubmitNew(data).then((post) => {
        props.onImgsUpload(selectedImages, post.id);
        props.onDocsUpload(selectedDocuments);
        router.push(`/users/${post.createdById}/posts/${post.id}`);
        renderToast(
          <>
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Your property is now posted ✅</ToastDescription>
          </>,
        );
      });
    } else if (props.onSubmit) {
      props.onSubmit(data);
      props.onImgsUpload(selectedImages);
      props.onDocsUpload(selectedDocuments);
    }
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
    securityAlarm,
    handleSecurityAlarmChange: handleBooleanChange(setSecurityAlarm),
    internetFiber,
    handleInternetFiberChange: handleBooleanChange(setInternetFiber),
  };

  return (
    <form
      className="m-auto my-5 flex w-fit flex-grow flex-col overflow-auto rounded-lg bg-white p-12 shadow"
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
        <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
          Additional informations
        </h2>
        <ul className="flex flex-wrap gap-4 pt-4">
          <li className="flex-grow pr-8">
            <h3 className="text-x2 font-medium">Energy class</h3>
            <select
              placeholder="A"
              onChange={handleEnergyClassChange(setEnergyClass)}
              value={energyClass}
              className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </li>
          <li className="flex-grow">
            <h3 className="text-x2 font-medium">GES</h3>
            <select
              placeholder="A"
              onChange={handleEnergyClassChange(setGes)}
              value={ges}
              className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </li>
        </ul>

        <ul className="flex flex-wrap gap-4 pt-4">
          <li className="flex-grow pr-8">
            <h3 className="text-x2 font-medium">Construction date</h3>
            <TextInput
              placeholder="2001"
              onChange={handleChange(setConstructionDate)}
              value={constructionDate}
              className="w-full"
            />
          </li>
          <li className="flex-grow pr-8">
            <h3 className="text-x2 font-medium">Estimated fee costs</h3>
            <NumberInput
              placeholder="120"
              onChange={handleNumberChange(setEstimatedCosts)}
              value={estimatedCosts}
              className="w-full"
              unit="$"
            />
          </li>
        </ul>
        <ul className="flex flex-wrap gap-4 pt-4">
          <li className="flex-grow pr-8">
            <h3 className="text-x2 font-medium">Nearest store</h3>
            <NumberInput
              required
              placeholder="2"
              onChange={handleNumberChange(setNearestShops)}
              value={nearestShops}
              className="w-full"
              unit="km"
            />
          </li>
        </ul>
      </div>
      <PostAttributesForm {...attributesStates} />
      <ImageList images={props.images} onDelete={props.onImgDelete} />
      <p className="bold pt-4 text-xl">Upload Images</p>
      <FileUploadSection
        selectedFiles={selectedImages}
        setSelectedFiles={setSelectedImages}
      />
      <DocumentList
        documents={props.documents}
        onDelete={props.onDocDelete}
        isLoggedInOrAdmin
      />
      <p className="bold pt-4 text-xl">Upload Documents</p>
      <FileUploadSection
        selectedFiles={selectedDocuments}
        setSelectedFiles={setSelectedDocuments}
        accept=".pdf"
      />
      <div className="mt-10 flex justify-center gap-4">
        <Button type="button" theme="danger" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button>Submit</Button>
      </div>
    </form>
  );
};
