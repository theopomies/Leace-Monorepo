import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { TenantStack, TenantMatches, TenantChat } from "../../screens/Tenant";
import { EditProfile, ShowProfile } from "../../screens/Profile";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ShowPost } from "../../screens/Post";
import {
  Details,
  OffersList,
  Result,
  TenantLikes,
} from "../../screens/Premium";

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
    <Tab.Navigator>
      <Tab.Screen
        name="Stack"
        component={TenantStack}
        initialParams={{ userId }}
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
      <Tab.Screen
        name="Match"
        component={TenantMatches}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "account-heart" : "account-heart-outline"}
              type="material-community"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MatchChat"
        component={TenantChat}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "chat" : "chat-bubble-outline"}
              type="material"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Premium"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "star-four-points" : "star-four-points-outline"}
              type="material-community"
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      >
        {() => (isPremium ? <TenantLikes /> : <OffersList />)}
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
        name="Profile"
        component={ShowProfile}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "person" : "person-outline"}
              color="#002642"
              type="material-icons"
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
    </Tab.Navigator>
  );
};

export default Tenant;
