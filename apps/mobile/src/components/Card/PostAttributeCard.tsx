import { View, Text } from 'react-native';
import { Carousel } from '../../components/Carousel/Carousel'
import { ShowSelectedAttributes } from '../Attributes';
import { Button } from "../Button"
import MainAttributes from '../Attributes/MainAttributes';

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
    pool
}: {
    title: string | null,
    desc: string | null,
    content: string | null,
    location: string | undefined,
    price: number | undefined,
    size: number | undefined,
    rentStartDate: Date | undefined,
    rentEndDate: Date | undefined,
    furnished: boolean | undefined,
    house: boolean | undefined,
    appartment: boolean | undefined,
    terrace: boolean | undefined,
    pets: boolean | undefined,
    smoker: boolean | undefined,
    disability: boolean | undefined,
    garden: boolean | undefined,
    parking: boolean | undefined,
    elevator: boolean | undefined,
    pool: boolean | undefined
}) => {

    const data = [
        "/Users/david/Work/Epitech/Leace-Monorepo/apps/mobile/assets/image 2.png",
        "/Users/david/Work/Epitech/Leace-Monorepo/apps/mobile/assets/image 2.png",
        "/Users/david/Work/Epitech/Leace-Monorepo/apps/mobile/assets/image 2.png",
    ]

    return (
        <View className="max-w-sm rounded-2xl overflow-hidden border border-gray-300 mx-2">
            <Text className="font-bold text-center mt-1 text-xl ">{title}</Text>
            <View className="mt-2">
                <Carousel value={data} />
            </View>

            <View className="ml-5">
                <MainAttributes location={location} price={price} desc={desc} rentStartDate={rentStartDate}
                    rentEndDate={rentEndDate} size={size} />
                <ShowSelectedAttributes
                    furnished={furnished} house={house} apartment={appartment}
                    terrace={terrace} pets={pets} smoker={smoker}
                    disability={disability} garden={garden} parking={parking}
                    elevator={elevator} pool={pool} />
            </View>

            <View className="flex-row space-x-10 justify-center mb-10">
                <Button title={'Edit'} color={'custom'} />
                <Button title={'Delete'} color={'red-200'} />
            </View>
        </View>
    )
};

export default PostAttributeCard;