import React from "react";
import { TabStackParamList } from "./TabNavigator";
import { ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Button, TouchableOpacity } from "react-native";
import { trpc } from "../utils/trpc";
import { Icon } from "react-native-elements";
import { ShowProfile, EditProfile } from "../screens/Profile";
import ChooseRole from "../screens/Role";
import { Role } from "@leace/db";
import { PostStack, CreatePost, ShowPost, EditPost } from "../screens/Post";
import {
  OwnerLikes,
  OffersList,
  Details,
  Result,
  TenantLikes,
} from "../screens/Premium";
import { Documents } from "../screens/Documents";
import { TenantChat } from "../screens/Chat";
import { TenantMatches } from "../screens/Matches";
import { TenantStack } from "../screens/Stack";

const Tab = createBottomTabNavigator();

function Test({ userId, role }: { userId: string; role: Role | null }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const isPremium = false;
  return (
    <Tab.Navigator initialRouteName="Role">
      {!role && (
        <Tab.Screen
          name="Role"
          component={ChooseRole}
          options={{
            tabBarStyle: { display: "none" },
            tabBarButton: () => null,
            headerShown: false,
          }}
        />
      )}
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
      {role === "TENANT" && (
        <>
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
        </>
      )}
      {role !== "TENANT" && (
        <>
          <Tab.Screen
            name="MyPosts"
            component={PostStack}
            initialParams={{ userId }}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon name={"list-alt"} type="font-awesome" />
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
                <Icon
                  name={focused ? "plus-square" : "plus-square-o"}
                  type="font-awesome"
                />
              ),
              tabBarLabel: "",
              headerShown: false,
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
        </>
      )}
      <Tab.Screen
        name="Premium"
        component={
          isPremium
            ? role === "TENANT"
              ? TenantLikes
              : OwnerLikes
            : OffersList
        }
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
      />
      <Tab.Screen
        name="Likes"
        component={role === "TENANT" ? TenantLikes : OwnerLikes}
        options={{
          tabBarButton: () => null,
          tabBarLabel: "",
          headerShown: false,
        }}
      />
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
        initialParams={{ userId, role: role === "TENANT" ? "TENANT" : "OWNER" }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "account-multiple" : "account-multiple-outline"}
              type="material-community"
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
                navigation.navigate("MatchTenant", {
                  userId,
                  role: role === "TENANT" ? "TENANT" : "OWNER",
                })
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
        name="PostInfo"
        initialParams={{ userId, editable: !(role === "TENANT") }}
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
        name="Documents"
        component={Documents}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="description" type="material" />
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
    </Tab.Navigator>
  );
}
const RootNavigator = () => {
  const { signOut } = useAuth();
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: user, isLoading: userLoading } = trpc.user.getUserById.useQuery(
    { userId: session?.userId as string },
    { enabled: !!session?.userId },
  );
  if (isLoading || userLoading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Button
          title="Loading... if (isLoading || userLoading)"
          onPress={() => signOut()}
        />
      </View>
    );

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Button title="Sign Out" onPress={() => signOut()} />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Button title="Loading... if (!user)" onPress={() => signOut()} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <ClerkLoaded>
        <Test userId={user.id} role={user.role} />
      </ClerkLoaded>
    </NavigationContainer>
  );
};

export default RootNavigator;
