import React from 'react'
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Dashboard, Expenses, Income, Clients, Occupied, Available, Chat } from '../../screens/Dashboard';
import { Match, MatchChat } from '../../screens/Match';
import { CreatePost, CreateAttributes, ViewPost, ViewDetails } from '../../screens/Post';
import { Stack } from '../../screens/Stack/stack';
import { Contract } from "../../screens/Contract/contract";
import Role from '../../screens/Role/role';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabStackParamList } from '../../navigation/TabNavigator';
import { UserRoles } from '../../utils/enum';

const Tab = createBottomTabNavigator<TabStackParamList>();

const Provider = ({ role }: { role: keyof typeof UserRoles }) => {
    return (
        <Tab.Navigator>
            {role === null || role === undefined ? (
                <Tab.Screen name="Role" component={Role}
                    options={{
                        tabBarStyle: {
                            display: "none"
                        },
                        tabBarLabel: '',
                        headerShown: false,
                        tabBarButton: () => null
                    }}
                />
            ) : null}
            <Tab.Screen name="Stack" component={Stack}
                options={{
                    tabBarIcon: ({ focused }) => {
                        const icon = focused ? 'favorite' : 'favorite-border';
                        return (
                            <View>
                                <Icon name={icon} color="#002642" />
                            </View>
                        );
                    },
                    tabBarLabel: '',
                    headerShown: false,
                }}
            />

            <Tab.Screen name="Match" component={Match} options={{
                tabBarIcon: ({ focused }) => {
                    const icon = focused ? 'star-four-points' : 'star-four-points-outline'

                    return (
                        <View>
                            {focused ?
                                <Icon name={icon} type="material-community" />
                                :
                                <Icon name={icon} type="material-community" />
                            }
                        </View>
                    );
                },
                tabBarLabel: '',
                headerShown: false
            }} />

            <Tab.Screen name="CreatePost" component={CreatePost} options={{
                tabBarIcon: ({ focused }) => {
                    const icon = focused ? 'plus-square' : 'plus-square-o'

                    return (
                        <View>
                            {focused ?
                                <Icon name={icon} color="#002642" type="font-awesome" />
                                :
                                <Icon name={icon} color="#002642" type="font-awesome" />
                            }
                        </View>
                    );
                },
                tabBarLabel: '',
                headerShown: false,
            }} />
            <Tab.Screen name="CreatePostAttributes" component={CreateAttributes} options={{ tabBarButton: () => null, headerShown: false }} />
            <Tab.Screen name="ViewPost" component={ViewPost} options={{ tabBarButton: () => null, headerShown: false }} />
            <Tab.Screen name="PostDetails" component={ViewDetails} options={{ tabBarButton: () => null, headerShown: false }} />

            <Tab.Screen name="MatchChat" component={MatchChat} options={{
                tabBarIcon: ({ focused }) => {
                    const icon = focused ? 'chat' : 'chat-bubble-outline'

                    return (
                        <View>
                            {focused ?
                                <Icon name={icon} type="material" />
                                :
                                <Icon name={icon} type="material" />
                            }
                        </View>
                    );
                },
                tabBarLabel: '',
                headerShown: false
            }} />

            <Tab.Screen name="Dashboard" component={Dashboard} options={{
                tabBarIcon: ({ focused }) => {
                    const icon = focused ? 'view-dashboard' : 'view-dashboard-outline'

                    return (
                        <View>
                            {focused ?
                                <Icon name={icon} color="#002642" type="material-community" />
                                :
                                <Icon name={icon} color="#002642" type="material-community" />
                            }
                        </View>
                    );
                },
                tabBarLabel: '',
                headerShown: false
            }} />
            <Tab.Screen name="Expenses" component={Expenses} options={{ tabBarButton: () => null, headerShown: false }} />
            <Tab.Screen name="Income" component={Income} options={{ tabBarButton: () => null, headerShown: false }} />
            <Tab.Screen name="Clients" component={Clients} options={{ tabBarButton: () => null, headerShown: false }} />
            <Tab.Screen name="Occupied" component={Occupied} options={{ tabBarButton: () => null, headerShown: false }} />
            <Tab.Screen name="Available" component={Available} options={{ tabBarButton: () => null, headerShown: false }} />
            <Tab.Screen name="Chat" component={Chat} options={{
                tabBarButton: () => null, headerShown: false, tabBarStyle: {
                    display: "none"
                }
            }} />

            <Tab.Screen name="Contract" component={Contract} options={{ tabBarButton: () => null, headerShown: false }} />
        </Tab.Navigator>
    )
}

export default Provider