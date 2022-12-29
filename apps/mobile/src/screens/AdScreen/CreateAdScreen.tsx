import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { Button } from "react-native-elements";
import { useValidation } from 'react-native-form-validator';
import { useNavigation } from "@react-navigation/native";

export const CreateAdScreen = () => {

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [area, setArea] = useState('');
    const [charges, setCharges] = useState('');

    const [valid, setValid] = useState(false);

    const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
        useValidation({
            state: { name, email, address, type, description, date, price, area, charges },
        });

    const onPressButton = () => {
        validate({
            name: { minlength: 3, maxlength: 20, required: true },
            email: { email: true },
            address: { minlength: 3, maxlength: 200, required: true },
            type: { minlength: 3, maxlength: 20, required: true },
            description: { minlength: 3, maxlength: 200, required: true },
            date: { date: 'YYYY-MM-DD' },
            price: { minlength: 3, maxlength: 20, required: true },
            area: { minlength: 3, maxlength: 20, required: true },
            charges: { minlength: 2, maxlength: 20, required: true },
        });
        setValid(true);
    };

    return (
        <SafeAreaView className="mt-20">
            <ScrollView>
                <View>
                    <Text className="font-bold text-2xl text-center">Owner/Agency</Text>
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setName} value={name} placeholder="name" />
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setEmail} value={email} placeholder="email" />
                    <Text className="font-bold text-2xl text-center">Property</Text>
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setAddress} value={address} placeholder="address" />
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setType} value={type} placeholder="type" />
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setDescription} value={description} placeholder="description" />
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setDate} value={date} placeholder="date" />
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setPrice} value={price} placeholder="price" />
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setArea} value={area} placeholder="area" />
                    <TextInput className="h-10 m-3 border p-2.5" onChangeText={setCharges} value={charges} placeholder="charges" />

                    {!valid ?
                        <Button title="Submit" className="mx-9 mb-4 mt-4 rounded bg-blue-500 py-1 px-4 font-bold text-white hover:bg-blue-700" onPress={onPressButton} />
                        :
                        <Button title="Submit" className="mx-9 mb-4 mt-4 rounded bg-blue-500 py-1 px-4 font-bold text-white hover:bg-blue-700" onPress={() => {
                            navigation.navigate("ViewAdScreen", { name, email, address, type, description, date, price, area, charges })
                        }} />
                    }

                    <Text className="text-red-600 font-bold text-center mb-4">{getErrorMessages()}</Text>
                    {isFieldInError('date') &&
                        getErrorsInField('date').map((errorMessage) => (
                            <Text className="text-red-600 font-bold text-center">{errorMessage}</Text>
                        ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
