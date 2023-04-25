import React from "react";
import { Animated, Modal, View } from "react-native";

const ModalPopup = ({ visible, children, aspect }: { visible: boolean, children: React.ReactNode, aspect: boolean }) => {
    const [showModal, setShowModal] = React.useState(visible);
    const [modalAspect, setModalAspect] = React.useState(visible);
    const scaleValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        toggleModal();
    }, [visible]);

    const toggleModal = () => {
        if (aspect) {
            setModalAspect(true)
        } else {
            setModalAspect(false)
        }
        if (visible) {
            setShowModal(true);
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            setTimeout(() => setShowModal(false), 200);
            Animated.timing(scaleValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <Modal transparent={modalAspect} visible={showModal}>
            <View className="flex-1 justify-center items-center mt-20">
                <Animated.View
                    className="px-5 py-7 rounded-tr-2xl"
                    style={[{ transform: [{ scale: scaleValue }] }]}>
                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};

export default ModalPopup