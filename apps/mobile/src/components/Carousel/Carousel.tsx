import React from "react";
import { View, Image, Dimensions } from "react-native";
import CarouselComp from 'react-native-snap-carousel';

const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CarouselItem = ({ item, index }: { item: string, index: number }) => {
    return (
        <View key={index}>
            <Image className="h-52 w-11/12 mb-5 ml-4 rounded" source={{ uri: item }} />
        </View>
    );
};

export const Carousel = ({ value }: { value: string[] }) => {
    const isCarousel = React.useRef(null);

    return (
        <View className="items-center" >
            <CarouselComp
                layout="default"
                layoutCardOffset={9}
                ref={isCarousel}
                data={value}
                renderItem={CarouselItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
            />
        </View>
    );
};
