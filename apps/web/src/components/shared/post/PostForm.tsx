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
import { useRouter } from "next/router";
import { ToastDescription, ToastTitle, useToast } from "../toast/Toast";

export type PostFormData = {
  title: string;
  description: string;
  location: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
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
  const [bedrooms, setBedrooms] = useState<number | undefined>(undefined);
  const [bathrooms, setBathrooms] = useState<number | undefined>(undefined);
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
  const [size, setSize] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [energyClass, setEnergyClass] = useState<EnergyClass | undefined>(
    undefined,
  );
  const [constructionDate, setConstructionDate] = useState<string>("");
  const [estimatedCosts, setEstimatedCosts] = useState<number | undefined>(
    undefined,
  );
  const [nearestShops, setNearestShops] = useState<number | undefined>(
    undefined,
  );

  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setBedrooms(props.post.attribute?.bedrooms ?? 0);
      setBathrooms(props.post.attribute?.bathrooms ?? 0);
      setFurnished(props.post.attribute?.furnished ?? false);
      setTerrace(props.post.attribute?.terrace ?? false);
      setPets(props.post.attribute?.pets ?? false);
      setSmoker(props.post.attribute?.smoker ?? false);
      setGarden(props.post.attribute?.garden ?? false);
      setParking(props.post.attribute?.parking ?? false);
      setElevator(props.post.attribute?.elevator ?? false);
      setPool(props.post.attribute?.pool ?? false);
      setDisability(props.post.attribute?.disability ?? false);
      setSecurityAlarm(props.post.attribute?.securityAlarm ?? false);
      setInternetFiber(props.post.attribute?.internetFiber ?? false);
      setEnergyClass(props.post.energyClass ?? undefined);
      setConstructionDate(date);
      setEstimatedCosts(props.post.estimatedCosts ?? undefined);
      setNearestShops(props.post.nearestShops ?? undefined);
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
    (setter: Dispatch<SetStateAction<number | undefined>>) =>
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
    setIsSubmitting(true);
    e.preventDefault();
    if (!size || !price || !bedrooms || !bathrooms) return null;
    const data: PostFormData = {
      title,
      description,
      location,
      price,
      size,
      bedrooms,
      bathrooms,
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
      constructionDate,
      estimatedCosts,
      nearestShops,
      securityAlarm,
      internetFiber,
    };
    if (props.onSubmitNew) {
      props.onSubmitNew(data).then((post) => {
        props.onImgsUpload(selectedImages, post.id);
        props.onDocsUpload(selectedDocuments, post.id);
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
    bedrooms,
    handleBedroomsChange: handleNumberChange(setBedrooms),
    bathrooms,
    handleBathroomsChange: handleNumberChange(setBathrooms),
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
            required
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
              onChange={handleEnergyClassChange(setEnergyClass)}
              value={energyClass ?? ""}
              className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
            >
              <option value="" disabled>
                Select one
              </option>
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
              unit="€"
            />
          </li>
        </ul>
        <ul className="flex flex-wrap gap-4 pt-4">
          <li className="flex-grow pr-8">
            <h3 className="text-x2 font-medium">Nearest store</h3>
            <NumberInput
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
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="border-t py-5 text-3xl font-medium">Images</h2>
          <ImageList images={props.images} onDelete={props.onImgDelete} />
          <FileUploadSection
            selectedFiles={selectedImages}
            setSelectedFiles={setSelectedImages}
            title="Upload Images"
          />
        </div>
        <div>
          <h2 className="py-5 text-3xl font-medium">Documents</h2>
          <DocumentList
            documents={props.documents}
            onDelete={props.onDocDelete}
            isLoggedInOrAdmin
          />
          <FileUploadSection
            selectedFiles={selectedDocuments}
            setSelectedFiles={setSelectedDocuments}
            accept=".pdf"
            title="Upload Documents"
          />
        </div>
      </section>
      <div className="mt-10 flex justify-center gap-4">
        <Button type="button" theme="grey" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button loading={isSubmitting} className="w-20">
          Submit
        </Button>
      </div>
    </form>
  );
};
