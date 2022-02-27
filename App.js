import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import StackNavigator from './src/navigation/StackNavigator';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor={'white'} />
      <SafeAreaView style={{ flex: 1 }}>
        <StackNavigator />
      </SafeAreaView>
    </>
  )
}
export default App;