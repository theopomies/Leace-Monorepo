import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { ProfileScreen } from "../screens/ProfileScreen/ProfileScreen";
import { MatchScreen } from "../screens/MatchScreen/MatchScreen";
import { StackScreen } from "../screens/StackScreen/StackScreen";
import { CreatePostScreen } from "../screens/AdScreen/CreatePostScreen";
import { CreatePostAttributesScreen } from '../screens/AdScreen/CreatePostAttributesScreen';
import { ViewPostScreen } from '../screens/AdScreen/ViewPostScreen';
import { PostDetailsScreen } from '../screens/AdScreen/PostDetailsScreen';

import { DashboardScreen } from "../screens/DashboardScreen/DashboardScreen";
import { AvailableScreen } from "../screens/DashboardScreen/AvailableScreen";
import { ChatScreen } from "../screens/DashboardScreen/ChatScreen";
import { ClientsScreen } from "../screens/DashboardScreen/ClientsScreen";
import { ExpensesScreen } from "../screens/DashboardScreen/ExpensesScreen";
import { IncomeScreen } from "../screens/DashboardScreen/IncomeScreen";
import { OccupiedScreen } from "../screens/DashboardScreen/OccupiedScreen";

import { MatchChatScreen } from "../screens/MatchScreen/MatchChatScreen";
import { Icon } from "react-native-elements";
import { View } from "react-native";

export type TabStackParamList = {
  Connexion: undefined;
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
      <Tab.Screen name="Stack" component={StackScreen} options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? 'favorite' : 'favorite-border';

          return (
            <View>
              <Icon name={icon} color="#002642" tvParallaxProperties={undefined} />
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
                <Icon name={icon} type="material" tvParallaxProperties={undefined} />
                :
                <Icon name={icon} type="material" tvParallaxProperties={undefined} />
              }
            </View>
          );
        },
        tabBarLabel: '',
        headerShown: false
      }} />

      <Tab.Screen name="MatchChat" component={MatchChatScreen} options={{ tabBarButton: () => null, headerShown: false }} />


      <Tab.Screen name="CreatePost" component={CreatePostScreen} options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? 'plus-square' : 'plus-square-o'

          return (
            <View>
              {focused ?
                <Icon name={icon} color="#002642" type="font-awesome" tvParallaxProperties={undefined} />
                :
                <Icon name={icon} color="#002642" type="font-awesome" tvParallaxProperties={undefined} />
              }
            </View>
          );
        },
        tabBarLabel: '',
        headerShown: false,
      }} />

      <Tab.Screen name="CreatePostAttributes" component={CreatePostAttributesScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="ViewPost" component={ViewPostScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="PostDetails" component={PostDetailsScreen} options={{ tabBarButton: () => null, headerShown: false }} />

      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? 'user-circle' : 'user-circle-o'

          return (
            <View>
              {focused ?
                <Icon name={icon} color="#002642" type="font-awesome" tvParallaxProperties={undefined} />
                :
                <Icon name={icon} color="#002642" type="font-awesome" tvParallaxProperties={undefined} />
              }
            </View>
          );
        },
        tabBarLabel: '',
        headerShown: false
      }} />

      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? 'view-dashboard' : 'view-dashboard-outline'

          return (
            <View>
              {focused ?
                <Icon name={icon} color="#002642" type="material-community" tvParallaxProperties={undefined} />
                :
                <Icon name={icon} color="#002642" type="material-community" tvParallaxProperties={undefined} />
              }
            </View>
          );
        },
        tabBarLabel: '',
        headerShown: false
      }} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Income" component={IncomeScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Clients" component={ClientsScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Occupied" component={OccupiedScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Available" component={AvailableScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarButton: () => null, headerShown: false }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
