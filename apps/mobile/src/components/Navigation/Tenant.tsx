import React from "react";
import { TouchableOpacity, Image, Platform } from "react-native";
import { Icon } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { TenantStack } from "../../screens/Stack";
import { TenantMatches } from "../../screens/Matches";
import { EditProfile, ShowProfile } from "../../screens/Profile";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ShowPost } from "../../screens/Post";
import {
  Details,
  TenantOffers,
  Result,
  TenantLikes,
} from "../../screens/Premium";
import { TenantChat } from "../../screens/Chat";
import { Documents } from "../../screens/Documents";

const Tab = createBottomTabNavigator<TabStackParamList>();
const Tenant = ({
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
      <Tab.Screen
        name="Stack"
        component={TenantStack}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/navbar/home-hover.png")
                  : require("../../../assets/navbar/home.png")
              }
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MatchTenant"
        component={TenantMatches}
        initialParams={{ userId, role: "TENANT" }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/navbar/chat-hover.png")
                  : require("../../../assets/navbar/chat.png")
              }
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
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
                navigation.navigate("MatchTenant", { userId, role: "TENANT" })
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
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="EditProfile"
        initialParams={{ userId }}
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
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      >
        {() => (isPremium ? <TenantLikes /> : <TenantOffers />)}
      </Tab.Screen>
      <Tab.Screen
        name="Likes"
        options={{
          tabBarButton: () => null,
          tabBarLabel: "",
          headerShown: false,
        }}
      >
        {() => <TenantLikes />}
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
        name="PostInfo"
        initialParams={{ userId, editable: false }}
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
              onPress={() => navigation.navigate("Stack", { userId })}
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
    </Tab.Navigator>
  );
};

export default Tenant;
