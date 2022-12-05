import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ConnexionScreen } from "../screens/ConnexionScreen/ConnexionScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={ {headerShown: false} }>
                <Stack.Screen name="Connexion" component={ConnexionScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;