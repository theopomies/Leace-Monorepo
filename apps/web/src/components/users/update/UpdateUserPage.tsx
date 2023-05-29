/* eslint-disable @next/next/no-img-element */
import {
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { trpc } from "../../../utils/trpc";
import { Role } from "@prisma/client";
import { Header } from "../../shared/Header";
import { AttributesForm } from "../../attributes/AttributesForm";
import { useRouter } from "next/router";
import { TextInput } from "../../shared/forms/TextInput";
import { DateInput } from "../../shared/forms/DateInput";
import { TextArea } from "../../shared/forms/TextArea";
import { Button } from "../../shared/button/Button";
import { HomeType } from "../../../types/homeType";
import { FileInput } from "../../shared/forms/FileInput";
import axios from "axios";

export interface UpdateUserPageProps {
  userId: string;
}

export function UpdateUserPage({ userId }: UpdateUserPageProps) {
  const router = useRouter();
  const { data: user } = trpc.user.getUserById.useQuery({ userId });
  const updateUser = trpc.user.updateUserById.useMutation();

  const [birthDate, setBirthDate] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const updateAttributes = trpc.attribute.updateUserAttributes.useMutation();

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

  const { data: documentsGet } =
    trpc.document.getSignedUserUrl.useQuery(userId);
  const uploadDocument = trpc.document.putSignedUserUrl.useMutation();
  const [documents, setDocuments] = useState<File[] | undefined>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await updateUser.mutateAsync({
      userId,
      birthDate: new Date(birthDate + "T00:00:00.000Z"),
      firstName,
      lastName,
      description,
    });
    if (user?.role === Role.TENANT) {
      await updateAttributes.mutateAsync({
        userId,
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
      });
    }
    if (documents && documents.length > 0) {
      documents.map(async (document) => {
        await uploadDocument
          .mutateAsync({
            fileType: document.type,
          })
          .then((url) => {
            axios.put(url, document);
          });
      });
    }
    setTimeout(() => {
      router.push(`/users/${userId}`);
    }, 500);
  };

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

  const handleDocuments =
    (setter: Dispatch<SetStateAction<File[] | undefined>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setter(Array.from(event.target.files));
      }
    };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  useEffect(() => {
    if (user) {
      const date = user.birthDate
        ? `${user.birthDate.getUTCFullYear()}-${
            user.birthDate.getUTCMonth() + 1 > 9
              ? user.birthDate.getUTCMonth() + 1
              : "0" + (user.birthDate.getUTCMonth() + 1)
          }-${
            user.birthDate.getUTCDate() > 9
              ? user.birthDate.getUTCDate()
              : "0" + user.birthDate.getUTCDate()
          }`
        : "";
      setBirthDate(date);
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setDescription(user.description ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (user?.attribute) {
      setLocation(user.attribute.location || "");
      setMaxPrice(user.attribute.maxPrice || 0);
      setMinPrice(user.attribute.minPrice || 0);
      setMaxSize(user.attribute.maxSize || 0);
      setMinSize(user.attribute.minSize || 0);
      setHomeType(user.attribute.homeType || undefined);
      setFurnished(user.attribute.furnished || false);
      setTerrace(user.attribute.terrace || false);
      setPets(user.attribute.pets || false);
      setSmoker(user.attribute.smoker || false);
      setDisability(user.attribute.disability || false);
      setGarden(user.attribute.garden || false);
      setParking(user.attribute.parking || false);
      setElevator(user.attribute.elevator || false);
      setPool(user.attribute.pool || false);
    }
  }, [
    user,
    setLocation,
    setMaxPrice,
    setMinPrice,
    setMaxSize,
    setMinSize,
    setHomeType,
    setFurnished,
    setTerrace,
    setPets,
    setSmoker,
    setDisability,
    setGarden,
    setParking,
    setElevator,
    setPool,
  ]);

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
    <div className="w-full">
      <Header heading="Update Profile" />
      <div className="flex justify-center p-5">
        <form
          className="mx-40 mt-14 flex w-full justify-center rounded-lg bg-white p-12 shadow"
          onSubmit={handleSubmit}
        >
          <div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element*/}
              <img
                src={user && user.image ? user.image : "/defaultImage.png"}
                referrerPolicy="no-referrer"
                alt="image"
                className="mx-auto h-32 rounded-full shadow-xl"
              />
              <div className="m-4 flex h-full flex-col">
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
                    value={birthDate}
                    onChange={handleChange(setBirthDate)}
                  />
                </div>
                <TextArea
                  placeholder="Description"
                  onChange={handleChange(setDescription)}
                  value={description}
                />
              </div>
            </div>
            {user?.role === Role.TENANT && (
              <AttributesForm {...attributesStates} />
            )}
            <div className="mt-10">
              <h2 className="mb-2 text-center text-xl font-bold text-gray-700">
                Documents
              </h2>
              {documentsGet && documentsGet.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  {documentsGet.map((document, index) => (
                    <div key={index} className="relative">
                      <img
                        src={document.url}
                        alt="image"
                        className="mx-auto h-32"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                <FileInput
                  multiple
                  onChange={handleDocuments(setDocuments)}
                  accept=".pdf"
                >
                  Upload Document
                </FileInput>
                {documents?.map((document, index) => (
                  <p key={index}>{document.name}</p>
                ))}
              </div>
            </div>
            <div className="mt-10 flex justify-center gap-8">
              <Button theme="danger" onClick={handleCancel}>
                Cancel
              </Button>
              <Button theme="primary">Update</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
