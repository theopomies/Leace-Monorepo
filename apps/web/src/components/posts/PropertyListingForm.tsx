import { useMemo, useState } from "react";
import { EnergyClass, HomeType, Post } from "@prisma/client";
import { PostFormData } from "../shared/post/PostForm";
import { ToastDescription, ToastTitle, useToast } from "../shared/toast/Toast";
import { useRouter } from "next/router";
import { Button } from "../shared/button/Button";
import { BasicInfosForm } from "./forms/BasicInfosForm";
import { ImagesForm } from "./forms/ImagesForm";
import { PriceForm } from "./forms/PriceForm";
import { DetailsForm } from "./forms/DetailsForm";
import { DocumentsForm } from "./forms/DocumentsForm";
import { Spinner } from "../shared/Spinner";

export interface PropertyListingFormProps {
  onImgsUpload: (file: File[], postId?: string) => Promise<void>;
  onDocsUpload: (files: File[], postId?: string) => Promise<void>;
  onSubmit: (data: PostFormData) => Promise<Post>;
}

export function PropertyListingForm({
  onImgsUpload,
  onDocsUpload,
  onSubmit,
}: PropertyListingFormProps) {
  const [step, setStep] = useState<
    "basic" | "images" | "price" | "details" | "documents" | "submitting"
  >("basic");
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

  const router = useRouter();

  const handleSubmit = async () => {
    if (!size || !price || !bedrooms || !bathrooms) return null;
    setStep("submitting");
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
    let post: Post;
    try {
      post = await onSubmit(data);
      await Promise.all([
        onImgsUpload(selectedImages, post.id),
        onDocsUpload(selectedDocuments, post.id),
      ]);
    } catch (e) {
      setStep("basic");
      renderToast(
        <>
          <ToastTitle>Error</ToastTitle>
          <ToastDescription>
            Something went wrong, please try again later
          </ToastDescription>
        </>,
      );
      return;
    }
    router.push(`/users/${post.createdById}/posts/${post.id}`);
    setTimeout(() => {
      renderToast(
        <>
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>Your property is now posted ✅</ToastDescription>
        </>,
      );
    }, 1_000);
  };

  const basicValid = useMemo(
    () => !!(title && description && location),
    [title, description, location],
  );

  const imagesValid = useMemo(
    () => selectedImages.length > 0,
    [selectedImages],
  );

  const priceValid = useMemo(
    () =>
      !!(
        size &&
        size > 0 &&
        price &&
        price > 0 &&
        estimatedCosts !== undefined &&
        bedrooms !== undefined &&
        bathrooms !== undefined
      ),
    [size, price, bedrooms, bathrooms, estimatedCosts],
  );

  const detailsValid = useMemo(
    () =>
      !!(
        homeType &&
        energyClass &&
        constructionDate &&
        nearestShops !== undefined &&
        nearestShops >= 0
      ),
    [constructionDate, energyClass, homeType, nearestShops],
  );

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow-lg">
      {step !== "submitting" && (
        <>
          <h1 className="text-center text-2xl font-bold">
            Add Property Listing
          </h1>
          <div className="flex gap-2">
            <Button
              theme={step == "basic" ? "primary" : "white"}
              onClick={() => setStep("basic")}
            >
              Basic infos
            </Button>
            <Button
              theme={step == "images" ? "primary" : "white"}
              onClick={() => {
                if (basicValid) setStep("images");
              }}
            >
              Images
            </Button>
            <Button
              theme={step == "price" ? "primary" : "white"}
              onClick={() => {
                if (basicValid && imagesValid) setStep("price");
              }}
            >
              Price
            </Button>
            <Button
              theme={step == "details" ? "primary" : "white"}
              onClick={() => {
                if (basicValid && imagesValid && priceValid) setStep("details");
              }}
            >
              Details
            </Button>
            <Button
              theme={step == "documents" ? "primary" : "white"}
              onClick={() => {
                if (basicValid && imagesValid && priceValid && detailsValid)
                  setStep("documents");
              }}
            >
              Documents
            </Button>
          </div>
          <div>
            {step == "basic" && (
              <BasicInfosForm
                title={title}
                description={description}
                location={location}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onLocationChange={setLocation}
                onSubmit={() => setStep("images")}
                isValid={basicValid}
              />
            )}
            {/* Hack so the input stays mounted */}
            <div className={step == "images" ? " block" : "hidden"}>
              <ImagesForm
                images={selectedImages}
                onImagesChange={setSelectedImages}
                onSubmit={() => setStep("price")}
                isValid={imagesValid}
              />
            </div>
            {step == "price" && (
              <PriceForm
                price={price}
                onPriceChange={setPrice}
                size={size}
                onSizeChange={setSize}
                bedrooms={bedrooms}
                onBedroomsChange={setBedrooms}
                bathrooms={bathrooms}
                onBathroomsChange={setBathrooms}
                charges={estimatedCosts}
                onChargesChange={setEstimatedCosts}
                onSubmit={() => setStep("details")}
                isValid={priceValid}
              />
            )}
            {step == "details" && (
              <DetailsForm
                onSubmit={() => setStep("documents")}
                isValid={detailsValid}
                furnished={furnished}
                onFurnishedChange={setFurnished}
                terrace={terrace}
                onTerraceChange={setTerrace}
                pets={pets}
                onPetsChange={setPets}
                smoker={smoker}
                onSmokerChange={setSmoker}
                disability={disability}
                onDisabilityChange={setDisability}
                garden={garden}
                onGardenChange={setGarden}
                parking={parking}
                onParkingChange={setParking}
                elevator={elevator}
                onElevatorChange={setElevator}
                pool={pool}
                onPoolChange={setPool}
                securityAlarm={securityAlarm}
                onSecurityAlarmChange={setSecurityAlarm}
                internetFiber={internetFiber}
                onInternetFiberChange={setInternetFiber}
                homeType={homeType}
                onHomeTypeChange={setHomeType}
                energyClass={energyClass}
                onEnergyClassChange={setEnergyClass}
                constructionDate={constructionDate}
                onConstructionDateChange={setConstructionDate}
                nearestShops={nearestShops}
                onNearestShopsChange={setNearestShops}
              />
            )}
            <div className={step == "documents" ? " block" : "hidden"}>
              <DocumentsForm
                documents={selectedDocuments}
                onDocumentsChange={setSelectedDocuments}
                onSubmit={() => handleSubmit()}
                isValid={selectedDocuments.length > 0}
              />
            </div>
          </div>
        </>
      )}
      {step === "submitting" && (
        <>
          <h1 className="text-center text-2xl font-bold">
            Submitting property listing
          </h1>
          <div className="flex items-center justify-center p-10">
            <Spinner />
          </div>
        </>
      )}
    </div>
  );
}
