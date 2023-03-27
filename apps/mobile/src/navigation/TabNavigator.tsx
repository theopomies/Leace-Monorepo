import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { ProfileScreen } from "../screens/ProfileScreen/ProfileScreen";
import { MatchScreen } from "../screens/MatchScreen/MatchScreen";

import { CreatePost, CreateAttributes, ViewPost, ViewDetails } from "../screens/Post";

import { Available, Chat, Clients, Dashboard, Expenses, Income, Occupied } from "../screens/Dashboard";

import { MatchChatScreen } from "../screens/MatchScreen/MatchChatScreen";
import { Icon } from "react-native-elements";
import { View } from "react-native";
import { StackScreen } from '../screens/StackScreen/StackScreen';

export type TabStackParamList = {
  Role: undefined;
  Profile: undefined;
  Stack: undefined;
  Match: undefined;
  Dashboard: undefined;

  MatchChat: undefined;

  CreatePost: undefined;
  CreatePostAttributes: { postId: string };
  ViewPost: undefined;
  PostDetails: { postId: string };

  Expenses: undefined;
  Income: undefined;
  Clients: undefined;
  Occupied: undefined;
  Available: undefined;
  Chat: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Stack" component={StackScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? 'favorite' : 'favorite-border';
            return (
              <View>
                <Icon name={icon} color="#002642" />
              </View>
            );
          },
          tabBarLabel: '',
          headerShown: false,
        }}
      />
      <Tab.Screen name="Match" component={MatchScreen} options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? 'chat' : 'chat-bubble-outline'

          return (
            <View>
              {focused ?
                <Icon name={icon} type="material" />
                :
                <Icon name={icon} type="material" />
              }
            </View>
          );
        },
        tabBarLabel: '',
        headerShown: false
      }} />

      <Tab.Screen name="MatchChat" component={MatchChatScreen} options={{ tabBarButton: () => null, headerShown: false }} />


      <Tab.Screen name="CreatePost" component={CreatePost} options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? 'plus-square' : 'plus-square-o'

          return (
            <View>
              {focused ?
                <Icon name={icon} color="#002642" type="font-awesome" />
                :
                <Icon name={icon} color="#002642" type="font-awesome" />
              }
            </View>
          );
        },
        tabBarLabel: '',
        headerShown: false,
      }} />

      <Tab.Screen name="CreatePostAttributes" component={CreateAttributes} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="ViewPost" component={ViewPost} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="PostDetails" component={ViewDetails} options={{ tabBarButton: () => null, headerShown: false }} />

      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? 'user-circle' : 'user-circle-o'

          return (
            <View>
              {focused ?
                <Icon name={icon} color="#002642" type="font-awesome" />
                :
                <Icon name={icon} color="#002642" type="font-awesome" />
              }
            </View>
          );
        },
        tabBarLabel: '',
        headerShown: false
      }} />

      <Tab.Screen name="Dashboard" component={Dashboard} options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? 'view-dashboard' : 'view-dashboard-outline'

          return (
            <View>
              {focused ?
                <Icon name={icon} color="#002642" type="material-community" />
                :
                <Icon name={icon} color="#002642" type="material-community" />
              }
            </View>
          );
        },
        tabBarLabel: '',
        headerShown: false
      }} />
      <Tab.Screen name="Expenses" component={Expenses} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Income" component={Income} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Clients" component={Clients} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Occupied" component={Occupied} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Available" component={Available} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Chat" component={Chat} options={{ tabBarButton: () => null, headerShown: false }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
