import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRegistry } from 'react-native';

import PaymentScreen2 from './screens/PaymentScreen2';
import DashboardScreen from './screens/DashboardScreen';
import GratitudeScreen from './screens/GratitudeScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Payment"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Payment" component={PaymentScreen2} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Gratitude" component={GratitudeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App; 