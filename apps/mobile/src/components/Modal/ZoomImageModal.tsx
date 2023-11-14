import React, { useRef, createRef } from "react";
import { Animated, Modal, Text, View } from "react-native";
import {
  PinchGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import type {
  HandlerStateChangeEventPayload,
  PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { Btn } from "../Btn";

export default function ZoomImageModal({
  image,
  callback,
}: {
  image: {
    id: string;
    url: string;
  };
  callback: () => void;
}) {
  const pinchRef = createRef();
  const panRef = createRef();
  const scale = useRef(new Animated.Value(1)).current;
  const onPinchEvent = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: true,
  });

  function handlePinchStateChange({
    nativeEvent,
  }: {
    nativeEvent: Readonly<
      HandlerStateChangeEventPayload & PinchGestureHandlerEventPayload
    >;
  }) {
    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1)
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    }
  }

  return (
    <Modal animationType="fade" onRequestClose={callback}>
      <View
        className="flex flex-row items-center justify-between px-3 py-0.5"
        style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 0.2 }}
      >
        <Text>{image.id}</Text>
        <View>
          <Btn title="Close" onPress={callback}></Btn>
        </View>
      </View>
      <View className=" overflow-hidden">
        <GestureHandlerRootView>
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchEvent}
            simultaneousHandlers={[panRef]}
            onHandlerStateChange={handlePinchStateChange}
          >
            <Animated.Image
              source={{ uri: image.url }}
              style={{
                width: "100%",
                height: "100%",
                transform: [{ scale }],
              }}
              resizeMode="contain"
            />
          </PinchGestureHandler>
        </GestureHandlerRootView>
      </View>
    </Modal>
  );
}
