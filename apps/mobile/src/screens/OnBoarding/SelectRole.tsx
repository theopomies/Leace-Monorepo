import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { IRoleState, IStep } from "../../types/onboarding";
import { trpc } from "../../utils/trpc";

interface IRole {
  title: string;
  role: "TENANT" | "OWNER" | "AGENCY";
  description: string;
}

const roles: IRole[] = [
  {
    title: "Tenant",
    role: "TENANT",
    description:
      "You are looking for a house or a flat to rent? Look no further, this is for you!",
  },
  {
    title: "Owner",
    role: "OWNER",
    description:
      "You are looking for a house or a flat to rent? Look no further, this is for you!",
  },
  {
    title: "Agency",
    role: "AGENCY",
    description:
      "You are looking for a house or a flat to rent? Look no further, this is for you!",
  },
];

function Role({ data, callback }: { data: IRole; callback: () => void }) {
  return (
    <TouchableOpacity
      className="bg-indigo relative flex h-40 flex-col rounded-lg px-8"
      onPress={callback}
    >
      <View className="absolute h-40 w-40">
        {data.role === "TENANT" && (
          <Image
            className="h-full w-full object-cover"
            source={require("../../../assets/onboarding/tenant.png")}
          />
        )}
        {data.role === "OWNER" && (
          <Image
            className="h-full w-full object-cover"
            source={require("../../../assets/onboarding/owner.png")}
          />
        )}
        {data.role === "AGENCY" && (
          <Image
            className="h-full w-full object-cover"
            source={require("../../../assets/onboarding/agency.png")}
          />
        )}
      </View>
      <View className="h-16 items-center justify-center">
        <Text className="text-2xl font-bold text-white">{data.title}</Text>
      </View>
      <Text className="font-medium text-white">{data.description}</Text>
    </TouchableOpacity>
  );
}

export default function SelectRole({
  setStep,
  setProgress,
  userId,
  setSelectedRole,
}: IStep & IRoleState) {
  const userRole = trpc.user.updateUserRoleById.useMutation();

  return (
    <>
      <View className="flex h-40 flex-col justify-center px-8">
        <Text className="text-3xl font-bold">Select what</Text>
        <Text className="text-3xl font-bold">defines you best</Text>
      </View>
      <View className="flex flex-1 justify-evenly px-8">
        {roles.map((role, key) => (
          <Role
            data={role}
            key={key}
            callback={() => {
              userRole.mutateAsync({ userId, role: role.role }).then(() => {
                setProgress(75);
                setStep("PROFILE");
                setSelectedRole(role.role);
              });
            }}
          />
        ))}
      </View>
    </>
  );
}
