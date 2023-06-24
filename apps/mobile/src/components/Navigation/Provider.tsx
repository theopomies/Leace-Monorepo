import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import {
  Dashboard,
  Expenses,
  Income,
  Clients,
  Occupied,
  Available,
  Chat,
} from "../../screens/Dashboard";
import { Match, MatchChat } from "../../screens/Match";
import {
  CreatePost,
  CreateAttributes,
  ViewPost,
  ViewDetails,
} from "../../screens/Post";
import { Stack } from "../../screens/Stack/stack";
import { Lease } from "../../screens/Lease/lease";
import Role from "../../screens/Role/role";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { UserRoles } from "../../utils/enum";
import { Portal } from "../Chat/Portal";
import { UpdateLease } from "../../screens/Lease/updateLease";

const Tab = createBottomTabNavigator<TabStackParamList>();

const Provider = ({
  role,
  userId,
}: {
  role: keyof typeof UserRoles;
  userId: string;
}) => {
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
        component={Stack}
        initialParams={{ userId }}
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

      <Tab.Screen
        name="CreatePost"
        component={CreatePost}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? "plus-square" : "plus-square-o";

            return (
              <View>
                {focused ? (
                  <Icon name={icon} color="#002642" type="font-awesome" />
                ) : (
                  <Icon name={icon} color="#002642" type="font-awesome" />
                )}
              </View>
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CreatePostAttributes"
        initialParams={{ userId }}
        component={CreateAttributes}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="ViewPost"
        initialParams={{ userId }}
        component={ViewPost}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="PostDetails"
        initialParams={{ userId }}
        component={ViewDetails}
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
        name="Dashboard"
        component={Dashboard}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? "view-dashboard" : "view-dashboard-outline";

            return (
              <View>
                {focused ? (
                  <Icon name={icon} color="#002642" type="material-community" />
                ) : (
                  <Icon name={icon} color="#002642" type="material-community" />
                )}
              </View>
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Expenses"
        initialParams={{ userId }}
        component={Expenses}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="Income"
        initialParams={{ userId }}
        component={Income}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="Clients"
        initialParams={{ userId }}
        component={Clients}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="Occupied"
        initialParams={{ userId }}
        component={Occupied}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="Available"
        initialParams={{ userId }}
        component={Available}
        options={{ tabBarButton: () => null, headerShown: false }}
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
        name="Lease"
        component={Lease}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="UpdateLease"
        component={UpdateLease}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default Provider;
