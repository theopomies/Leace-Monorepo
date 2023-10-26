import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { Icon } from "react-native-elements";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { EditPost, PostStack, ShowPost, CreatePost } from "../../screens/Post";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EditProfile, ShowProfile } from "../../screens/Profile";
import {
  OwnerLikes,
  BusinessOffers,
  Result,
  Details,
} from "../../screens/Premium";
import { TenantChat } from "../../screens/Chat";
import { TenantMatches } from "../../screens/Matches";
import { Documents } from "../../screens/Documents";

const Tab = createBottomTabNavigator<TabStackParamList>();

const Provider = ({
  userId,
  isPremium,
}: {
  userId: string;
  isPremium: boolean;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <Tab.Navigator initialRouteName="Profile">
      {/*
      <Tab.Screen
        name="Stack"
        component={ProviderStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "favorite" : "favorite-border"}
              color="#002642"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      */}
      <Tab.Screen
        name="MyPosts"
        component={PostStack}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/navbar/home-hover.png")
                  : require("../../../assets/navbar/home.png")
              }
              className="mt-5 h-6 w-6"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CreatePost"
        component={CreatePost}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/navbar/write-hover.png")
                  : require("../../../assets/navbar/write.png")
              }
              className="mt-5 h-6 w-6"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="PostInfo"
        initialParams={{ userId, editable: true }}
        component={ShowPost}
        options={{
          tabBarStyle: { display: "none" },
          tabBarButton: () => null,
          headerShown: true,
          headerTitleStyle: { color: "#10316B" },
          title: "Post",
          headerLeft: () => (
            <TouchableOpacity
              className="ml-4"
              onPress={() => navigation.navigate("MyPosts", { userId })}
            >
              <Icon
                name="arrow-back"
                color="#10316B"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="EditPost"
        initialParams={{ userId }}
        component={EditPost}
        options={{
          tabBarStyle: { display: "none" },
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Premium"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/navbar/crown-hover.png")
                  : require("../../../assets/navbar/crown.png")
              }
              className="mt-5 h-6 w-6"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      >
        {() => (isPremium ? <OwnerLikes /> : <BusinessOffers />)}
      </Tab.Screen>

      <Tab.Screen
        name="Likes"
        options={{
          tabBarButton: () => null,
          tabBarLabel: "",
          headerShown: false,
        }}
      >
        {() => <OwnerLikes />}
      </Tab.Screen>

      <Tab.Screen
        name="PaymentDetails"
        component={Details}
        options={{
          tabBarButton: () => null,
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="PaymentResults"
        component={Result}
        options={{
          tabBarButton: () => null,
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MatchTenant"
        component={TenantMatches}
        initialParams={{ userId, role: "OWNER" }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/navbar/chat-hover.png")
                  : require("../../../assets/navbar/chat.png")
              }
              className="mt-5 h-6 w-6"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ChatTenant"
        component={TenantChat}
        options={{
          tabBarStyle: { display: "none" },
          headerShown: true,
          title: "Chat",
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity
              className="ml-4"
              onPress={() =>
                navigation.navigate("MatchTenant", { userId, role: "OWNER" })
              }
            >
              <Icon
                name="arrow-back"
                color="#10316B"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={Documents}
        initialParams={{ userId }}
        options={{
          tabBarButton: () => null,
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ShowProfile}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/navbar/avatar-hover.png")
                  : require("../../../assets/navbar/avatar.png")
              }
              className="mt-5 h-6 w-6"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="EditProfile"
        initialParams={{ userId, showAttrs: false }}
        component={EditProfile}
        options={{
          tabBarStyle: { display: "none" },
          tabBarButton: () => null,
          headerShown: true,
          headerTitleStyle: { color: "#10316B" },
          title: "Edit Profile",
          headerLeft: () => (
            <TouchableOpacity
              className="ml-4"
              onPress={() => navigation.navigate("Profile", { userId })}
            >
              <Icon
                name="arrow-back"
                color="#10316B"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Provider;
