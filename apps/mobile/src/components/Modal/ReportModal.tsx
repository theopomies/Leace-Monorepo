import { View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';
import { Reason } from '../../utils/enum';
import Modal from './Modal'
import { trpc } from '../../utils/trpc';


const ReportModal = ({ cond, visible }: { cond: boolean, visible: boolean }) => {

    const reportUser = trpc.report.reportPost.useMutation()

    const [selectedValue, setSelectedValue] = useState<Reason>(Reason.SPAM);
    const [isOpened, setIsOpened] = useState(false);

    const reportButton = (reason: Reason) => {
        reportUser.mutate({ postId: reportUser.data?.id as string, reason: reason });
    };

    return (
        <View>
            {cond ? <Button title="Report" buttonStyle={{ backgroundColor: "#002642" }} className="mx-9 mt-5 rounded bg-blue-500  text-white hover:bg-blue-700" onPress={() => {
                setIsOpened(true);
            }} /> : <></>}
            {isOpened && visible ?
                <Modal aspect={false} visible={isOpened}>
                    <View className="items-center">
                        <TouchableOpacity onPress={() => {
                            setIsOpened(false);
                        }}>
                            <Image
                                source={require('../../../assets/x.png')}
                                className="h-8 w-8 mb-5"
                            />
                        </TouchableOpacity>
                        <Picker
                            selectedValue={selectedValue}
                            style={{ height: 50, width: 300, marginBottom: 200 }}
                            onValueChange={(itemValue) => setSelectedValue(itemValue as Reason)}
                        >
                            <Picker.Item label="SPAM" value={Reason.SPAM} />
                            <Picker.Item label="SCAM" value={Reason.SCAM} />
                            <Picker.Item label="INAPPROPRIATE" value={Reason.INAPPROPRIATE} />
                            <Picker.Item label="OTHER" value={Reason.OTHER} />
                        </Picker>

                        <Button title="Submit" className="mt-20 mx-9 mb-4 rounded bg-blue-500 py-1 px-4 font-bold text-white hover:bg-blue-700" onPress={() => { reportButton(selectedValue); setIsOpened(false); }} />

                    </View>
                </Modal>
                : <></>}
        </View>
    )
}

export default ReportModal