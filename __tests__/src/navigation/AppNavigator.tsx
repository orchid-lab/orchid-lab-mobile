import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
// Import MainNavigator (dành cho Admin/Researcher) vào đây sau này

export const AppNavigator = () => {
  // Tạm thời hardcode biến này. Sau này sẽ dùng Zustand để lấy trạng thái thật
  const isAuthenticated = false; 

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        {/* <MainNavigator /> */}
        <></> 
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};