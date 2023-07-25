import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { UserRoles } from "../../utils/enum";
import { TenantStack, TenantMatches, TenantChat } from "../../screens/Tenant";
import Role from "../../screens/Role";
import { EditProfile, ShowProfile } from "../../screens/Profile";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ShowPost } from "../../screens/Post";

const Tab = createBottomTabNavigator<TabStackParamList>();

interface ITenant {
  role: keyof typeof UserRoles | null;
  userId: string;
}

const Tenant = ({ role, userId }: ITenant) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <Tab.Navigator>
      {role === null || role === undefined ? (
        <Tab.Screen
          name="Role"
          component={Role}
          options={{
            tabBarStyle: { display: "none" },
            tabBarLabel: "",
            headerShown: false,
            tabBarButton: () => null,
          }}
        />
      ) : null}
      <Tab.Screen
        name="Stack"
        component={TenantStack}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                name={focused ? "favorite" : "favorite-border"}
                color="#002642"
              />
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Match"
        component={TenantMatches}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                name={focused ? "star-four-points" : "star-four-points-outline"}
                type="material-community"
              />
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="MatchChat"
        component={TenantChat}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                name={focused ? "chat" : "chat-bubble-outline"}
                type="material"
              />
            );
          },
          tabBarLabel: "",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ShowProfile}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                name={focused ? "person" : "person-outline"}
                color="#002642"
                type="material-icons"
              />
            );
          },
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
        initialParams={{ userId }}
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
