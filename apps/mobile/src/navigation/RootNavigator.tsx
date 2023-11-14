/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ClerkLoaded } from "@clerk/clerk-expo";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";
import { trpc } from "../utils/trpc";
import { Icon } from "react-native-elements";
import { ShowProfile, EditProfile } from "../screens/Profile";
import ChooseRole from "../screens/Role";
import { Role, Lease } from "@leace/db";
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
import { Loading } from "../components/Loading";
import Toast from "react-native-toast-message";

const Tab = createBottomTabNavigator();

export type TabStackParamList = {
  Profile: { userId: string };
  Stack: { userId: string };
  MatchTenant: { userId: string; role: "TENANT" | "OWNER" | "AGENCY" };

  CreatePost: { userId: string };

  Premium: undefined;
  Likes: undefined;
  PaymentDetails: { selectedProduct: any; makePayment: boolean };

  PaymentResults: {
    loading: boolean;
    paymentStatus: boolean;
    response: any;
    selectedProduct: any;
  };

  EditProfile: {
    userId: string;
    data: string;
    showAttrs: boolean;
  };

  PostInfo: {
    userId: string;
    postId: string;
    editable: boolean;
  };

  MyPosts: {
    userId: string;
  };

  EditPost: {
    userId: string;
    data: string;
  };

  ChatTenant: {
    role: "TENANT" | "OWNER" | "AGENCY";
    tenantId: string;
    ownerId: string;
    conversationId: string;
    userId: string;
    lease: Lease | null;
    relationshipId: string;
  };

  Documents: { userId: string };
  Settings: undefined;
};

function NavigationRoutes({
  userId,
  role,
}: {
  userId: string;
  role: Role | null;
}) {
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
                  color={focused ? "#10316B" : "black"}
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
                <Icon
                  name={focused ? "view-dashboard" : "view-dashboard-outline"}
                  type="material-community"
                  color={focused ? "#10316B" : "black"}
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
        name="MatchTenant"
        component={TenantMatches}
        initialParams={{ userId, role: role === "TENANT" ? "TENANT" : "OWNER" }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "cards-heart" : "cards-heart-outline"}
              type="material-community"
              color={focused ? "#10316B" : "black"}
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      {role !== "TENANT" && (
        <Tab.Screen
          name="CreatePost"
          component={CreatePost}
          initialParams={{ userId }}
          options={{
            tabBarIcon: ({ focused }) => (
              <Icon
                name={focused ? "plus-square" : "plus-square-o"}
                type="font-awesome"
                color={focused ? "#10316B" : "black"}
              />
            ),
            tabBarLabel: "",
            headerShown: false,
          }}
        />
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
              color={focused ? "#10316B" : "black"}
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
          tabBarStyle: { display: "none" },
          tabBarButton: () => null,
          headerShown: true,
          headerTitleStyle: { color: "#10316B" },
          title: "Documents",
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
          /*tabBarIcon: ({ focused }) => (
            <Icon
              name={"description"}
              type="material-icons"
              color={focused ? "#10316B" : "black"}
            />
          ),
          tabBarLabel: "",
          headerShown: false,*/
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
              type="material-icons"
              color={focused ? "#10316B" : "black"}
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
    </Tab.Navigator>
  );
}
const RootNavigator = () => {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: user } = trpc.user.getUserById.useQuery(
    { userId: session?.userId as string },
    { enabled: !!session?.userId },
  );

  if (isLoading) return <Loading />;
  if (!session || !user) {
    return <Loading signOut={true} />;
  }

  return (
    <>
      <NavigationContainer>
        <ClerkLoaded>
          <NavigationRoutes userId={user.id} role={user.role} />
        </ClerkLoaded>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default RootNavigator;
