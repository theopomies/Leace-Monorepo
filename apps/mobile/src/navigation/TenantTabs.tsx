import { useRoute, RouteProp } from "@react-navigation/native";
import { TouchableOpacity, Platform, Image } from "react-native";
import { Icon } from "react-native-elements";
import { ShowPost } from "../screens/Post";
import { TenantOffers, Result } from "../screens/Premium";
import { ShowProfile } from "../screens/Profile";
import { TenantStack } from "../screens/Stack";
import { OwnerChatScreens, OwnerProfileScreens } from "./OwnerTabs";
import { TabStackParamList } from "./RootNavigator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Role } from "@leace/db";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TenantStackScreens() {
  const route = useRoute<RouteProp<TabStackParamList, "OwnerChatScreens">>();
  const { userId, role } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Stack"
        component={TenantStack}
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
        name="ViewProfile"
        initialParams={{ userId, editable: false }}
        component={ShowProfile}
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

function TenantPremiumScreens() {
  const route =
    useRoute<RouteProp<TabStackParamList, "TenantPremiumScreens">>();
  const { userId } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Premium"
        initialParams={{ userId }}
        component={TenantOffers}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="PaymentResults"
        component={Result}
        initialParams={{ userId }}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export default function TenantTabs({
  userId,
  role,
}: {
  userId: string;
  role?: Role;
}) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TenantStackScreens"
        component={TenantStackScreens}
        initialParams={{ userId, role }}
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
      ></Tab.Screen>
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
        name="TenantPremiumScreens"
        component={TenantPremiumScreens}
        initialParams={{ userId, role }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/navbar/crown-hover.png")
                  : require("../../assets/navbar/crown.png")
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
