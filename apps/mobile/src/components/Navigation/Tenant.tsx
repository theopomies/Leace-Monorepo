import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { Match, MatchChat } from "../../screens/Match";
import { Profile } from "../../screens/Profile/profile";
// import { Stack } from "../../screens/Stack/stack";
import { Offer } from "../../screens/Offer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../../navigation/TabNavigator";
import Role from "../../screens/Role/role";
import { UserRoles } from "../../utils/enum";
import { Chat } from "../../screens/Dashboard";
import { Portal } from "../Chat/Portal";

const Tab = createBottomTabNavigator<TabStackParamList>();

const Tenant = ({ role }: { role: keyof typeof UserRoles }) => {
  return (
    <Tab.Navigator>
      {role === null || role === undefined ? (
        <Tab.Screen
          name="Role"
          component={Role}
          options={{
            tabBarStyle: {
              display: "none",
            },
            tabBarLabel: "",
            headerShown: false,
            tabBarButton: () => null,
          }}
        />
      ) : null}
      <Tab.Screen
        name="Stack"
        component={Match}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? "favorite" : "favorite-border";
            return (
              <View>
                <Icon name={icon} color="#002642" />
              </View>
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Match"
        component={Match}
        options={{ tabBarButton: () => null, headerShown: false }}
      />

      <Tab.Screen
        name="Portal"
        component={Portal}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="MatchChat"
        component={MatchChat}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? "chat" : "chat-bubble-outline";

            return (
              <View>
                {focused ? (
                  <Icon name={icon} type="material" />
                ) : (
                  <Icon name={icon} type="material" />
                )}
              </View>
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? "person" : "person-outline";

            return (
              <View>
                {focused ? (
                  <Icon name={icon} color="#002642" type="material-icons" />
                ) : (
                  <Icon name={icon} color="#002642" type="material-icons" />
                )}
              </View>
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarButton: () => null,
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />

      <Tab.Screen
        name="Offer"
        component={Offer}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused
              ? "star-four-points"
              : "star-four-points-outline";

            return (
              <View>
                {focused ? (
                  <Icon name={icon} type="material-community" />
                ) : (
                  <Icon name={icon} type="material-community" />
                )}
              </View>
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tenant;
