import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from "react-native-elements"
import { Carousel } from '../../components/Carousel/Carousel'

export const PostAttributeCard = ({
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
                <Text className="text-custom text-base">
                    {location}
                </Text>
                <Text className="text-custom text-base">
                    {price}$
                </Text>
                <Text className="text-custom text-base mb-0.5">
                    {desc}
                </Text>
                <View className="flex-row mb-2 mt-2">
                    <View
                        className="mx-3  bg-custom rounded text-white font-semibold w-20 h-12 flex justify-center items-center">
                        <Text className="font-semibold text-xs text-white">{rentStartDate?.toISOString().split('T')[0]}</Text>
                    </View>
                    <View
                        className="mx-3  bg-custom rounded text-white font-semibold w-20 h-12 flex justify-center items-center"
                    >
                        <Text className="font-semibold text-xs text-white">{rentEndDate?.toISOString().split('T')[0]}</Text>
                    </View>
                    <View
                        className="mx-3 bg-custom rounded text-white font-semibold w-20 h-12 flex justify-center items-center"
                    >
                        <Text className="font-semibold text-center text-sm text-white">{size?.toString()} m²</Text>
                    </View>
                </View>

                <View className="flex-row flex-wrap justify-center mb-10">
                    <View className="flex-row items-center">
                        {furnished ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center" >
                                <Icon name="table-furniture" type="material-community" color="#002642" style={{ marginLeft: 8 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">furnished</Text>
                            </View>
                            :
                            null
                        }
                    </View>
                    <View className="flex-row items-center">
                        {house ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center" >
                                <Icon name="house" color="#002642" style={{ marginLeft: 16 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">house</Text>
                            </View>
                            :
                            null
                        }
                    </View>

                    <View className="flex-row items-center">
                        {appartment ? (
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
                                <Icon name="building" type="font-awesome" style={{ marginLeft: 4 }} color="#002642" size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">appartment</Text>
                            </View>
                        ) : null}
                    </View>

                    <View className="flex-row items-center">
                        {terrace ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
                                <Icon name="balcony" type="material-community" color="#002642" style={{ marginLeft: 8 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">terrace</Text>
                            </View>
                            :
                            null
                        }
                    </View>

                    <View className="flex-row items-center">
                        {pets ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
                                <Icon name="pets" color="#002642" style={{ marginLeft: 20 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">pets</Text>
                            </View>
                            :
                            null
                        }
                    </View>

                    <View className="flex-row items-center">
                        {smoker ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
                                <Icon name="smoking-rooms" color="#002642" style={{ marginLeft: 16 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">smoker</Text>
                            </View>
                            :
                            null
                        }
                    </View>

                    <View className="flex-row items-center">
                        {disability ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
                                <Icon name="paralysis-disability" type="fontisto" color="#002642" style={{ marginLeft: 16 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">disability</Text>
                            </View>
                            :
                            null
                        }
                    </View>

                    <View className="flex-row items-center">
                        {garden ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
                                <Icon name="nature-people" color="#002642" style={{ marginLeft: 16 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">garden</Text>
                            </View>
                            :
                            null
                        }
                    </View>

                    <View className="flex-row items-center">
                        {parking ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
                                <Icon name="local-parking" color="#002642" style={{ marginLeft: 16 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">parking</Text>
                            </View>
                            :
                            null
                        }
                    </View>

                    <View className="flex-row items-center">
                        {elevator ?
                            <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
                                <Icon name="elevator" color="#002642" style={{ marginLeft: 16 }} size={15} tvParallaxProperties={undefined} />
                                <Text className="text-custom font-bold text-xs text-center ml-0.5">elevator</Text>
                            </View>
                            :
                            null
                        }
                    </View>

                    {pool ?
                        <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center" >
                            <Icon name="pool" color="#002642" style={{ marginLeft: 16 }} size={15} tvParallaxProperties={undefined} />
                            <Text className="text-custom font-bold text-xs text-center ml-0.5">pool</Text>
                        </View>
                        :
                        null
                    }
                </View>
            </View>

            <View className="flex-row justify-center mb-10">
                <TouchableOpacity
                    className="mx-3 py-4 px-10 bg-red-600 rounded text-white font-semibold mr-10 w-32 h-12 flex justify-center items-center"
                >
                    <Text className="font-semibold text-white">Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="mx-3 py-4 px-10 bg-custom rounded text-white font-semibold w-32 h-12 flex justify-center items-center"
                >
                    <Text className="font-semibold text-white">Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

