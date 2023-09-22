/* eslint-disable @next/next/no-img-element */
import {
  ChangeEvent,
  Dispatch,
  FormEventHandler,
  ForwardedRef,
  SetStateAction,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { User, Attribute, Document, Role, MaritalStatus } from "@prisma/client";
import { HomeType } from "../../types/homeType";
import { UserAttributesForm } from "../attributes/UserAttributesForm";
import { DocumentList } from "../shared/document/DocumentList";
import { DateInput } from "../shared/forms/DateInput";
import { FileInput } from "../shared/forms/FileInput";
import { TextArea } from "../shared/forms/TextArea";
import { TextInput } from "../shared/forms/TextInput";
import { NumberInput } from "../shared/forms/NumberInput";

export type UserFormData = {
  birthDate: string;
  firstName: string;
  lastName: string;
  country?: string;
  description: string;
  location?: string;
  maxPrice?: number;
  minPrice?: number;
  maxSize?: number;
  minSize?: number;
  furnished?: boolean;
  homeType?: HomeType;
  terrace?: boolean;
  pets?: boolean;
  smoker?: boolean;
  disability?: boolean;
  garden?: boolean;
  parking?: boolean;
  elevator?: boolean;
  pool?: boolean;

  job?: string;
  employmentContract?: string;
  income?: number;
  creditScore?: number;
  maritalStatus?: MaritalStatus;
};

export interface UserFormProps {
  user: User & { attribute: Attribute | null };
  onDocsUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onDocDelete: (documentId: string) => Promise<void>;
  documents?: (Document & { url: string })[] | null;
  onSubmit: (data: UserFormData) => Promise<void>;
}

const UserFormBeforeRef = (
  { user, onDocsUpload, onDocDelete, documents, onSubmit }: UserFormProps,
  ref: ForwardedRef<HTMLFormElement>,
) => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [location, setLocation] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxSize, setMaxSize] = useState<number | undefined>();
  const [minSize, setMinSize] = useState<number | undefined>();
  const [furnished, setFurnished] = useState<boolean | undefined>();
  const [homeType, setHomeType] = useState<HomeType | undefined>();
  const [terrace, setTerrace] = useState<boolean | undefined>();
  const [pets, setPets] = useState<boolean | undefined>();
  const [smoker, setSmoker] = useState<boolean | undefined>();
  const [disability, setDisability] = useState<boolean | undefined>();
  const [garden, setGarden] = useState<boolean | undefined>();
  const [parking, setParking] = useState<boolean | undefined>();
  const [elevator, setElevator] = useState<boolean | undefined>();
  const [pool, setPool] = useState<boolean | undefined>();

  const [job, setJob] = useState<string>("");
  const [employmentContract, setEmploymentContract] = useState<string>("");
  const [income, setIncome] = useState<number | undefined>();
  const [creditScore, setCreditScore] = useState<number | undefined>();
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | undefined>(
    undefined,
  );

  useEffect(() => {
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
    setCountry(user.country ?? "");

    if (user.role === Role.TENANT) {
      setLocation(user.attribute?.location ?? undefined);
      setHomeType(user.attribute?.homeType ?? undefined);
      setMaxPrice(user.attribute?.maxPrice ?? undefined);
      setMinPrice(user.attribute?.minPrice ?? undefined);
      setMaxSize(user.attribute?.maxSize ?? undefined);
      setMinSize(user.attribute?.minSize ?? undefined);
      setFurnished(user.attribute?.furnished ?? undefined);
      setTerrace(user.attribute?.terrace ?? undefined);
      setPets(user.attribute?.pets ?? undefined);
      setSmoker(user.attribute?.smoker ?? undefined);
      setDisability(user.attribute?.disability ?? undefined);
      setGarden(user.attribute?.garden ?? undefined);
      setParking(user.attribute?.parking ?? undefined);
      setElevator(user.attribute?.elevator ?? undefined);
      setPool(user.attribute?.pool ?? undefined);

      setJob(user.job ?? "");
      setEmploymentContract(user.employmentContract ?? "");
      setIncome(user.income ?? undefined);
      setCreditScore(user.creditScore ?? undefined);
      setMaritalStatus(user.maritalStatus ?? undefined);
    }
  }, [user]);

  const handleChange =
    (
      setter:
        | Dispatch<SetStateAction<string | undefined>>
        | Dispatch<SetStateAction<string>>,
    ) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
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

  const handleMaritalStatusChange =
    (setter: Dispatch<SetStateAction<MaritalStatus | undefined>>) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setter(event.target.value as MaritalStatus);
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
      country,
      job,
      employmentContract,
      income,
      creditScore,
      maritalStatus,
    };

    onSubmit(data);
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
    handleFurnishedChange: setFurnished,
    homeType,
    handleHomeTypeChange: handleHomeTypeChange(setHomeType),
    terrace,
    handleTerraceChange: setTerrace,
    pets,
    handlePetsChange: setPets,
    smoker,
    handleSmokerChange: setSmoker,
    disability,
    handleDisabilityChange: setDisability,
    garden,
    handleGardenChange: setGarden,
    parking,
    handleParkingChange: setParking,
    elevator,
    handleElevatorChange: setElevator,
    pool,
    handlePoolChange: setPool,
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={ref}
      className="flex flex-grow flex-col gap-5"
    >
      <h2 className="justify-end text-right font-medium">
        Member since: <i>{user.createdAt.toDateString()}</i>
      </h2>
      <h1 className="text-4xl font-semibold">Update Your Profile</h1>

      <section>
        <p className="text-sm text-slate-500">
          These informations will be shared across Leace to help build trust and
          find you suitable prospects.
        </p>
      </section>
      <section>
        <h2 className="py-4 text-3xl font-medium">About You</h2>
        <ul className="flex flex-wrap gap-4">
          <li className="flex-grow pr-8">
            <h3 className="pb-2 text-xl font-medium">First Name</h3>
            <TextInput
              required
              placeholder="Satoshi"
              onChange={handleChange(setFirstName)}
              value={firstName}
              className="w-full"
            />
          </li>
          <li className="flex-grow">
            <h3 className="pb-2 text-xl font-medium">Last Name</h3>
            <TextInput
              required
              placeholder="Nakamoto"
              onChange={handleChange(setLastName)}
              value={lastName}
              className="w-full"
            />
          </li>
        </ul>
        <TextArea
          placeholder="Fashionista and tech enthusiast. I'm the perfect tenant for your apartment! 💁🏻‍♀️"
          onChange={handleChange(setDescription)}
          value={description}
          className="mt-4 w-full"
        />
        <ul className="flex flex-wrap gap-4 pt-4">
          <li className="flex-grow pr-8">
            <h3 className="text-xl font-medium">Country</h3>
            <TextInput
              required
              placeholder="France"
              onChange={handleChange(setCountry)}
              value={country}
              className="w-full"
            />
          </li>
          <li className="flex-grow">
            <h3 className="text-xl font-medium">Birthdate</h3>
            <DateInput
              required
              onChange={handleChange(setBirthDate)}
              value={birthDate}
              className="w-full"
            />
          </li>
        </ul>
      </section>

      {user.role === Role.TENANT && (
        <section>
          <h2 className="py-4 text-3xl font-medium">Preferences</h2>
          <UserAttributesForm {...attributesStates} />
          <ul className="flex flex-wrap gap-4 pt-4">
            <li className="flex-grow pr-8">
              <h3 className="text-xl font-medium">Job</h3>
              <TextInput
                placeholder="Developer"
                onChange={handleChange(setJob)}
                value={job}
                className="w-full"
              />
            </li>
            <li className="flex-grow">
              <h3 className="text-xl font-medium">Type of contract</h3>
              <TextInput
                placeholder="CDI"
                onChange={handleChange(setEmploymentContract)}
                value={employmentContract}
                className="w-full"
              />
            </li>
          </ul>
          <ul className="flex flex-wrap gap-4 pt-4">
            <li className="flex-grow pr-8">
              <h3 className="text-xl font-medium">Annual salary</h3>
              <NumberInput
                placeholder="60000"
                onChange={handleNumberChange(setIncome)}
                value={income?.toString() ?? ""}
                className="w-full"
                unit="$"
              />
            </li>
            <li className="flex-grow">
              <h3 className="text-xl font-medium">Credit score</h3>
              <NumberInput
                placeholder="800"
                onChange={handleNumberChange(setCreditScore)}
                value={creditScore ?? ""}
                className="w-full"
              />
            </li>
            <li className="flex-grow">
              <h3 className="text-xl font-medium">Marital status</h3>
              <select
                id="maritalStatus"
                onChange={handleMaritalStatusChange(setMaritalStatus)}
                value={maritalStatus ?? ""}
                className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
              >
                <option value={MaritalStatus.SINGLE}>SINGLE</option>
                <option value={MaritalStatus.MARRIED}>MARRIED</option>
                <option value={MaritalStatus.ONE_CHILD}>ONE_CHILD</option>
                <option value={MaritalStatus.TWO_CHILD}>TWO_CHILD</option>
                <option value={MaritalStatus.OTHER}>OTHER</option>
              </select>
            </li>
          </ul>
        </section>
      )}
      <DocumentList
        documents={documents}
        onDelete={onDocDelete}
        isLoggedInOrAdmin
      />
      <section className="flex justify-center pt-4">
        <FileInput multiple onChange={onDocsUpload} accept=".pdf">
          Upload Documents
        </FileInput>
      </section>
    </form>
  );
};

export const UserForm = forwardRef<HTMLFormElement, UserFormProps>(
  UserFormBeforeRef,
);