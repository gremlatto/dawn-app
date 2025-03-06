import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PaymentScreen from './screens/PaymentScreen';
import DashboardScreen from './screens/DashboardScreen';
import GratitudeScreen from './screens/GratitudeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Payment"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Gratitude" component={GratitudeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 