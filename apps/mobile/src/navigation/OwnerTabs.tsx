import { useRoute, RouteProp } from "@react-navigation/native";
import { TouchableOpacity, Platform, Image } from "react-native";
import { Icon } from "react-native-elements";
import { TenantChat } from "../screens/Chat";
import OwnerDashboard from "../screens/Dashboard/OwnerDashboard";
import { Documents } from "../screens/Documents";
import { TenantMatches } from "../screens/Matches";
import { PostStack, ShowPost, EditPost, CreatePost } from "../screens/Post";
import { ShowProfile, EditProfile } from "../screens/Profile";
import { PostsReviews, UsersReviews } from "../screens/Reviews";
import { TabStackParamList } from "./RootNavigator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Role } from "@leace/db";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function OwnerDashboardScreens() {
  const route =
    useRoute<RouteProp<TabStackParamList, "OwnerDashboardScreens">>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OwnerDashboard"
        component={OwnerDashboard}
        initialParams={{ userId: route.params.userId }}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export function OwnerChatScreens() {
  const route = useRoute<RouteProp<TabStackParamList, "OwnerChatScreens">>();
  const { userId, role } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MatchTenant"
        component={TenantMatches}
        initialParams={{ userId, role: role === "TENANT" ? "TENANT" : "OWNER" }}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="ChatTenant"
        component={TenantChat}
        options={{
          title: "Go Back",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => {
                if (props.onPress) props.onPress();
              }}
            >
              <Icon
                name="arrow-back"
                color="#6366f1"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

function OwnerStackScreens() {
  const route = useRoute<RouteProp<TabStackParamList, "OwnerStackScreens">>();
  const { userId, role } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPosts"
        component={PostStack}
        initialParams={{ userId }}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="PostInfo"
        initialParams={{ userId, editable: !(role === "TENANT") }}
        component={ShowPost}
        options={{
          title: "Go Back",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => {
                if (props.onPress) props.onPress();
              }}
            >
              <Icon
                name="arrow-back"
                color="#6366f1"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="PostReviews"
        component={PostsReviews}
        options={{
          title: "Go Back",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => {
                if (props.onPress) props.onPress();
              }}
            >
              <Icon
                name="arrow-back"
                color="#6366f1"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="EditPost"
        initialParams={{ userId }}
        component={EditPost}
        options={{
          title: "Go Back",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => {
                if (props.onPress) props.onPress();
              }}
            >
              <Icon
                name="arrow-back"
                color="#6366f1"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export function OwnerProfileScreens() {
  const route = useRoute<RouteProp<TabStackParamList, "OwnerProfileScreens">>();
  const { userId } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ViewProfile"
        component={ShowProfile}
        initialParams={{ userId, editable: true }}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="Documents"
        component={Documents}
        initialParams={{ userId }}
        options={{
          title: "Go Back",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => {
                if (props.onPress) props.onPress();
              }}
            >
              <Icon
                name="arrow-back"
                color="#6366f1"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        initialParams={{ userId }}
        options={{
          title: "Go Back",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => {
                if (props.onPress) props.onPress();
              }}
            >
              <Icon
                name="arrow-back"
                color="#6366f1"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="UsersReviews"
        component={UsersReviews}
        options={{
          title: "Go Back",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => {
                if (props.onPress) props.onPress();
              }}
            >
              <Icon
                name="arrow-back"
                color="#6366f1"
                size={30}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export default function OwnerTabs({
  userId,
  role,
}: {
  userId: string;
  role?: Role;
}) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="OwnerDashboardScreens"
        component={OwnerDashboardScreens}
        initialParams={{ userId, role }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/navbar/dashboard-hover.png")
                  : require("../../assets/navbar/dashboard.png")
              }
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="OwnerStackScreens"
        component={OwnerStackScreens}
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/navbar/home-hover.png")
                  : require("../../assets/navbar/home.png")
              }
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
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
                  ? require("../../assets/navbar/write-hover.png")
                  : require("../../assets/navbar/write.png")
              }
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="OwnerChatScreens"
        component={OwnerChatScreens}
        initialParams={{ userId, role }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/navbar/chat-hover.png")
                  : require("../../assets/navbar/chat.png")
              }
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="OwnerProfileScreens"
        component={OwnerProfileScreens}
        initialParams={{ userId, editable: true }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/navbar/avatar-hover.png")
                  : require("../../assets/navbar/avatar.png")
              }
              className={` ${Platform.OS === "ios" ? "mt-5" : "mt-2"} h-6 w-6`}
            />
          ),
          tabBarLabel: "",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
