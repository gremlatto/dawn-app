import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRegistry } from 'react-native';

import PaymentScreen from './screens/PaymentScreen';
import DashboardScreen from './screens/DashboardScreen';
import GratitudeScreen from './screens/GratitudeScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="DashboardScreen"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="GratitudeScreen" component={GratitudeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;