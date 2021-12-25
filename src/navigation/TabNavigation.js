import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeChat from '../screen/HomeChat';
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName='home'
            screenOptions={{
                tabBarIndicatorStyle: {
                    height: 0, width: 0, elevation: 0
                },
                tabBarStyle: {
                    borderTopWidth: 0.5,
                    justifyContent: 'space-between',
                    padding: 0
                },
                tabBarActiveTintColor: '#3399FF',
                tabBarInactiveTintColor: 'black',
                tabBarContentContainerStyle: {
                    padding: 0,
                    height: 50
                }
            }}
            tabBarPosition='bottom'
        >
            <Tab.Screen name="home" component={HomeChat} options={{
                tabBarIcon: ({ focused }) => {

                },
             
            

            }} />
            <Tab.Screen name="friend" component={HomeChat} />
            <Tab.Screen name="newfeed" component={HomeChat} />
            <Tab.Screen name="person" component={HomeChat} />
        </Tab.Navigator>
    );
}
export default TabNavigator;