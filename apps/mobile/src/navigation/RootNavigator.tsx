import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ConnexionScreen } from "../screens/ConnexionScreen/ConnexionScreen";

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={ {headerShown: false} }>
                <RootStack.Group>
                    {/* <RootStack.Screen name="Main" component={} /> */}
                </RootStack.Group>
                <RootStack.Screen name="Connexion" component={ConnexionScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;