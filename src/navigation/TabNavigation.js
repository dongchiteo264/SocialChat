import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeChat from '../screen/HomeChat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Person from '../screen/Person';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName='home'
            screenOptions={{
               headerShown:false,
               tabBarLabelStyle:{
                   fontSize:12,
                   marginBottom:3
               },
               tabBarStyle:{
                   padding:0,
                   marginTop:1,
               },
               tabBarIconStyle:{
                   padding:0,
                   marginTop:3,
               },
            }}
        >
            <Tab.Screen name="home" component={HomeChat} options={{
                tabBarLabel: 'Chat',
                tabBarIcon: ({ focused, color }) => {
                    return <Ionicons name='md-chatbubble-outline' size={24} color={color} />
                },

            }} />
            <Tab.Screen name="contact" component={HomeChat} options={{
                tabBarLabel: 'Liên hệ',
                tabBarIcon: ({ color }) => {
                    return <AntDesign name='contacts' color={color} size={24} />
                }
            }} />
            <Tab.Screen name="newfeed" component={HomeChat} options={{
                tabBarLabel: 'Bảng tin',
                tabBarIcon: ({ color }) => {
                    return <FontAwesome name='list-alt' size={24} color={color} />
                }
            }} />
            <Tab.Screen name="person" component={Person} options={{
                tabBarLabel: 'Tôi',
                tabBarIcon: ({ focused, color }) => {
                    return <Ionicons name='person-outline' size={24} color={color} />
                },
            }} />
        </Tab.Navigator>
    );
}
export default TabNavigator;