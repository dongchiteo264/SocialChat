import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Login from '../screen/Login';
import splash from '../components/splash';
import SignUp from '../screen/SignUp';
import TabNavigator from './TabNavigation';
import Chat from '../screen/Chat';
import showfull from '../screen/ShowFull';
import CallingScreen from '../screen/CallingScreen';
import IncomingCallScreen from '../screen/IncomingCallScreen';

const Stack = createStackNavigator();
const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='splash'
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    ...TransitionPresets.SlideFromRightIOS
                }}
            >
                <Stack.Screen name="splash" component={splash} />
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="signup" component={SignUp} />
                <Stack.Screen name="tab" component={TabNavigator} />
                <Stack.Screen name="chat" component={Chat} />
                <Stack.Screen name="showfull" component={showfull} options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTintColor: 'white'
                }} />
                <Stack.Screen name="callingscreen" component={CallingScreen} options={{
                    headerShown: false,
                }} />

                <Stack.Screen name="incommingcallscreen" component={IncomingCallScreen} options={{
                    headerShown: false,
                    gestureDirection: 'vertical', ...TransitionPresets.DefaultTransition
                }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default StackNavigator;