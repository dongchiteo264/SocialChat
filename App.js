import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen';
import StackNavigator from './src/navigation/StackNavigator';

const App = () => {
  useEffect(() => {
    const unsub = setTimeout(() => {
      SplashScreen.hide();
    }, 0);
    return () => clearTimeout(unsub)
  }, [])

  return (
    <StackNavigator />
  )
}
export default App;