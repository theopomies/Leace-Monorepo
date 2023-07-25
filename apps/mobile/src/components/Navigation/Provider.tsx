import React from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { UserRoles } from "../../utils/enum";

const Tab = createBottomTabNavigator<TabStackParamList>();

const Provider = ({
  role,
  userId,
}: {
  role: keyof typeof UserRoles | null;
  userId: string;
}) => {
  return (
    <Tab.Navigator>
      {/**
    {role === null || role === undefined ? (
      <Tab.Screen
        name="Role"
        component={() => (
          <View>
            <Text>Role</Text>
          </View>
        )}
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
      name="Match"
      component={() => (
        <View>
          <Text>Match</Text>
        </View>
      )}
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
      component={() => (
        <View>
          <Text>CreatePost</Text>
        </View>
      )}
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
      component={() => (
        <View>
          <Text>CreateAttributes</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="ViewPost"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>ViewPost</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="PostDetails"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>PostDetails</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Portal"
      component={() => (
        <View>
          <Text>Portal</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />

    <Tab.Screen
      name="MatchChat"
      component={() => (
        <View>
          <Text>MatchChat</Text>
        </View>
      )}
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
      component={() => (
        <View>
          <Text>Dashboard</Text>
        </View>
      )}
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
      component={() => (
        <View>
          <Text>Expense</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Income"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Income</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Clients"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Clients</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Occupied"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Occupied</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Available"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Available</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Chat"
      component={() => (
        <View>
          <Text>Chat</Text>
        </View>
      )}
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
      component={() => (
        <View>
          <Text>Lease</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="UpdateLease"
      component={() => (
        <View>
          <Text>UpdateLease</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    /> */}
    </Tab.Navigator>
  );
};

export default Provider;
