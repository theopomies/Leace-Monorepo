import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { CreatePost } from "../../screens/CreatePost";
import { EditPost, PostStack, ShowPost } from "../../screens/Post";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EditProfile, ShowProfile } from "../../screens/Profile";

const Tab = createBottomTabNavigator<TabStackParamList>();

const Provider = ({ userId }: { userId: string }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <Tab.Navigator>
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
      {/**
    <Tab.Screen
      name="Match"
      component={() => (
        <View>
          <Text>Match</Text>
        </View>
      )}
      options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused
            ? "star-four-points"
            : "star-four-points-outline";

          return (
            <View>
              {focused ? (
                <Icon name={icon} type="material-community" />
              ) : (
                <Icon name={icon} type="material-community" />
              )}
            </View>
          );
        },
        tabBarLabel: "",
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="CreatePostAttributes"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>CreateAttributes</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="ViewPost"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>ViewPost</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="PostDetails"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>PostDetails</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Portal"
      component={() => (
        <View>
          <Text>Portal</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />

    <Tab.Screen
      name="MatchChat"
      component={() => (
        <View>
          <Text>MatchChat</Text>
        </View>
      )}
      options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? "chat" : "chat-bubble-outline";

          return (
            <View>
              {focused ? (
                <Icon name={icon} type="material" />
              ) : (
                <Icon name={icon} type="material" />
              )}
            </View>
          );
        },
        tabBarLabel: "",
        headerShown: false,
      }}
    />

    <Tab.Screen
      name="Dashboard"
      component={() => (
        <View>
          <Text>Dashboard</Text>
        </View>
      )}
      initialParams={{ userId }}
      options={{
        tabBarIcon: ({ focused }) => {
          const icon = focused ? "view-dashboard" : "view-dashboard-outline";

          return (
            <View>
              {focused ? (
                <Icon name={icon} color="#002642" type="material-community" />
              ) : (
                <Icon name={icon} color="#002642" type="material-community" />
              )}
            </View>
          );
        },
        tabBarLabel: "",
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Expenses"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Expense</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Income"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Income</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Clients"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Clients</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Occupied"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Occupied</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Available"
      initialParams={{ userId }}
      component={() => (
        <View>
          <Text>Available</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="Chat"
      component={() => (
        <View>
          <Text>Chat</Text>
        </View>
      )}
      options={{
        tabBarButton: () => null,
        headerShown: false,
        tabBarStyle: {
          display: "none",
        },
      }}
    />

    <Tab.Screen
      name="Lease"
      component={() => (
        <View>
          <Text>Lease</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    />
    <Tab.Screen
      name="UpdateLease"
      component={() => (
        <View>
          <Text>UpdateLease</Text>
        </View>
      )}
      options={{ tabBarButton: () => null, headerShown: false }}
    /> */}
    </Tab.Navigator>
  );
};

export default Provider;