import React from 'react'
import { View, Text, TouchableOpacity, Image } from "react-native"
import Swiper from 'react-native-swiper'
import { trpc } from '../../utils/trpc'
import { RouterInputs } from '../../../../web/src/utils/trpc'
import { UserRoles } from '../../utils/enum';
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TabStackParamList } from '../../navigation/TabNavigator'


const RoleScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    const utils = trpc.useContext();
    const userRole = trpc.user.updateUserRole.useMutation({
        onSuccess() {
            utils.auth.getSession.invalidate();
        },
    });

    const handleClick = async (
        e: { preventDefault: () => void },
        role: RouterInputs["user"]["updateUserRole"],
    ) => {
        e.preventDefault();
        userRole.mutate(role);
        navigation.navigate("Stack")
    };

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-center font-poppins text-3xl	text-custom mx-auto mb-20">CHOOSE YOUR ROLE</Text>
            <View className="flex justify-center items-center h-1/2 w-5/6 rounded-2xl border shadow-xl border-gray-400">
                <Swiper showsButtons={true} loadMinimal loadMinimalSize={3} autoplay autoplayTimeout={5}>
                    <TouchableOpacity onPress={(e) => handleClick(e, UserRoles.TENANT)} className="flex space-y-5 justify-center items-center h-full w-full">
                        <Image source={require('../../../assets/logo.png')} className="w-20 h-20 rounded-full " />
                        <Text className="font-bold text-xl underline">TENANT</Text>
                        <Text className='text-center p-5'>
                            Finding the perfect apartment has never been easier!
                            Swipe through our extensive selection of high-quality rentals and discover your dream home today.
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(e) => handleClick(e, UserRoles.OWNER)} className="flex justify-center space-y-5 items-center h-full w-full">
                        <Image source={require('../../../assets/logo.png')} className="w-20 h-20 rounded-full " />
                        <Text className="font-bold text-xl underline">OWNER</Text>
                        <Text className="text-center p-5">
                            We take care of all the details,
                            from marketing your property to managing lease agreements,
                            so you can sit back and relax.
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(e) => handleClick(e, UserRoles.AGENCY)} className="flex  space-y-5 justify-center items-center h-full w-full">
                        <Image source={require('../../../assets/logo.png')} className="w-20 h-20 rounded-full " />
                        <Text className="font-bold text-xl underline">AGENCY</Text>
                        <Text className="text-center p-5">
                            Effortlessly manage your rental portfolio with our powerful tools and innovative features.
                            Join our network today and take your business to the next level!
                        </Text>
                    </TouchableOpacity>
                </Swiper>
            </View>
        </View>
    )
}

export default RoleScreen