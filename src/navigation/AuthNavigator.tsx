import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// PHẢI CÓ ngoặc nhọn bao quanh LoginScreen
import LoginScreen from '../screens/LoginScreen/LoginScreen'; 

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};