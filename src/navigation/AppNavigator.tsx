import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';

export const AppNavigator = () => {
  // Tạm thời hardcode biến này. Sau này sẽ dùng Zustand kết hợp AsyncStorage
  const isAuthenticated = false; 

  return (
    <NavigationContainer>
      {/* Sau này tạo xong MainNavigator thì thay thế vào chỗ <></> */}
      {isAuthenticated ? <></> : <AuthNavigator />}
    </NavigationContainer>
  );
};