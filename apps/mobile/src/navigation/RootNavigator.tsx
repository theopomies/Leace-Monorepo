import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { ConnexionScreen } from "../screens/ConnexionScreen/ConnexionScreen";
import { ProfileScreen } from "../screens/ProfileScreen/ProfileScreen"

export type RootStackParamList = {
    Main : undefined;
    Model: undefined;
}

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={ {headerShown: false} } >
                <RootStack.Screen name="Connexion" component={ConnexionScreen} />
                <RootStack.Group>
                    <RootStack.Screen name="Main" component={TabNavigator} />
                </RootStack.Group>
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;