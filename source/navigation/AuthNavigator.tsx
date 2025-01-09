import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from 'source/screens/auth/LoginScreen';
import useFetchData from '@/hooks/useFetchData';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  useFetchData()
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen}   options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

