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
import { SCREENS } from '../Constant';

const Stack = createStackNavigator();
const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={SCREENS.SPLASH}
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    ...TransitionPresets.SlideFromRightIOS
                }}
            >
                <Stack.Screen name={SCREENS.SPLASH} component={splash} />
                <Stack.Screen name={SCREENS.LOGIN} component={Login} />
                <Stack.Screen name={SCREENS.SIGNUP} component={SignUp} />
                <Stack.Screen name={SCREENS.TAB} component={TabNavigator} />
                <Stack.Screen name={SCREENS.CHAT} component={Chat} />
                <Stack.Screen name={SCREENS.SHOWFULL} component={showfull}
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: 'black',
                        },
                        headerTintColor: 'white'
                    }} />
                <Stack.Screen name={SCREENS.CALLING} component={CallingScreen}
                    options={{
                        headerShown: false,
                    }} />

                <Stack.Screen name={SCREENS.INCOMMING_CALL} component={IncomingCallScreen}
                    options={{
                        headerShown: false,
                        gestureDirection: 'vertical', ...TransitionPresets.DefaultTransition
                    }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default StackNavigator;