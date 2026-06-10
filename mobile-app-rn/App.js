import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import OfficerDashboard from './src/screens/OfficerDashboard';
import IssueFineScreen from './src/screens/IssueFineScreen';
import FineLookupScreen from './src/screens/FineLookupScreen';
import PaymentScreen from './src/screens/PaymentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="FineLookup"
          screenOptions={{
            headerStyle: { backgroundColor: '#050505' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', color: '#06b6d4' },
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          
          {/* Officer Flow */}
          <Stack.Screen 
            name="OfficerDashboard" 
            component={OfficerDashboard} 
            options={{ title: 'Dashboard', headerBackVisible: false }} 
          />
          <Stack.Screen 
            name="IssueFine" 
            component={IssueFineScreen} 
            options={{ title: 'Issue Fine' }} 
          />

          {/* Public Flow */}
          <Stack.Screen 
            name="FineLookup" 
            component={FineLookupScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Payment" 
            component={PaymentScreen} 
            options={{ title: 'Complete Payment' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
