import { View, Text } from "react-native";
import { Carousel } from "../../components/Carousel/Carousel";
import { ShowSelectedAttributes } from "../Attributes";
import { Button } from "../Button";
import MainAttributes from "../Attributes/MainAttributes";

const PostAttributeCard = ({
  title,
  desc,
  location,
  price,
  size,
  rentStartDate,
  rentEndDate,
  furnished,
  house,
  appartment,
  terrace,
  pets,
  smoker,
  disability,
  garden,
  parking,
  elevator,
  pool,
}: {
  title: string | null;
  desc: string | null;
  content: string | null;
  location: string | null | undefined;
  price: number | null | undefined;
  size: number | null | undefined;
  rentStartDate: Date | null | undefined;
  rentEndDate: Date | null | undefined;
  furnished: boolean | null | undefined;
  house: boolean | null | undefined;
  appartment: boolean | null | undefined;
  terrace: boolean | null | undefined;
  pets: boolean | null | undefined;
  smoker: boolean | null | undefined;
  disability: boolean | null | undefined;
  garden: boolean | null | undefined;
  parking: boolean | null | undefined;
  elevator: boolean | null | undefined;
  pool: boolean | null | undefined;
}) => {
  const data = [
    "/Users/dak/Work/Epitech/Leace-Monorepo/apps/mobile/assets/image 2.png",
    "/Users/dak/Work/Epitech/Leace-Monorepo/apps/mobile/assets/image 2.png",
    "/Users/dak/Work/Epitech/Leace-Monorepo/apps/mobile/assets/image 2.png",
  ];

  return (
    <View className="mx-2 max-w-sm overflow-hidden rounded-2xl border border-gray-300">
      <Text className="mt-1 text-center text-xl font-bold ">{title}</Text>
      <View className="mt-2">
        <Carousel value={data} />
      </View>

      <View className="ml-5">
        <MainAttributes
          location={location}
          price={price}
          desc={desc}
          rentStartDate={rentStartDate}
          rentEndDate={rentEndDate}
          size={size}
        />
        <ShowSelectedAttributes
          furnished={furnished}
          house={house}
          apartment={appartment}
          terrace={terrace}
          pets={pets}
          smoker={smoker}
          disability={disability}
          garden={garden}
          parking={parking}
          elevator={elevator}
          pool={pool}
        />
      </View>

      <View className="mb-10 flex-row justify-center">
        <View className="mr-10">
          <Button title={"Edit"} color={"custom"} />
        </View>
        <View>
          <Button title={"Delete"} color={"red-500"} />
        </View>
      </View>
    </View>
  );
};

export default PostAttributeCard;
