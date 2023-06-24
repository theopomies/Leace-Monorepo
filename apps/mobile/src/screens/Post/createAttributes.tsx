import { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { trpc } from "../../utils/trpc";

import { RouterInputs } from "../../../../web/src/utils/trpc";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ShowProfile from "../../components/ShowProfile";
import { Button } from "../../components/Button";
import { DatePicker, AddSelectedAttributes } from "../../components/Attributes";
import CustomInput from "../../components/CustomInput/CustomInput";

const CreateAttributes = () => {
  const route =
    useRoute<RouteProp<TabStackParamList, "CreatePostAttributes">>();
  const userId = route.params?.userId;
  const postId = route.params?.postId;

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const attributes = trpc.attribute.updatePostAttributes.useMutation();

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    location: false,
    price: false,
    size: false,
  });

  const [data, setData] = useState<
    RouterInputs["attribute"]["updatePostAttributes"]
  >({
    postId: "",
    location: "",
    price: undefined,
    size: undefined,
    rentStartDate: new Date(),
    rentEndDate: new Date(),
    furnished: false,
    house: false,
    appartment: false,
    terrace: false,
    pets: false,
    smoker: false,
    disability: false,
    garden: false,
    parking: false,
    elevator: false,
    pool: false,
  });

  const onChangeAttributesHandler = (
    key: string,
    value: string | number | boolean | Date,
  ) => {
    if (!key) return;

    if (key === "price" || key === "size") {
      if (isNaN(Number(value))) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: true,
        }));
        return;
      }
    }

    if (!postId) return;

    setData((prevState) => ({
      ...prevState,
      [key]: value,
      postId: postId,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: false,
    }));
  };

  const updateAttributesButton = async () => {
    const newErrors = {
      location: data.location?.trim() === "",
      price: isNaN(Number(data.price)),
      size: isNaN(Number(data.size)),
    };

    setErrors(newErrors);

    if (newErrors.location || newErrors.price || newErrors.size) {
      return;
    }
    if (!data) return;
    await attributes.mutateAsync(data);
    navigation.navigate("ViewPost", { userId: userId });
  };

  return (
    <ScrollView className="mt-20">
      <View>
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-poppins text-custom mx-auto mb-10 text-center text-3xl">
            ATTRIBUTES
          </Text>
          <ShowProfile path={require("../../../assets/blank.png")} />
        </View>
        <CustomInput
          label="Location"
          value={data.location}
          category="location"
          onChangeAttributesHandler={onChangeAttributesHandler}
          multiline={true}
          placeholder="Enter location..."
          isEmpty={errors.location || false}
        />
        <CustomInput
          label="Price"
          category="price"
          value={data.price?.toString()}
          onChangeAttributesHandler={onChangeAttributesHandler}
          multiline={false}
          placeholder="Enter price..."
          isEmpty={errors.price || false}
        />
        <CustomInput
          label="Size"
          category="size"
          value={data.size?.toString()}
          onChangeAttributesHandler={onChangeAttributesHandler}
          multiline={false}
          placeholder="Enter size..."
          isEmpty={errors.size || false}
        />
      </View>
      <DatePicker
        startLabel={"rentStartDate"}
        endLabel={"rentEndDate"}
        onChangeAttributesHandler={onChangeAttributesHandler}
      />
      <AddSelectedAttributes
        data={[
          { name: "furnished", label: "Furnished", checked: data.furnished },
          { name: "house", label: "House", checked: data.house },
          { name: "appartment", label: "Appartment", checked: data.appartment },
          { name: "terrace", label: "Terrace", checked: data.terrace },
          { name: "pets", label: "Pets", checked: data.pets },
          { name: "smoker", label: "Smoker", checked: data.smoker },
          { name: "disability", label: "Disability", checked: data.disability },
          { name: "garden", label: "Garden", checked: data.garden },
          { name: "parking", label: "Parking", checked: data.parking },
          { name: "elevator", label: "Elevator", checked: data.elevator },
          { name: "pool", label: "Pool", checked: data.pool },
        ]}
        onChangeAttributesHandler={onChangeAttributesHandler}
      />
      <View className="mb-10 mt-10 flex-row justify-center">
        <View className="mr-10">
          <Button
            title={"Cancel"}
            color={"custom"}
            onPress={() => navigation.navigate("Stack", { userId })}
          />
        </View>
        <View>
          <Button
            title={"Next"}
            color={"custom"}
            onPress={() => updateAttributesButton()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateAttributes;
