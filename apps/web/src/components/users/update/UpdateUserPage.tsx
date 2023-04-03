import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { trpc } from "../../../utils/trpc";
import { Role } from "@prisma/client";
import { Header } from "../Header";
import { TenantProfileForm } from "./TenantProfileForm";
import { useRouter } from "next/router";
import { TextInput } from "../../shared/forms/TextInput";
import { DateInput } from "../../shared/forms/DateInput";
import { TextArea } from "../../shared/forms/TextArea";

export interface UpdateUserPageProps {
  userId: string;
  // role: Role;
}

export function UpdateUserPage({ userId }: UpdateUserPageProps) {
  const router = useRouter();
  const { data: user } = trpc.user.getUserById.useQuery({ userId });
  const updateUser = trpc.user.updateUserById.useMutation();

  const [birthDate, setBirthDate] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log({
      userId,
      birthDate,
      firstName,
      lastName,
      description,
    });
    await updateUser.mutateAsync({
      userId,
      birthDate: new Date(birthDate + "T00:00:00.000Z"),
      firstName,
      lastName,
      description,
    });
    router.push(`/users/${userId}`);
  };

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
    };

  useEffect(() => {
    if (user) {
      console.log("user", user);
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
      console.log("date", date);
      setBirthDate(date);
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setDescription(user.description ?? "");
    }
  }, [user]);

  return (
    <div className="w-full">
      <Header heading="Update Profile" />
      <div className="flex justify-center p-5">
        <form
          className="m-14 flex w-3/6 justify-center rounded-lg bg-white p-5 shadow"
          onSubmit={handleSubmit}
        >
          <div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element*/}
              <img
                src={
                  "https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                }
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
            {/* {role === Role.TENANT && <TenantProfileForm userId={userId} />} */}
            {
              <div className=" flex justify-center pt-4">
                <button className="rounded-md bg-indigo-500 p-3 text-white ">
                  Update
                </button>
              </div>
            }
          </div>
        </form>
      </div>
    </div>
  );
}
