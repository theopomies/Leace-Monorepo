/* eslint-disable @next/next/no-img-element */
import {
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";
import { Header } from "../shared/Header";
import { useRouter } from "next/router";
import { HomeType } from "../../types/homeType";
import axios from "axios";
import { UserForm } from "../shared/user/UserForm";

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

  const { data: documentsGet, refetch: refetchDocumentsGet } =
    trpc.document.getSignedUserUrl.useQuery(userId);
  const uploadDocument = trpc.document.putSignedUserUrl.useMutation();
  const deleteDocument = trpc.document.deleteSignedUserUrl.useMutation();

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
      if (user.role === Role.TENANT) {
        setLocation(user.attribute?.location ?? "");
        setHomeType(user.attribute?.homeType ?? undefined);
        setMaxPrice(user.attribute?.maxPrice ?? 0);
        setMinPrice(user.attribute?.minPrice ?? 0);
        setMaxSize(user.attribute?.maxSize ?? 0);
        setMinSize(user.attribute?.minSize ?? 0);
        setFurnished(user.attribute?.furnished ?? false);
        setTerrace(user.attribute?.terrace ?? false);
        setPets(user.attribute?.pets ?? false);
        setSmoker(user.attribute?.smoker ?? false);
        setDisability(user.attribute?.disability ?? false);
        setGarden(user.attribute?.garden ?? false);
        setParking(user.attribute?.parking ?? false);
        setElevator(user.attribute?.elevator ?? false);
        setPool(user.attribute?.pool ?? false);
      }
    }
  }, [user]);

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
    router.push(`/users/${userId}`);
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

  const handleUploadDocs = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      Array.from(event.target.files).map(async (document) => {
        await uploadDocument
          .mutateAsync({
            fileType: document.type,
          })
          .then(async (url) => {
            await axios.put(url, document);
            refetchDocumentsGet();
          });
      });
    }
  };

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync(documentId);
    refetchDocumentsGet();
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="w-full">
      <Header heading="Update Profile" />
      <UserForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        user={user}
        setFirstName={handleChange(setFirstName)}
        firstName={firstName}
        setLastName={handleChange(setLastName)}
        lastName={lastName}
        setBirthDate={handleChange(setBirthDate)}
        birthDate={birthDate}
        setLocation={handleChange(setLocation)}
        location={location}
        setHomeType={handleHomeTypeChange(setHomeType)}
        homeType={homeType}
        setDescription={handleChange(setDescription)}
        description={description}
        setFurnished={handleBooleanChange(setFurnished)}
        furnished={furnished}
        setPool={handleBooleanChange(setPool)}
        pool={pool}
        setSmoker={handleBooleanChange(setSmoker)}
        smoker={smoker}
        setTerrace={handleBooleanChange(setTerrace)}
        terrace={terrace}
        setElevator={handleBooleanChange(setElevator)}
        elevator={elevator}
        setParking={handleBooleanChange(setParking)}
        parking={parking}
        setGarden={handleBooleanChange(setGarden)}
        garden={garden}
        setPets={handleBooleanChange(setPets)}
        pets={pets}
        setDisability={handleBooleanChange(setDisability)}
        disability={disability}
        setMaxSize={handleNumberChange(setMaxSize)}
        maxSize={maxSize}
        setMinSize={handleNumberChange(setMinSize)}
        minSize={minSize}
        setMaxPrice={handleNumberChange(setMaxPrice)}
        maxPrice={maxPrice}
        setMinPrice={handleNumberChange(setMinPrice)}
        minPrice={minPrice}
        OnDocsUpload={handleUploadDocs}
        OnDocDelete={handleDeleteDoc}
        documentsGet={documentsGet}
      />
    </div>
  );
}
